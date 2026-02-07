from fastapi import FastAPI
import uvicorn
import os

app = FastAPI(title="Reports Service")

@app.get("/health")
def health_check():
    return {"status": "active", "service": "reports-service"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8005))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
