from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime
import logging
import numpy as np
from . import models, database
from pydantic import BaseModel, validator
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Medical Image Processing API")

# Pydantic models for request/response validation
class DataPoint(BaseModel):
    id: str
    data: List[str]
    deviceName: str

    @validator('data')
    def validate_data(cls, v):
        for row in v:
            try:
                [float(x) for x in row.split()]
            except ValueError:
                raise ValueError("All data points must be numbers")
        return v

class ResultResponse(BaseModel):
    id: str
    device_id: str
    device_name: str
    average_before_normalization: float
    average_after_normalization: float
    data_size: int
    created_date: datetime
    updated_date: datetime

# Helper functions
def normalize_data(data: List[str]) -> tuple:
    """Normalize data and calculate averages."""
    # Convert string data to numpy array
    data_array = np.array([list(map(float, row.split())) for row in data])
    
    # Calculate average before normalization
    avg_before = np.mean(data_array)
    
    # Normalize data
    max_val = np.max(data_array)
    normalized_data = data_array / max_val
    
    # Calculate average after normalization
    avg_after = np.mean(normalized_data)
    
    # Convert normalized data back to string format
    normalized_data_str = [' '.join(map(str, row)) for row in normalized_data]
    
    return normalized_data_str, avg_before, avg_after

# API Endpoints
@app.post("/api/elements/", response_model=Dict[str, Any])
async def create_elements(payload: Dict[str, DataPoint], db: Session = Depends(database.get_db)):
    """Create new elements from the payload."""
    try:
        results = {}
        for key, value in payload.items():
            # Normalize data and calculate averages
            normalized_data, avg_before, avg_after = normalize_data(value.data)
            
            # Create or update device
            device = db.query(models.Device).filter(models.Device.id == value.id).first()
            if not device:
                device = models.Device(id=value.id, device_name=value.deviceName)
                db.add(device)
            
            # Create result
            result = models.Result(
                id=f"{value.id}_result",
                device_id=value.id,
                data=json.dumps(normalized_data),
                average_before_normalization=avg_before,
                average_after_normalization=avg_after,
                data_size=len(value.data)
            )
            db.add(result)
            results[key] = {
                "id": result.id,
                "device_id": device.id,
                "device_name": device.device_name,
                "average_before_normalization": avg_before,
                "average_after_normalization": avg_after,
                "data_size": result.data_size
            }
        
        db.commit()
        logger.info(f"Created {len(results)} new elements")
        return {"message": "Elements created successfully", "results": results}
    
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating elements: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/elements/", response_model=List[ResultResponse])
async def list_elements(
    db: Session = Depends(database.get_db),
    created_date_start: Optional[datetime] = None,
    created_date_end: Optional[datetime] = None,
    updated_date_start: Optional[datetime] = None,
    updated_date_end: Optional[datetime] = None,
    avg_before_min: Optional[float] = None,
    avg_before_max: Optional[float] = None,
    avg_after_min: Optional[float] = None,
    avg_after_max: Optional[float] = None,
    data_size_min: Optional[int] = None,
    data_size_max: Optional[int] = None
):
    """List all elements with optional filters."""
    try:
        query = db.query(models.Result).join(models.Device)
        
        # Apply filters
        if created_date_start:
            query = query.filter(models.Result.created_date >= created_date_start)
        if created_date_end:
            query = query.filter(models.Result.created_date <= created_date_end)
        if updated_date_start:
            query = query.filter(models.Result.updated_date >= updated_date_start)
        if updated_date_end:
            query = query.filter(models.Result.updated_date <= updated_date_end)
        if avg_before_min is not None:
            query = query.filter(models.Result.average_before_normalization >= avg_before_min)
        if avg_before_max is not None:
            query = query.filter(models.Result.average_before_normalization <= avg_before_max)
        if avg_after_min is not None:
            query = query.filter(models.Result.average_after_normalization >= avg_after_min)
        if avg_after_max is not None:
            query = query.filter(models.Result.average_after_normalization <= avg_after_max)
        if data_size_min is not None:
            query = query.filter(models.Result.data_size >= data_size_min)
        if data_size_max is not None:
            query = query.filter(models.Result.data_size <= data_size_max)
        
        results = query.all()
        return results
    
    except Exception as e:
        logger.error(f"Error listing elements: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/elements/{element_id}", response_model=ResultResponse)
async def get_element(element_id: str, db: Session = Depends(database.get_db)):
    """Get a specific element by ID."""
    try:
        result = db.query(models.Result).join(models.Device).filter(models.Result.id == element_id).first()
        if not result:
            raise HTTPException(status_code=404, detail="Element not found")
        return result
    except Exception as e:
        logger.error(f"Error getting element: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/api/elements/{element_id}")
async def update_element(
    element_id: str,
    update_data: Dict[str, str],
    db: Session = Depends(database.get_db)
):
    """Update an element's device name or ID."""
    try:
        result = db.query(models.Result).filter(models.Result.id == element_id).first()
        if not result:
            raise HTTPException(status_code=404, detail="Element not found")
        
        device = db.query(models.Device).filter(models.Device.id == result.device_id).first()
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")
        
        if "device_name" in update_data:
            device.device_name = update_data["device_name"]
        if "id" in update_data:
            device.id = update_data["id"]
            result.device_id = update_data["id"]
        
        db.commit()
        logger.info(f"Updated element {element_id}")
        return {"message": "Element updated successfully"}
    
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating element: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/api/elements/{element_id}")
async def delete_element(element_id: str, db: Session = Depends(database.get_db)):
    """Delete an element by ID."""
    try:
        result = db.query(models.Result).filter(models.Result.id == element_id).first()
        if not result:
            raise HTTPException(status_code=404, detail="Element not found")
        
        db.delete(result)
        db.commit()
        logger.info(f"Deleted element {element_id}")
        return {"message": "Element deleted successfully"}
    
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting element: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e)) 