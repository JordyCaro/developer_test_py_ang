# Medical Image Processing REST API

A RESTful API for managing medical image processing results using FastAPI and PostgreSQL.

## Features

- CRUD operations for medical image processing results
- Data normalization and statistical analysis
- Comprehensive filtering options
- Detailed logging
- Input validation
- PostgreSQL database integration

## Prerequisites

- Python 3.7+
- PostgreSQL 12+
- pip (Python package manager)

## Local Development Setup

### 1. Install PostgreSQL

#### Windows:
1. Download PostgreSQL from [official website](https://www.postgresql.org/download/windows/)
2. Run the installer
3. During installation:
   - Set password for postgres user (default: postgres)
   - Keep default port (5432)
   - Complete the installation

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database and User

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE medical_images;

# Create user (if needed)
CREATE USER postgres WITH PASSWORD 'postgres';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE medical_images TO postgres;
```

### 3. Set Up Python Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the project root with the following content:
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=medical_images
```

### 5. Initialize Database

```bash
# Create database tables
python -c "from models import Base; from database import engine; Base.metadata.create_all(bind=engine)"
```

## Running the Application

```bash
# Start the server
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Create Elements
- **POST** `/api/elements/`
- Payload example:
```json
{
  "1": {
    "id": "aabbcc1",
    "data": [
      "78 83 21 68 96 46 40 11 1 88",
      "58 75 71 69 33 14 15 93 18 54",
      "46 54 73 63 85 4 30 76 15 56"
    ],
    "deviceName": "CT SCAN"
  }
}
```

### List Elements
- **GET** `/api/elements/`
- Optional query parameters:
  - `created_date_start`
  - `created_date_end`
  - `updated_date_start`
  - `updated_date_end`
  - `avg_before_min`
  - `avg_before_max`
  - `avg_after_min`
  - `avg_after_max`
  - `data_size_min`
  - `data_size_max`

### Get Element
- **GET** `/api/elements/{element_id}`

### Update Element
- **PUT** `/api/elements/{element_id}`
- Payload example:
```json
{
  "device_name": "new_device_name",
  "id": "new_id"
}
```

### Delete Element
- **DELETE** `/api/elements/{element_id}`

## Testing the API

You can use tools like Postman or curl to test the API. Here's an example using curl:

```bash
# Create elements
curl -X POST "http://localhost:8000/api/elements/" \
     -H "Content-Type: application/json" \
     -d '{"1":{"id":"aabbcc1","data":["78 83 21 68 96 46 40 11 1 88","58 75 71 69 33 14 15 93 18 54","46 54 73 63 85 4 30 76 15 56"],"deviceName":"CT SCAN"}}'

# List elements
curl "http://localhost:8000/api/elements/"

# Get specific element
curl "http://localhost:8000/api/elements/aabbcc1_result"

# Update element
curl -X PUT "http://localhost:8000/api/elements/aabbcc1_result" \
     -H "Content-Type: application/json" \
     -d '{"device_name":"NEW CT SCAN"}'

# Delete element
curl -X DELETE "http://localhost:8000/api/elements/aabbcc1_result"
```

## Error Handling

The API includes comprehensive error handling:
- Invalid data format
- Missing required fields
- Database errors
- Resource not found errors

All errors are logged and returned with appropriate HTTP status codes.

## Logging

Logs are written to the console and include:
- API requests and responses
- Error details
- Database operations
- Data processing steps 