#!/usr/bin/env python3
"""
Simple test to check FastAPI compatibility
"""

try:
    from fastapi import FastAPI
    print("✅ FastAPI import successful")
    
    app = FastAPI()
    print("✅ FastAPI app creation successful")
    
    @app.get("/")
    def read_root():
        return {"Hello": "World"}
    
    print("✅ Route definition successful")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

print("Test completed") 