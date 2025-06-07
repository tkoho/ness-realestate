from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import List, Optional
from datetime import datetime, timedelta
from app.database.connection import get_db
from app.database.models import AutomationSequence, Lead
from pydantic import BaseModel

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
    template: Optional[str] = None
    last_sent: Optional[datetime] = None
    next_execution: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        orm_mode = True

class AutomationSequenceCreate(BaseModel):
    name: str
    type: str
    template: str
    daily_limit: int = 50

class AutomationStatsResponse(BaseModel):
    total_sequences: int
    active_sequences: int
    paused_sequences: int
    total_leads_in_automation: int
    messages_sent_today: int
    success_rate: float

@router.get("/sequences", response_model=List[AutomationSequenceResponse])
async def get_automation_sequences(db: Session = Depends(get_db)):
    """Get all automation sequences with current status"""
    
    sequences = db.query(AutomationSequence).order_by(desc(AutomationSequence.created_at)).all()
    return sequences

@router.get("/sequences/{sequence_id}", response_model=AutomationSequenceResponse)
async def get_automation_sequence(sequence_id: str, db: Session = Depends(get_db)):
    """Get specific automation sequence"""
    
    sequence = db.query(AutomationSequence).filter(AutomationSequence.id == sequence_id).first()
    if not sequence:
        raise HTTPException(status_code=404, detail="Automation sequence not found")
    
    return sequence

@router.post("/sequences", response_model=AutomationSequenceResponse)
async def create_automation_sequence(sequence_data: AutomationSequenceCreate, db: Session = Depends(get_db)):
    """Create a new automation sequence"""
    
    sequence = AutomationSequence(**sequence_data.dict())
    db.add(sequence)
    db.commit()
    db.refresh(sequence)
    
    return sequence

@router.put("/sequences/{sequence_id}/status")
async def update_sequence_status(
    sequence_id: str,
    status: str,
    db: Session = Depends(get_db)
):
    """Update automation sequence status (active, paused, stopped)"""
    
    if status not in ["active", "paused", "stopped"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    sequence = db.query(AutomationSequence).filter(AutomationSequence.id == sequence_id).first()
    if not sequence:
        raise HTTPException(status_code=404, detail="Automation sequence not found")
    
    sequence.status = status
    sequence.updated_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": f"Sequence {status} successfully"}

@router.post("/sequences/{sequence_id}/pause")
async def pause_sequence(sequence_id: str, db: Session = Depends(get_db)):
    """Pause an automation sequence"""
    return await update_sequence_status(sequence_id, "paused", db)

@router.post("/sequences/{sequence_id}/resume")
async def resume_sequence(sequence_id: str, db: Session = Depends(get_db)):
    """Resume an automation sequence"""
    return await update_sequence_status(sequence_id, "active", db)

@router.delete("/sequences/{sequence_id}")
async def delete_sequence(sequence_id: str, db: Session = Depends(get_db)):
    """Delete an automation sequence"""
    
    sequence = db.query(AutomationSequence).filter(AutomationSequence.id == sequence_id).first()
    if not sequence:
        raise HTTPException(status_code=404, detail="Automation sequence not found")
    
    db.delete(sequence)
    db.commit()
    
    return {"message": "Sequence deleted successfully"}

@router.get("/stats", response_model=AutomationStatsResponse)
async def get_automation_stats(db: Session = Depends(get_db)):
    """Get automation statistics for dashboard"""
    
    total_sequences = db.query(func.count(AutomationSequence.id)).scalar() or 0
    active_sequences = db.query(func.count(AutomationSequence.id)).filter(
        AutomationSequence.status == "active"
    ).scalar() or 0
    paused_sequences = db.query(func.count(AutomationSequence.id)).filter(
        AutomationSequence.status == "paused"
    ).scalar() or 0
    
    # Calculate total leads in automation
    total_leads_in_automation = db.query(func.sum(AutomationSequence.leads_in_sequence)).scalar() or 0
    
    # Calculate messages sent today (sum of sent_today for all sequences)
    messages_sent_today = db.query(func.sum(AutomationSequence.sent_today)).scalar() or 0
    
    # Calculate average success rate
    avg_success_rate = db.query(func.avg(AutomationSequence.success_rate)).scalar() or 0.0
    
    return AutomationStatsResponse(
        total_sequences=total_sequences,
        active_sequences=active_sequences,
        paused_sequences=paused_sequences,
        total_leads_in_automation=total_leads_in_automation,
        messages_sent_today=messages_sent_today,
        success_rate=round(avg_success_rate, 1)
    )

@router.get("/performance")
async def get_automation_performance(db: Session = Depends(get_db)):
    """Get automation performance metrics"""
    
    sequences = db.query(AutomationSequence).all()
    
    performance_data = []
    for sequence in sequences:
        performance_data.append({
            "id": sequence.id,
            "name": sequence.name,
            "type": sequence.type,
            "leads_in_sequence": sequence.leads_in_sequence,
            "success_rate": sequence.success_rate,
            "sent_today": sequence.sent_today,
            "daily_limit": sequence.daily_limit,
            "status": sequence.status
        })
    
    return {
        "sequences": performance_data,
        "summary": {
            "total_active": len([s for s in sequences if s.status == "active"]),
            "total_leads": sum(s.leads_in_sequence for s in sequences),
            "avg_success_rate": round(sum(s.success_rate for s in sequences) / len(sequences) if sequences else 0, 1),
            "messages_sent_today": sum(s.sent_today for s in sequences)
        }
    } 