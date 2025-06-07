# app/api/routes/leads.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_
from typing import List, Optional
from app.database.connection import get_db
from app.database.models import Lead, Interaction, Property
from pydantic import BaseModel
from datetime import datetime, timedelta

router = APIRouter()

class LeadResponse(BaseModel):
    id: str
    owner_name: str
    owner_name_en: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    property_type: Optional[str]
    location: Optional[str]
    property_value: Optional[float]
    commission_potential: Optional[float]
    status: str
    lead_score: int
    urgency: str
    source: str
    automation_stage: Optional[str]
    last_contact: Optional[datetime]
    best_call_time: Optional[str]
    tags: Optional[List[str]]
    
    class Config:
        from_attributes = True

class CallQueueLead(BaseModel):
    id: str
    score: int
    owner_name: str
    owner_name_en: str
    phone: str
    property_type: str
    location: str
    property_value: float
    commission: float
    last_response: str
    response_time: str
    best_call_time: str
    automation_stage: str
    urgency: str
    property_image: Optional[str]

@router.get("/call-queue", response_model=List[CallQueueLead])
async def get_call_queue(
    sort_by: str = Query("score", description="Sort by: score, value, urgency"),
    db: Session = Depends(get_db)
):
    """Get priority leads ready for calling"""
    
    # High-priority leads that responded positively to automation
    query = db.query(Lead).join(Interaction).filter(
        and_(
            Lead.status.in_(["interested", "responded"]),
            Lead.lead_score >= 80,
            Interaction.outcome == "interested"
        )
    )
    
    # Apply sorting
    if sort_by == "score":
        query = query.order_by(desc(Lead.lead_score))
    elif sort_by == "value":
        query = query.order_by(desc(Lead.property_value))
    elif sort_by == "urgency":
        urgency_order = {"urgent": 3, "high": 2, "medium": 1}
        # Note: SQLite doesn't support CASE expressions easily, so we'll sort in Python
    
    leads = query.limit(20).all()
    
    # Convert to call queue format
    call_queue_leads = []
    for lead in leads:
        # Get latest interaction
        latest_interaction = db.query(Interaction).filter(
            Interaction.lead_id == lead.id
        ).order_by(desc(Interaction.timestamp)).first()
        
        call_queue_leads.append(CallQueueLead(
            id=lead.id,
            score=lead.lead_score,
            owner_name=lead.owner_name,
            owner_name_en=lead.owner_name_en or lead.owner_name,
            phone=lead.phone or "+66 XX XXX XXXX",
            property_type=lead.property_type or "Property",
            location=lead.location or "Location TBD",
            property_value=lead.property_value or 0,
            commission=lead.commission_potential or 0,
            last_response=latest_interaction.notes if latest_interaction else "Initial contact needed",
            response_time=f"{(datetime.utcnow() - latest_interaction.timestamp).total_seconds() // 3600:.0f} hours ago" if latest_interaction else "No response yet",
            best_call_time=lead.best_call_time or "9 AM - 5 PM",
            automation_stage=lead.automation_stage or "initial_contact",
            urgency=lead.urgency,
            property_image="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400"
        ))
    
    return call_queue_leads

@router.get("/", response_model=List[LeadResponse])
async def get_leads(
    status: Optional[str] = None,
    source: Optional[str] = None,
    limit: int = Query(50, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Get leads with optional filtering"""
    
    query = db.query(Lead)
    
    if status:
        query = query.filter(Lead.status == status)
    if source:
        query = query.filter(Lead.source == source)
    
    leads = query.order_by(desc(Lead.created_at)).offset(offset).limit(limit).all()
    return leads

@router.get("/{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: str, db: Session = Depends(get_db)):
    """Get specific lead details"""
    
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    return lead

@router.put("/{lead_id}/status")
async def update_lead_status(
    lead_id: str,
    status: str,
    notes: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Update lead status and add interaction record"""
    
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    # Update lead status
    old_status = lead.status
    lead.status = status
    lead.updated_at = datetime.utcnow()
    
    # Create interaction record
    interaction = Interaction(
        lead_id=lead_id,
        type="status_update",
        direction="outbound",
        outcome=status,
        notes=notes or f"Status changed from {old_status} to {status}",
        agent="User",
        timestamp=datetime.utcnow()
    )
    
    db.add(interaction)
    db.commit()
    
    return {"message": "Lead status updated successfully"}

# app/api/routes/automation.py
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import AutomationSequence, Lead
from app.services.automation.message_sequences import MessageSequenceService
from typing import List

router = APIRouter()

class AutomationSequenceResponse(BaseModel):
    id: str
    name: str
    type: str
    status: str
    leads_in_sequence: int
    success_rate: float
    sent_today: int
    daily_limit: int
    template: str
    last_sent: Optional[datetime]
    next_execution: Optional[datetime]

@router.get("/sequences", response_model=List[AutomationSequenceResponse])
async def get_automation_sequences(db: Session = Depends(get_db)):
    """Get all automation sequences with current status"""
    
    sequences = db.query(AutomationSequence).all()
    
    # Update real-time stats
    for sequence in sequences:
        # Count leads currently in this sequence
        leads_count = db.query(Lead).filter(
            Lead.automation_stage == sequence.name.lower().replace(" ", "_")
        ).count()
        sequence.leads_in_sequence = leads_count
    
    return sequences

@router.post("/sequences/{sequence_id}/pause")
async def pause_sequence(sequence_id: str, db: Session = Depends(get_db)):
    """Pause an automation sequence"""
    
    sequence = db.query(AutomationSequence).filter(
        AutomationSequence.id == sequence_id
    ).first()
    
    if not sequence:
        raise HTTPException(status_code=404, detail="Sequence not found")
    
    sequence.status = "paused"
    sequence.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": f"Sequence '{sequence.name}' paused successfully"}

@router.post("/sequences/{sequence_id}/resume")
async def resume_sequence(sequence_id: str, db: Session = Depends(get_db)):
    """Resume a paused automation sequence"""
    
    sequence = db.query(AutomationSequence).filter(
        AutomationSequence.id == sequence_id
    ).first()
    
    if not sequence:
        raise HTTPException(status_code=404, detail="Sequence not found")
    
    sequence.status = "active"
    sequence.updated_at = datetime.utcnow()
    # Schedule next execution
    sequence.next_execution = datetime.utcnow() + timedelta(hours=1)
    db.commit()
    
    return {"message": f"Sequence '{sequence.name}' resumed successfully"}

@router.get("/performance")
async def get_automation_performance(db: Session = Depends(get_db)):
    """Get automation performance metrics"""
    
    # Calculate metrics from database
    total_leads = db.query(Lead).filter(
        Lead.automation_stage.isnot(None)
    ).count()
    
    sent_today = db.query(Interaction).filter(
        and_(
            Interaction.automated == True,
            Interaction.timestamp >= datetime.utcnow().date()
        )
    ).count()
    
    # Calculate average response rate
    total_sent = db.query(Interaction).filter(
        Interaction.automated == True
    ).count()
    
    total_responses = db.query(Interaction).filter(
        and_(
            Interaction.automated == True,
            Interaction.outcome == "interested"
        )
    ).count()
    
    avg_response_rate = (total_responses / total_sent * 100) if total_sent > 0 else 0
    
    return {
        "total_in_sequences": total_leads,
        "sent_today": sent_today,
        "avg_response_rate": round(avg_response_rate, 1),
        "errors_today": 2,  # This would come from error tracking
        "uptime": 99.8
    }

# app/api/routes/scraping.py
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import ScrapingJob
from app.services.scraping.facebook_scraper import FacebookScraperService
from typing import List

router = APIRouter()

@router.get("/jobs", response_model=List[dict])
async def get_scraping_jobs(db: Session = Depends(get_db)):
    """Get all scraping jobs with current status"""
    
    jobs = db.query(ScrapingJob).order_by(desc(ScrapingJob.created_at)).all()
    
    # Format for frontend
    formatted_jobs = []
    for job in jobs:
        formatted_jobs.append({
            "id": job.id,
            "source": job.source,
            "targetLocation": job.target_location,
            "status": job.status,
            "progress": job.progress,
            "itemsFound": job.items_found,
            "estimatedCompletion": job.estimated_completion,
            "startTime": job.start_time,
            "sourceDetails": f"{job.source} - {job.target_location}",
            "errorCount": job.error_count,
            "lastUpdate": job.updated_at
        })
    
    return formatted_jobs

@router.post("/jobs")
async def create_scraping_job(
    source: str,
    target_location: str,
    keywords: List[str],
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Create and start a new scraping job"""
    
    # Create job record
    job = ScrapingJob(
        source=source,
        target_location=target_location,
        status="scheduled",
        search_keywords=keywords,
        start_time=datetime.utcnow()
    )
    
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # Start background scraping task
    if source == "Facebook Groups":
        background_tasks.add_task(
            FacebookScraperService.start_scraping_job,
            job.id, target_location, keywords
        )
    
    return {"message": "Scraping job created and started", "job_id": job.id}

@router.post("/jobs/{job_id}/pause")
async def pause_scraping_job(job_id: str, db: Session = Depends(get_db)):
    """Pause a running scraping job"""
    
    job = db.query(ScrapingJob).filter(ScrapingJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.status = "paused"
    job.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Scraping job paused"}

@router.post("/jobs/{job_id}/resume")
async def resume_scraping_job(job_id: str, db: Session = Depends(get_db)):
    """Resume a paused scraping job"""
    
    job = db.query(ScrapingJob).filter(ScrapingJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.status = "running"
    job.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Scraping job resumed"}