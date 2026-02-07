from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

from routes import auth_routes
from database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SecurePulse Auth Service")

# CORS
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth_routes.router, prefix="/api/auth", tags=["auth"])

@app.get("/health")
def health_check():
    return {"status": "active", "service": "auth-service"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
