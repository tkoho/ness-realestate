# LeadGen Pro Backend - Phase 1

Simple FastAPI backend for the LeadGen Pro real estate automation system.

## Quick Start

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the Server**
   ```bash
   python run.py
   ```

3. **Access the API**
   - API Base: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health

## API Endpoints

### Leads
- `GET /api/leads/` - Get all leads
- `POST /api/leads/` - Create new lead
- `GET /api/leads/{id}` - Get specific lead
- `PUT /api/leads/{id}/status` - Update lead status
- `GET /api/leads/call-queue` - Get priority leads for calling
- `GET /api/leads/stats` - Get lead statistics

### Automation
- `GET /api/automation/sequences` - Get automation sequences
- `POST /api/automation/sequences` - Create new sequence
- `PUT /api/automation/sequences/{id}/status` - Update sequence status
- `GET /api/automation/stats` - Get automation statistics

### Contracts
- `GET /api/contracts/` - Get all contracts
- `POST /api/contracts/` - Create new contract
- `PUT /api/contracts/{id}/status` - Update contract status
- `GET /api/contracts/stats` - Get contract statistics

### Dashboard
- `GET /api/dashboard/stats` - Get aggregated dashboard statistics

## Database

Uses SQLite database (`leadgen_pro.db`) with auto-generated tables:
- `leads` - Lead information and tracking
- `automation_sequences` - Message automation sequences
- `contracts` - Property contracts and commissions

## Features

✅ **CORS Enabled** - Works with React frontend on localhost:4028  
✅ **Auto Documentation** - Swagger UI available at `/docs`  
✅ **Health Checks** - Database connectivity monitoring  
✅ **Proper Error Handling** - HTTP status codes and messages  
✅ **Thai Market Support** - English/Thai names, Thai property types  

## Phase 1 Scope

This is a simplified implementation focused on:
- Basic CRUD operations for all main entities
- Statistics endpoints for dashboard
- Proper API structure for frontend integration
- No complex automation or AI features yet

**Next Phases** will add:
- Web scraping capabilities
- Advanced automation sequences
- AI lead scoring and Thai NLP
- External integrations (LINE, Gmail, etc.) 