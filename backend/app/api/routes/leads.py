from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import List, Optional
from datetime import datetime
import json
from app.database.connection import get_db
from app.database.models import Lead
from pydantic import BaseModel

router = APIRouter()

class LeadResponse(BaseModel):
    id: str
    owner_name: str
    owner_name_en: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    property_type: Optional[str] = None
    location: Optional[str] = None
    property_value: Optional[float] = None
    commission_potential: Optional[float] = None
    status: str
    lead_score: int
    urgency: str
    source: str
    automation_stage: Optional[str] = None
    last_contact: Optional[datetime] = None
    best_call_time: Optional[str] = None
    tags: Optional[List[str]] = None
    notes: Optional[str] = None
    created_at: datetime
    
    class Config:
        orm_mode = True

class LeadCreate(BaseModel):
    owner_name: str
    owner_name_en: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    property_type: Optional[str] = None
    location: Optional[str] = None
    property_value: Optional[float] = None
    source: str = "manual"

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
    property_image: str

@router.get("/call-queue", response_model=List[CallQueueLead])
async def get_call_queue(db: Session = Depends(get_db)):
    """Get priority leads ready for calling"""
    
    # Get high-priority leads
    leads = db.query(Lead).filter(
        Lead.status.in_(["interested", "responded", "new"]),
        Lead.lead_score >= 70
    ).order_by(desc(Lead.lead_score)).limit(20).all()
    
    # Convert to call queue format
    call_queue_leads = []
    for lead in leads:
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
            last_response=lead.notes or "Initial contact needed",
            response_time="2 hours ago" if lead.last_contact else "No response yet",
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
    
    # Convert leads and parse tags
    result = []
    for lead in leads:
        lead_dict = {
            "id": lead.id,
            "owner_name": lead.owner_name,
            "owner_name_en": lead.owner_name_en,
            "phone": lead.phone,
            "email": lead.email,
            "property_type": lead.property_type,
            "location": lead.location,
            "property_value": lead.property_value,
            "commission_potential": lead.commission_potential,
            "status": lead.status,
            "lead_score": lead.lead_score,
            "urgency": lead.urgency,
            "source": lead.source,
            "automation_stage": lead.automation_stage,
            "last_contact": lead.last_contact,
            "best_call_time": lead.best_call_time,
            "notes": lead.notes,
            "created_at": lead.created_at,
            "tags": json.loads(lead.tags) if lead.tags else []
        }
        result.append(LeadResponse(**lead_dict))
    
    return result

@router.get("/stats")
async def get_lead_stats(db: Session = Depends(get_db)):
    """Get lead statistics for dashboard"""
    
    total_leads = db.query(func.count(Lead.id)).scalar() or 0
    new_leads = db.query(func.count(Lead.id)).filter(Lead.status == "new").scalar() or 0
    qualified_leads = db.query(func.count(Lead.id)).filter(Lead.status == "interested").scalar() or 0
    converted_leads = db.query(func.count(Lead.id)).filter(Lead.status == "converted").scalar() or 0
    
    return {
        "total_leads": total_leads,
        "new_leads": new_leads,
        "qualified_leads": qualified_leads,
        "converted_leads": converted_leads,
        "conversion_rate": round((converted_leads / total_leads * 100) if total_leads > 0 else 0, 1)
    }

@router.get("/{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: str, db: Session = Depends(get_db)):
    """Get specific lead details"""
    
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    # Parse tags for response
    lead_dict = {
        "id": lead.id,
        "owner_name": lead.owner_name,
        "owner_name_en": lead.owner_name_en,
        "phone": lead.phone,
        "email": lead.email,
        "property_type": lead.property_type,
        "location": lead.location,
        "property_value": lead.property_value,
        "commission_potential": lead.commission_potential,
        "status": lead.status,
        "lead_score": lead.lead_score,
        "urgency": lead.urgency,
        "source": lead.source,
        "automation_stage": lead.automation_stage,
        "last_contact": lead.last_contact,
        "best_call_time": lead.best_call_time,
        "notes": lead.notes,
        "created_at": lead.created_at,
        "tags": json.loads(lead.tags) if lead.tags else []
    }
    
    return LeadResponse(**lead_dict)

@router.post("/", response_model=LeadResponse)
async def create_lead(lead_data: LeadCreate, db: Session = Depends(get_db)):
    """Create a new lead"""
    
    lead_dict = lead_data.dict()
    lead_dict['tags'] = json.dumps([])  # Empty tags array as JSON string
    
    lead = Lead(**lead_dict)
    db.add(lead)
    db.commit()
    db.refresh(lead)
    
    # Parse tags for response
    response_dict = {
        "id": lead.id,
        "owner_name": lead.owner_name,
        "owner_name_en": lead.owner_name_en,
        "phone": lead.phone,
        "email": lead.email,
        "property_type": lead.property_type,
        "location": lead.location,
        "property_value": lead.property_value,
        "commission_potential": lead.commission_potential,
        "status": lead.status,
        "lead_score": lead.lead_score,
        "urgency": lead.urgency,
        "source": lead.source,
        "automation_stage": lead.automation_stage,
        "last_contact": lead.last_contact,
        "best_call_time": lead.best_call_time,
        "notes": lead.notes,
        "created_at": lead.created_at,
        "tags": json.loads(lead.tags) if lead.tags else []
    }
    
    return LeadResponse(**response_dict)

@router.put("/{lead_id}/status")
async def update_lead_status(
    lead_id: str,
    status: str,
    notes: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Update lead status"""
    
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    lead.status = status
    if notes:
        lead.notes = notes
    lead.updated_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Lead status updated successfully"}

@router.delete("/{lead_id}")
async def delete_lead(lead_id: str, db: Session = Depends(get_db)):
    """Delete a lead"""
    
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    db.delete(lead)
    db.commit()
    
    return {"message": "Lead deleted successfully"} 