#!/usr/bin/env python3
"""
LeadGen Pro Backend - Phase 1
Simple script to run the Flask server
"""

from app.main import app

if __name__ == "__main__":
    print("🚀 Starting LeadGen Pro Backend - Phase 1")
    print("📍 API will be available at: http://localhost:8000")
    print("💚 Health Check: http://localhost:8000/health")
    print("📊 Dashboard Stats: http://localhost:8000/api/dashboard/stats")
    print("-" * 50)
    
    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    ) 