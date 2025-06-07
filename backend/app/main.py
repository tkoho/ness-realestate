from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy.orm import sessionmaker
from sqlalchemy import func
from app.database.connection import engine
from app.database.models import Base, Lead, AutomationSequence, Contract
import json
from datetime import datetime

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:4028"])

# Database session
Session = sessionmaker(bind=engine)

def get_db():
    """Get database session"""
    return Session()

@app.route("/")
def root():
    return jsonify({
        "message": "LeadGen Pro API",
        "version": "1.0.0",
        "status": "active"
    })

@app.route("/health")
def health_check():
    try:
        db = get_db()
        db.execute("SELECT 1")
        db.close()
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "version": "1.0.0"
        })
    except Exception as e:
        return jsonify({"status": "error", "detail": str(e)}), 503

# Leads endpoints
@app.route("/api/leads/stats")
def get_lead_stats():
    """Get lead statistics for dashboard"""
    db = get_db()
    try:
        total_leads = db.query(func.count(Lead.id)).scalar() or 0
        new_leads = db.query(func.count(Lead.id)).filter(Lead.status == "new").scalar() or 0
        qualified_leads = db.query(func.count(Lead.id)).filter(Lead.status == "interested").scalar() or 0
        converted_leads = db.query(func.count(Lead.id)).filter(Lead.status == "converted").scalar() or 0
        
        return jsonify({
            "total_leads": total_leads,
            "new_leads": new_leads,
            "qualified_leads": qualified_leads,
            "converted_leads": converted_leads,
            "conversion_rate": round((converted_leads / total_leads * 100) if total_leads > 0 else 0, 1)
        })
    finally:
        db.close()

@app.route("/api/leads/call-queue")
def get_call_queue():
    """Get priority leads ready for calling"""
    db = get_db()
    try:
        leads = db.query(Lead).filter(
            Lead.status.in_(["interested", "responded", "new"]),
            Lead.lead_score >= 70
        ).order_by(Lead.lead_score.desc()).limit(20).all()
        
        call_queue_leads = []
        for lead in leads:
            call_queue_leads.append({
                "id": lead.id,
                "score": lead.lead_score,
                "owner_name": lead.owner_name,
                "owner_name_en": lead.owner_name_en or lead.owner_name,
                "phone": lead.phone or "+66 XX XXX XXXX",
                "property_type": lead.property_type or "Property",
                "location": lead.location or "Location TBD",
                "property_value": lead.property_value or 0,
                "commission": lead.commission_potential or 0,
                "last_response": lead.notes or "Initial contact needed",
                "response_time": "2 hours ago" if lead.last_contact else "No response yet",
                "best_call_time": lead.best_call_time or "9 AM - 5 PM",
                "automation_stage": lead.automation_stage or "initial_contact",
                "urgency": lead.urgency,
                "property_image": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400"
            })
        
        return jsonify(call_queue_leads)
    finally:
        db.close()

@app.route("/api/leads", methods=["GET"])
def get_leads():
    """Get leads with optional filtering"""
    db = get_db()
    try:
        status = request.args.get('status')
        source = request.args.get('source')
        limit = int(request.args.get('limit', 50))
        offset = int(request.args.get('offset', 0))
        
        query = db.query(Lead)
        
        if status:
            query = query.filter(Lead.status == status)
        if source:
            query = query.filter(Lead.source == source)
        
        leads = query.order_by(Lead.created_at.desc()).offset(offset).limit(limit).all()
        
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
                "last_contact": lead.last_contact.isoformat() if lead.last_contact else None,
                "best_call_time": lead.best_call_time,
                "notes": lead.notes,
                "created_at": lead.created_at.isoformat(),
                "tags": json.loads(lead.tags) if lead.tags else []
            }
            result.append(lead_dict)
        
        return jsonify(result)
    finally:
        db.close()

@app.route("/api/leads", methods=["POST"])
def create_lead():
    """Create a new lead"""
    db = get_db()
    try:
        data = request.get_json()
        
        lead = Lead(
            owner_name=data['owner_name'],
            owner_name_en=data.get('owner_name_en'),
            phone=data.get('phone'),
            email=data.get('email'),
            property_type=data.get('property_type'),
            location=data.get('location'),
            property_value=data.get('property_value'),
            source=data.get('source', 'manual'),
            tags=json.dumps([])
        )
        
        db.add(lead)
        db.commit()
        db.refresh(lead)
        
        return jsonify({
            "id": lead.id,
            "owner_name": lead.owner_name,
            "status": lead.status,
            "created_at": lead.created_at.isoformat()
        }), 201
    finally:
        db.close()

# Automation endpoints
@app.route("/api/automation/stats")
def get_automation_stats():
    """Get automation statistics for dashboard"""
    db = get_db()
    try:
        total_sequences = db.query(func.count(AutomationSequence.id)).scalar() or 0
        active_sequences = db.query(func.count(AutomationSequence.id)).filter(
            AutomationSequence.status == "active"
        ).scalar() or 0
        paused_sequences = db.query(func.count(AutomationSequence.id)).filter(
            AutomationSequence.status == "paused"
        ).scalar() or 0
        
        total_leads_in_automation = db.query(func.sum(AutomationSequence.leads_in_sequence)).scalar() or 0
        messages_sent_today = db.query(func.sum(AutomationSequence.sent_today)).scalar() or 0
        avg_success_rate = db.query(func.avg(AutomationSequence.success_rate)).scalar() or 0.0
        
        return jsonify({
            "total_sequences": total_sequences,
            "active_sequences": active_sequences,
            "paused_sequences": paused_sequences,
            "total_leads_in_automation": total_leads_in_automation,
            "messages_sent_today": messages_sent_today,
            "success_rate": round(avg_success_rate, 1)
        })
    finally:
        db.close()

@app.route("/api/automation/sequences")
def get_automation_sequences():
    """Get all automation sequences"""
    db = get_db()
    try:
        sequences = db.query(AutomationSequence).order_by(AutomationSequence.created_at.desc()).all()
        
        result = []
        for seq in sequences:
            result.append({
                "id": seq.id,
                "name": seq.name,
                "type": seq.type,
                "status": seq.status,
                "leads_in_sequence": seq.leads_in_sequence,
                "success_rate": seq.success_rate,
                "sent_today": seq.sent_today,
                "daily_limit": seq.daily_limit,
                "template": seq.template,
                "last_sent": seq.last_sent.isoformat() if seq.last_sent else None,
                "next_execution": seq.next_execution.isoformat() if seq.next_execution else None,
                "created_at": seq.created_at.isoformat()
            })
        
        return jsonify(result)
    finally:
        db.close()

# Contracts endpoints
@app.route("/api/contracts/stats")
def get_contract_stats():
    """Get contract statistics for dashboard"""
    db = get_db()
    try:
        total_contracts = db.query(func.count(Contract.id)).scalar() or 0
        active_listings = db.query(func.count(Contract.id)).filter(
            Contract.status.in_(["listed", "under_offer"])
        ).scalar() or 0
        sold_properties = db.query(func.count(Contract.id)).filter(
            Contract.status == "sold"
        ).scalar() or 0
        
        total_commission_earned = db.query(func.sum(Contract.commission_earned)).filter(
            Contract.commission_paid == True
        ).scalar() or 0.0
        
        total_commission_pending = db.query(func.sum(Contract.commission_amount)).filter(
            Contract.commission_paid == False,
            Contract.status == "sold"
        ).scalar() or 0.0
        
        avg_days_on_market = db.query(func.avg(Contract.days_on_market)).filter(
            Contract.status == "sold"
        ).scalar() or 0.0
        
        conversion_rate = (sold_properties / total_contracts * 100) if total_contracts > 0 else 0.0
        
        return jsonify({
            "total_contracts": total_contracts,
            "active_listings": active_listings,
            "sold_properties": sold_properties,
            "total_commission_earned": total_commission_earned,
            "total_commission_pending": total_commission_pending,
            "avg_days_on_market": round(avg_days_on_market, 1),
            "conversion_rate": round(conversion_rate, 1)
        })
    finally:
        db.close()

@app.route("/api/contracts")
def get_contracts():
    """Get contracts with optional filtering"""
    db = get_db()
    try:
        status = request.args.get('status')
        limit = int(request.args.get('limit', 50))
        offset = int(request.args.get('offset', 0))
        
        query = db.query(Contract)
        
        if status:
            query = query.filter(Contract.status == status)
        
        contracts = query.order_by(Contract.created_at.desc()).offset(offset).limit(limit).all()
        
        result = []
        for contract in contracts:
            result.append({
                "id": contract.id,
                "owner_name": contract.owner_name,
                "owner_name_en": contract.owner_name_en,
                "property_type": contract.property_type,
                "location": contract.location,
                "property_value": contract.property_value,
                "listing_price": contract.listing_price,
                "sale_price": contract.sale_price,
                "commission_rate": contract.commission_rate,
                "commission_amount": contract.commission_amount,
                "commission_earned": contract.commission_earned,
                "commission_paid": contract.commission_paid,
                "status": contract.status,
                "date_signed": contract.date_signed.isoformat() if contract.date_signed else None,
                "date_listed": contract.date_listed.isoformat() if contract.date_listed else None,
                "date_sold": contract.date_sold.isoformat() if contract.date_sold else None,
                "days_on_market": contract.days_on_market,
                "views": contract.views,
                "inquiries": contract.inquiries,
                "viewings": contract.viewings,
                "offers": contract.offers,
                "notes": contract.notes,
                "property_image": contract.property_image,
                "created_at": contract.created_at.isoformat()
            })
        
        return jsonify(result)
    finally:
        db.close()

# Dashboard endpoint
@app.route("/api/dashboard/stats")
def get_dashboard_stats():
    """Get aggregated stats for dashboard"""
    try:
        # Get individual stats
        lead_stats_response = get_lead_stats()
        automation_stats_response = get_automation_stats()
        contract_stats_response = get_contract_stats()
        
        # Parse JSON responses
        lead_stats = json.loads(lead_stats_response.data)
        automation_stats = json.loads(automation_stats_response.data)
        contract_stats = json.loads(contract_stats_response.data)
        
        return jsonify({
            "leads": lead_stats,
            "automation": automation_stats,
            "contracts": contract_stats,
            "summary": {
                "total_leads": lead_stats["total_leads"],
                "active_sequences": automation_stats["active_sequences"],
                "active_contracts": contract_stats["active_listings"],
                "total_commission": contract_stats["total_commission_earned"]
            }
        })
    except Exception as e:
        # Return zeros if there's an error (for initial state)
        return jsonify({
            "leads": {
                "total_leads": 0,
                "new_leads": 0,
                "qualified_leads": 0,
                "converted_leads": 0,
                "conversion_rate": 0.0
            },
            "automation": {
                "total_sequences": 0,
                "active_sequences": 0,
                "paused_sequences": 0,
                "total_leads_in_automation": 0,
                "messages_sent_today": 0,
                "success_rate": 0.0
            },
            "contracts": {
                "total_contracts": 0,
                "active_listings": 0,
                "sold_properties": 0,
                "total_commission_earned": 0.0,
                "total_commission_pending": 0.0,
                "avg_days_on_market": 0.0,
                "conversion_rate": 0.0
            },
            "summary": {
                "total_leads": 0,
                "active_sequences": 0,
                "active_contracts": 0,
                "total_commission": 0.0
            }
        })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True) 