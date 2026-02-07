from sqlalchemy import Column, Integer, String, Enum, DateTime, TIMESTAMP
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "accounts_customuser"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    phone = Column(String(20), nullable=True)
    role = Column(Enum('admin', 'user'), default='user')
    status = Column(Enum('active', 'disabled'), default='active')
    failed_login_attempts = Column(Integer, default=0)
    last_login = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
