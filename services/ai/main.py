from fastapi import FastAPI
import uvicorn
import os

app = FastAPI(title="AI Service")

@app.get("/health")
def health_check():
    return {"status": "active", "service": "ai-service"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8004))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
