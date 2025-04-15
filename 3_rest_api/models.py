from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Device(Base):
    """Model for storing device information."""
    __tablename__ = "devices"

    id = Column(String, primary_key=True)
    device_name = Column(String, nullable=False)
    created_date = Column(DateTime, default=datetime.utcnow)
    updated_date = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with results
    results = relationship("Result", back_populates="device")

class Result(Base):
    """Model for storing medical image processing results."""
    __tablename__ = "results"

    id = Column(String, primary_key=True)
    device_id = Column(String, ForeignKey("devices.id"), nullable=False)
    data = Column(Text, nullable=False)  # Store normalized data as string
    average_before_normalization = Column(Float, nullable=False)
    average_after_normalization = Column(Float, nullable=False)
    data_size = Column(Integer, nullable=False)
    created_date = Column(DateTime, default=datetime.utcnow)
    updated_date = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with device
    device = relationship("Device", back_populates="results") 