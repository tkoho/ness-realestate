# app/database/models.py
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
    line_id = Column(String)
    
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
    source_url = Column(String)
    
    # Automation tracking
    automation_stage = Column(String)  # facebook_initial, day_3_email, etc.
    last_contact = Column(DateTime)
    next_follow_up = Column(DateTime)
    best_call_time = Column(String)
    
    # Metadata
    date_scraped = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Additional data from scraping
    raw_data = Column(JSON)  # Store original scraped data
    tags = Column(JSON)  # Array of tags like ["High Priority", "Sea View"]
    
    # Relationships
    interactions = relationship("Interaction", back_populates="lead")
    contracts = relationship("Contract", back_populates="lead")

class Property(Base):
    __tablename__ = "properties"
    
    id = Column(String, primary_key=True, default=lambda: f"prop_{uuid.uuid4().hex[:8]}")
    lead_id = Column(String, ForeignKey("leads.id"))
    
    # Property details
    property_type = Column(String)
    address = Column(String)
    location = Column(String)
    coordinates_lat = Column(Float)
    coordinates_lng = Column(Float)
    
    # Pricing
    listing_price = Column(Float)
    price_per_sqm = Column(Float)
    rental_yield = Column(Float)
    
    # Features
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    area_sqm = Column(Float)
    furnished = Column(Boolean, default=False)
    
    # Descriptions
    description_thai = Column(Text)
    description_english = Column(Text)
    
    # Images and media
    images = Column(JSON)  # Array of image URLs
    virtual_tour_url = Column(String)
    
    # Market data
    days_on_market = Column(Integer, default=0)
    views_count = Column(Integer, default=0)
    inquiries_count = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Interaction(Base):
    __tablename__ = "interactions"
    
    id = Column(String, primary_key=True, default=lambda: f"int_{uuid.uuid4().hex[:8]}")
    lead_id = Column(String, ForeignKey("leads.id"))
    
    # Interaction details
    type = Column(String)  # call, email, message, meeting
    direction = Column(String)  # inbound, outbound
    outcome = Column(String)  # interested, not_interested, no_response, bounced
    duration = Column(String)  # For calls: "5 min"
    
    # Content
    subject = Column(String)
    notes = Column(Text)
    response_text = Column(Text)
    
    # Metadata
    agent = Column(String, default="System")
    timestamp = Column(DateTime, default=datetime.utcnow)
    automated = Column(Boolean, default=False)
    
    # Relationships
    lead = relationship("Lead", back_populates="interactions")

class AutomationSequence(Base):
    __tablename__ = "automation_sequences"
    
    id = Column(String, primary_key=True, default=lambda: f"seq_{uuid.uuid4().hex[:8]}")
    name = Column(String, nullable=False)
    type = Column(String)  # facebook_message, email, email_with_attachment
    status = Column(String, default="active")  # active, paused, stopped
    
    # Sequence configuration
    template = Column(Text)
    trigger_delay_hours = Column(Integer, default=72)  # Hours after previous step
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
    lead_id = Column(String, ForeignKey("leads.id"))
    property_id = Column(String, ForeignKey("properties.id"))
    
    # Contract details
    status = Column(String)  # listed, under_offer, sold, expired
    listing_price = Column(Float)
    sale_price = Column(Float)
    commission_rate = Column(Float, default=3.0)  # Percentage
    commission_amount = Column(Float)
    commission_earned = Column(Float)
    commission_paid = Column(Boolean, default=False)
    
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
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    lead = relationship("Lead", back_populates="contracts")

class ScrapingJob(Base):
    __tablename__ = "scraping_jobs"
    
    id = Column(String, primary_key=True, default=lambda: f"job_{uuid.uuid4().hex[:8]}")
    source = Column(String)  # Facebook Groups, Google Maps, Thai Classifieds
    target_location = Column(String)
    status = Column(String)  # running, completed, failed, paused, scheduled
    
    # Progress tracking
    progress = Column(Integer, default=0)  # 0-100
    items_found = Column(Integer, default=0)
    error_count = Column(Integer, default=0)
    
    # Execution details
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    estimated_completion = Column(String)
    
    # Configuration
    search_keywords = Column(JSON)
    max_results = Column(Integer, default=1000)
    rate_limit_delay = Column(Integer, default=3)  # Seconds between requests
    
    # Results
    results_data = Column(JSON)
    error_log = Column(JSON)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SystemConfig(Base):
    __tablename__ = "system_config"
    
    id = Column(String, primary_key=True)
    category = Column(String)  # scraping, automation, integrations
    key = Column(String)
    value = Column(Text)
    encrypted = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)