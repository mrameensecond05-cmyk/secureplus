from celery import Celery
import os

redis_url = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
celery_app = Celery("tasks", broker=redis_url)

@celery_app.task
def poll_alerts():
    print("Polling alerts from Wazuh...")
    return "Polled 0 alerts"
