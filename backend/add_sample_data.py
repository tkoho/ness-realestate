#!/usr/bin/env python3
"""
Add sample data to test the backend integration
"""

from app.database.connection import engine
from app.database.models import Base, Lead, AutomationSequence, Contract
from sqlalchemy.orm import sessionmaker
import json
from datetime import datetime, timedelta

# Create session
Session = sessionmaker(bind=engine)
db = Session()

print("🗃️ Adding sample data to LeadGen Pro database...")

try:
    # Add sample leads
    sample_leads = [
        {
            "owner_name": "สมชาย วงศ์ประโคน",
            "owner_name_en": "Somchai Wongprakorn", 
            "phone": "+66 81 234 5678",
            "email": "somchai@gmail.com",
            "property_type": "Villa",
            "location": "Hua Hin",
            "property_value": 8500000,
            "commission_potential": 255000,
            "status": "interested",
            "lead_score": 95,
            "urgency": "urgent",
            "source": "facebook",
            "automation_stage": "day_3_follow_up",
            "best_call_time": "10 AM - 2 PM",
            "tags": json.dumps(["High Priority", "Sea View", "Quick Sale"])
        },
        {
            "owner_name": "สุนีย์ ธนาวงศ์",
            "owner_name_en": "Sunee Thanawong",
            "phone": "+66 89 876 5432", 
            "property_type": "Condo",
            "location": "Hua Hin",
            "property_value": 4200000,
            "commission_potential": 126000,
            "status": "new",
            "lead_score": 88,
            "urgency": "high",
            "source": "google_maps",
            "automation_stage": "facebook_initial",
            "best_call_time": "2 PM - 6 PM",
            "tags": json.dumps(["Investment Property", "Modern Condo"])
        },
        {
            "owner_name": "วิรัตน์ สุขเจริญ",
            "owner_name_en": "Wirat Sukcharoen",
            "phone": "+66 92 345 6789",
            "property_type": "House",
            "location": "Prachuap Khiri Khan", 
            "property_value": 6800000,
            "commission_potential": 204000,
            "status": "responded",
            "lead_score": 92,
            "urgency": "high",
            "source": "facebook",
            "automation_stage": "email_follow_up",
            "best_call_time": "9 AM - 11 AM",
            "tags": json.dumps(["Family Home", "Good Location"])
        }
    ]

    for lead_data in sample_leads:
        lead = Lead(**lead_data)
        db.add(lead)

    # Add sample automation sequences
    sample_sequences = [
        {
            "name": "Facebook Initial Outreach",
            "type": "facebook_message",
            "status": "active",
            "template": "สวัสดีค่ะ! เห็นว่าคุณสนใจขายบ้านใน Hua Hin ใช่ไหมคะ? เรามีลูกค้าที่กำลังมองหาอยู่เลยค่ะ",
            "daily_limit": 50,
            "leads_in_sequence": 127,
            "success_rate": 23.5,
            "sent_today": 15
        },
        {
            "name": "Day 3 Email Follow-up",
            "type": "email",
            "status": "active", 
            "template": "Hi! Following up on our conversation about your property. Are you still interested in selling?",
            "daily_limit": 30,
            "leads_in_sequence": 85,
            "success_rate": 31.2,
            "sent_today": 8
        },
        {
            "name": "Property Valuation Offer",
            "type": "email_with_attachment",
            "status": "paused",
            "template": "Free property valuation report attached. Let's discuss your selling timeline!",
            "daily_limit": 20,
            "leads_in_sequence": 45,
            "success_rate": 18.7,
            "sent_today": 0
        }
    ]

    for seq_data in sample_sequences:
        sequence = AutomationSequence(**seq_data)
        db.add(sequence)

    # Add sample contracts
    sample_contracts = [
        {
            "owner_name": "ประยุทธ์ มานะสิน",
            "owner_name_en": "Prayut Manasin",
            "property_type": "Villa",
            "location": "Hua Hin Beachfront",
            "property_value": 12000000,
            "listing_price": 12000000,
            "sale_price": 11500000,
            "commission_rate": 3.0,
            "commission_amount": 360000,
            "commission_earned": 345000,
            "commission_paid": True,
            "status": "sold",
            "date_signed": datetime.now() - timedelta(days=45),
            "date_listed": datetime.now() - timedelta(days=42),
            "date_sold": datetime.now() - timedelta(days=5),
            "days_on_market": 37,
            "views": 243,
            "inquiries": 18,
            "viewings": 12,
            "offers": 3,
            "notes": "Excellent beachfront property. Quick sale!",
            "property_image": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400"
        },
        {
            "owner_name": "วาสนา เจริญสุข",
            "owner_name_en": "Wasana Charoenuck",
            "property_type": "Condo",
            "location": "Hua Hin Center",
            "property_value": 5500000,
            "listing_price": 5500000,
            "commission_rate": 3.0,
            "commission_amount": 165000,
            "commission_paid": False,
            "status": "listed",
            "date_signed": datetime.now() - timedelta(days=15),
            "date_listed": datetime.now() - timedelta(days=12),
            "days_on_market": 12,
            "views": 89,
            "inquiries": 7,
            "viewings": 4,
            "offers": 1,
            "notes": "Modern condo with pool view. Good interest so far.",
            "property_image": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400"
        }
    ]

    for contract_data in sample_contracts:
        contract = Contract(**contract_data)
        db.add(contract)

    # Commit all changes
    db.commit()
    
    print("✅ Sample data added successfully!")
    print("📊 Added:")
    print(f"   • {len(sample_leads)} leads")
    print(f"   • {len(sample_sequences)} automation sequences") 
    print(f"   • {len(sample_contracts)} contracts")
    print("")
    print("🌐 Your frontend should now show real data!")
    print("📱 Check: http://localhost:4028")

except Exception as e:
    print(f"❌ Error adding sample data: {e}")
    db.rollback()
finally:
    db.close() 