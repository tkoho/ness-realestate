# Simplified database models for Phase 1 - SQLAlchemy 1.4 compatible
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Text, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(String, primary_key=True, default=lambda: f"lead_{uuid.uuid4().hex[:8]}")
    owner_name = Column(String, nullable=False)
    owner_name_en = Column(String)
    phone = Column(String)
    email = Column(String)
    messenger_link = Column(String)
    
    # Property information
    property_type = Column(String)  # Villa, Condo, House, etc.
    location = Column(String)
    property_value = Column(Float)
    commission_potential = Column(Float)
    
    # Lead management
    status = Column(String, default="new")  # new, contacted, interested, not_interested, converted
    lead_score = Column(Integer, default=0)  # 0-100 scoring
    urgency = Column(String, default="medium")  # urgent, high, medium, low
    source = Column(String)  # facebook, google_maps, thai_sites, etc.
    
    # Automation tracking
    automation_stage = Column(String)  # facebook_initial, day_3_email, etc.
    last_contact = Column(DateTime)
    best_call_time = Column(String)
    
    # Metadata
    date_scraped = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Additional data
    tags = Column(Text)  # JSON string for tags
    notes = Column(Text)

class AutomationSequence(Base):
    __tablename__ = "automation_sequences"
    
    id = Column(String, primary_key=True, default=lambda: f"seq_{uuid.uuid4().hex[:8]}")
    name = Column(String, nullable=False)
    type = Column(String)  # facebook_message, email, email_with_attachment
    status = Column(String, default="active")  # active, paused, stopped
    
    # Sequence configuration
    template = Column(Text)
    daily_limit = Column(Integer, default=50)
    
    # Performance tracking
    leads_in_sequence = Column(Integer, default=0)
    success_rate = Column(Float, default=0.0)
    sent_today = Column(Integer, default=0)
    
    # Execution tracking
    last_sent = Column(DateTime)
    next_execution = Column(DateTime)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Contract(Base):
    __tablename__ = "contracts"
    
    id = Column(String, primary_key=True, default=lambda: f"contract_{uuid.uuid4().hex[:8]}")
    
    # Basic contract info
    owner_name = Column(String, nullable=False)
    owner_name_en = Column(String)
    property_type = Column(String)
    location = Column(String)
    
    # Financial details
    property_value = Column(Float)
    listing_price = Column(Float)
    sale_price = Column(Float)
    commission_rate = Column(Float, default=3.0)  # Percentage
    commission_amount = Column(Float)
    commission_earned = Column(Float)
    commission_paid = Column(Boolean, default=False)
    
    # Contract status
    status = Column(String)  # listed, under_offer, sold, expired
    
    # Important dates
    date_signed = Column(DateTime)
    date_listed = Column(DateTime)
    date_sold = Column(DateTime)
    days_on_market = Column(Integer, default=0)
    
    # Performance metrics
    views = Column(Integer, default=0)
    inquiries = Column(Integer, default=0)
    viewings = Column(Integer, default=0)
    offers = Column(Integer, default=0)
    
    # Additional information
    notes = Column(Text)
    property_image = Column(String)  # Image URL
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 