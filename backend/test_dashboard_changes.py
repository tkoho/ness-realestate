#!/usr/bin/env python3
"""
Test script to modify dashboard data and verify real-time updates
"""

from app.database.connection import engine
from app.database.models import Base, Lead, AutomationSequence, Contract
from sqlalchemy.orm import sessionmaker
import json
from datetime import datetime, timedelta

Session = sessionmaker(bind=engine)
db = Session()

print("🧪 Testing Dashboard Data Changes...")
print("📊 Current Status: Taking baseline measurements...")

try:
    # Get current counts for comparison
    current_leads = db.query(Lead).count()
    current_contracts = db.query(Contract).count()
    current_sequences = db.query(AutomationSequence).count()
    
    print(f"📈 BEFORE CHANGES:")
    print(f"   • Leads in database: {current_leads}")
    print(f"   • Contracts: {current_contracts}")
    print(f"   • Automation sequences: {current_sequences}")
    print()
    
    # Method 1: Add HIGH-VALUE premium leads
    print("💎 Adding 2 premium high-value leads...")
    new_leads = [
        {
            "owner_name": "นริศรา บุญมา",
            "owner_name_en": "Narisara Boonma",
            "phone": "+66 98 765 4321",
            "email": "narisara@luxury.com",
            "property_type": "Luxury Beachfront Villa",
            "location": "Hua Hin Premium Zone",
            "property_value": 15000000,  # ฿15M
            "commission_potential": 450000,  # ฿450k commission
            "status": "interested",
            "lead_score": 98,  # Very high score
            "urgency": "urgent",
            "source": "referral",
            "automation_stage": "ready_to_call",
            "best_call_time": "1 PM - 4 PM",
            "tags": json.dumps(["Premium Client", "Beachfront", "Urgent Sale"])
        },
        {
            "owner_name": "ธีรยุทธ์ สมบูรณ์",
            "owner_name_en": "Teerayut Somboon",
            "phone": "+66 87 123 9876",
            "email": "teerayut@resort.co.th",
            "property_type": "Resort Investment Property",
            "location": "Koh Samui Exclusive",
            "property_value": 25000000,  # ฿25M
            "commission_potential": 750000,  # ฿750k commission
            "status": "responded",
            "lead_score": 96,
            "urgency": "urgent",
            "source": "website",
            "automation_stage": "negotiation_stage",
            "best_call_time": "10 AM - 12 PM",
            "tags": json.dumps(["Resort Investment", "High Net Worth", "International"])
        }
    ]
    
    for lead_data in new_leads:
        lead = Lead(**lead_data)
        db.add(lead)
    print("   ✅ Added ฿15M luxury villa lead")
    print("   ✅ Added ฿25M resort property lead")
    
    # Method 2: Update automation sequence performance
    print("📈 Boosting automation sequence performance...")
    sequences = db.query(AutomationSequence).all()
    for seq in sequences:
        if seq.name == "Facebook Initial Outreach":
            seq.sent_today = 45  # Increase from 15 to 45
            seq.leads_in_sequence = 200  # Increase from 127 to 200
            seq.success_rate = 35.5  # Improve from 23.5% to 35.5%
            print(f"   ✅ Boosted {seq.name}: 45 sent today, 35.5% success rate")
        elif seq.name == "Day 3 Email Follow-up":
            seq.success_rate = 45.2  # Improve from 31.2% to 45.2%
            seq.sent_today = 25  # Increase from 8 to 25
            seq.leads_in_sequence = 120  # Increase from 85 to 120
            print(f"   ✅ Enhanced {seq.name}: 25 sent today, 45.2% success rate")
        elif seq.name == "Property Valuation Offer":
            seq.status = "active"  # Change from paused to active
            seq.sent_today = 12  # Start sending (was 0)
            seq.success_rate = 28.5  # Improve from 18.7%
            print(f"   ✅ Activated {seq.name}: Now sending 12/day")
    
    # Method 3: Add a MAJOR new contract
    print("💰 Adding a premium penthouse contract...")
    new_contract = Contract(
        owner_name="สุรชัย มั่งคั่ง",
        owner_name_en="Surachai Mangkang",
        property_type="Luxury Penthouse",
        location="Bangkok CBD Premium Tower",
        property_value=18000000,  # ฿18M
        listing_price=18000000,
        commission_rate=3.5,  # Higher rate for premium
        commission_amount=630000,  # ฿630k potential
        commission_paid=False,
        status="signed",  # Just signed!
        date_signed=datetime.now(),
        date_listed=datetime.now(),
        days_on_market=0,  # Fresh listing
        views=0,
        inquiries=0,
        viewings=0,
        offers=0,
        notes="Ultra-premium penthouse with panoramic city view! High-net-worth client.",
        property_image="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400"
    )
    db.add(new_contract)
    print("   ✅ Added ฿18M penthouse (฿630k commission potential)")
    
    # Commit all changes
    db.commit()
    
    # Get new counts
    new_lead_count = db.query(Lead).count()
    new_contract_count = db.query(Contract).count()
    total_automation_sent = sum([seq.sent_today for seq in db.query(AutomationSequence).all()])
    
    print()
    print("🎉 DASHBOARD TEST DATA UPDATED SUCCESSFULLY!")
    print("=" * 50)
    print("📊 AFTER CHANGES:")
    print(f"   • Total leads: {new_lead_count} (+{new_lead_count - current_leads})")
    print(f"   • Total contracts: {new_contract_count} (+{new_contract_count - current_contracts})")
    print(f"   • Messages sent today: {total_automation_sent}")
    print()
    print("💎 HIGH-VALUE ADDITIONS:")
    print("   • ฿15M Luxury Villa (Narisara - Score 98)")
    print("   • ฿25M Resort Property (Teerayut - Score 96)")
    print("   • ฿18M Penthouse Contract (Surachai)")
    print()
    print("📈 EXPECTED DASHBOARD CHANGES:")
    print("   🔥 Ready for Calls: Should show 5 leads (was 3)")
    print("   📧 Auto-Contacted Today: Should show 82+ messages (was 23)")
    print("   💰 Total Commission Potential: Should exceed ฿2.7M")
    print("   📋 Active Sequences: All 3 should be active now")
    print()
    print("🔄 ACTION REQUIRED:")
    print("   1. Go to http://localhost:4028")
    print("   2. Click the refresh button on dashboard")
    print("   3. Watch the metrics update with new data!")
    print("   4. Check call queue for new premium leads")
    print()
    print("🎯 SUCCESS INDICATORS:")
    print("   ✅ Call queue shows Narisara & Teerayut")
    print("   ✅ Automation stats significantly higher")
    print("   ✅ Contract value jumps dramatically")

except Exception as e:
    print(f"❌ Error updating test data: {e}")
    db.rollback()
finally:
    db.close() 