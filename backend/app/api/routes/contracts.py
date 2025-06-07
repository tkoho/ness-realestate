from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import List, Optional
from datetime import datetime, timedelta
from app.database.connection import get_db
from app.database.models import Contract
from pydantic import BaseModel

router = APIRouter()

class ContractResponse(BaseModel):
    id: str
    owner_name: str
    owner_name_en: Optional[str] = None
    property_type: Optional[str] = None
    location: Optional[str] = None
    property_value: Optional[float] = None
    listing_price: Optional[float] = None
    sale_price: Optional[float] = None
    commission_rate: float
    commission_amount: Optional[float] = None
    commission_earned: Optional[float] = None
    commission_paid: bool
    status: str
    date_signed: Optional[datetime] = None
    date_listed: Optional[datetime] = None
    date_sold: Optional[datetime] = None
    days_on_market: int
    views: int
    inquiries: int
    viewings: int
    offers: int
    notes: Optional[str] = None
    property_image: Optional[str] = None
    created_at: datetime
    
    class Config:
        orm_mode = True

class ContractCreate(BaseModel):
    owner_name: str
    owner_name_en: Optional[str] = None
    property_type: str
    location: str
    property_value: float
    listing_price: float
    commission_rate: float = 3.0
    status: str = "listed"
    notes: Optional[str] = None

class ContractStats(BaseModel):
    total_contracts: int
    active_listings: int
    sold_properties: int
    total_commission_earned: float
    total_commission_pending: float
    avg_days_on_market: float
    conversion_rate: float

@router.get("/", response_model=List[ContractResponse])
async def get_contracts(
    status: Optional[str] = None,
    limit: int = Query(50, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Get contracts with optional filtering"""
    
    query = db.query(Contract)
    
    if status:
        query = query.filter(Contract.status == status)
    
    contracts = query.order_by(desc(Contract.created_at)).offset(offset).limit(limit).all()
    return contracts

@router.get("/stats", response_model=ContractStats)
async def get_contract_stats(db: Session = Depends(get_db)):
    """Get contract statistics for dashboard"""
    
    total_contracts = db.query(func.count(Contract.id)).scalar() or 0
    active_listings = db.query(func.count(Contract.id)).filter(
        Contract.status.in_(["listed", "under_offer"])
    ).scalar() or 0
    sold_properties = db.query(func.count(Contract.id)).filter(
        Contract.status == "sold"
    ).scalar() or 0
    
    # Calculate commission totals
    total_commission_earned = db.query(func.sum(Contract.commission_earned)).filter(
        Contract.commission_paid == True
    ).scalar() or 0.0
    
    total_commission_pending = db.query(func.sum(Contract.commission_amount)).filter(
        Contract.commission_paid == False,
        Contract.status == "sold"
    ).scalar() or 0.0
    
    # Calculate average days on market
    avg_days_on_market = db.query(func.avg(Contract.days_on_market)).filter(
        Contract.status == "sold"
    ).scalar() or 0.0
    
    # Calculate conversion rate (sold / total)
    conversion_rate = (sold_properties / total_contracts * 100) if total_contracts > 0 else 0.0
    
    return ContractStats(
        total_contracts=total_contracts,
        active_listings=active_listings,
        sold_properties=sold_properties,
        total_commission_earned=total_commission_earned,
        total_commission_pending=total_commission_pending,
        avg_days_on_market=round(avg_days_on_market, 1),
        conversion_rate=round(conversion_rate, 1)
    )

@router.get("/{contract_id}", response_model=ContractResponse)
async def get_contract(contract_id: str, db: Session = Depends(get_db)):
    """Get specific contract details"""
    
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    return contract

@router.post("/", response_model=ContractResponse)
async def create_contract(contract_data: ContractCreate, db: Session = Depends(get_db)):
    """Create a new contract"""
    
    # Calculate commission amount
    commission_amount = (contract_data.listing_price * contract_data.commission_rate / 100) if contract_data.listing_price else 0
    
    contract_dict = contract_data.dict()
    contract_dict['commission_amount'] = commission_amount
    contract_dict['date_signed'] = datetime.utcnow()
    
    if contract_data.status == "listed":
        contract_dict['date_listed'] = datetime.utcnow()
    
    contract = Contract(**contract_dict)
    db.add(contract)
    db.commit()
    db.refresh(contract)
    
    return contract

@router.put("/{contract_id}/status")
async def update_contract_status(
    contract_id: str,
    status: str,
    sale_price: Optional[float] = None,
    notes: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Update contract status"""
    
    valid_statuses = ["listed", "under_offer", "sold", "expired"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    contract.status = status
    
    if status == "sold" and sale_price:
        contract.sale_price = sale_price
        contract.date_sold = datetime.utcnow()
        # Recalculate commission based on actual sale price
        contract.commission_earned = sale_price * contract.commission_rate / 100
        # Calculate days on market
        if contract.date_listed:
            contract.days_on_market = (datetime.utcnow() - contract.date_listed).days
    
    if notes:
        contract.notes = notes
    
    contract.updated_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": f"Contract status updated to {status}"}

@router.put("/{contract_id}/commission/paid")
async def mark_commission_paid(contract_id: str, db: Session = Depends(get_db)):
    """Mark commission as paid"""
    
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    contract.commission_paid = True
    contract.updated_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Commission marked as paid"}

@router.put("/{contract_id}/metrics")
async def update_contract_metrics(
    contract_id: str,
    views: Optional[int] = None,
    inquiries: Optional[int] = None,
    viewings: Optional[int] = None,
    offers: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Update contract performance metrics"""
    
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    if views is not None:
        contract.views = views
    if inquiries is not None:
        contract.inquiries = inquiries
    if viewings is not None:
        contract.viewings = viewings
    if offers is not None:
        contract.offers = offers
    
    contract.updated_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Contract metrics updated"}

@router.delete("/{contract_id}")
async def delete_contract(contract_id: str, db: Session = Depends(get_db)):
    """Delete a contract"""
    
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    db.delete(contract)
    db.commit()
    
    return {"message": "Contract deleted successfully"} 