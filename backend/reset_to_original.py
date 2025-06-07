#!/usr/bin/env python3
"""
Reset database to original sample data
"""

from app.database.connection import engine
from app.database.models import Base, Lead, AutomationSequence, Contract
from sqlalchemy.orm import sessionmaker

Session = sessionmaker(bind=engine)
db = Session()

print("🔄 Resetting database to original sample data...")

try:
    # Clear all data
    db.query(Lead).delete()
    db.query(AutomationSequence).delete() 
    db.query(Contract).delete()
    db.commit()
    
    print("✅ Database cleared!")
    print("🔄 Run 'python add_sample_data.py' to restore original data")
    print("📊 Dashboard should show empty states until you reload sample data")
    
except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close() 