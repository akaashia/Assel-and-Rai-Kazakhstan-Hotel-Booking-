import os
from datetime import datetime
import requests
from fastapi import FastAPI, Request

app = FastAPI(title="Hotel Telegram Alert Adapter")
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")


def send_telegram(text: str) -> None:
    if not BOT_TOKEN or not CHAT_ID:
        print("Telegram env variables are not configured")
        return
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    requests.post(url, json={"chat_id": CHAT_ID, "text": text[:3900]}, timeout=15)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/alert")
async def alertmanager_webhook(request: Request):
    data = await request.json()
    status = data.get("status", "unknown")
    alerts = data.get("alerts", [])

    lines = [
        "Hotel Booking Monitoring",
        f"Status: {status}",
        f"Time: {datetime.utcnow().isoformat()}Z",
        ""
    ]

    for item in alerts:
        labels = item.get("labels", {})
        annotations = item.get("annotations", {})
        lines.extend([
            f"Alert: {labels.get('alertname', 'unknown')}",
            f"Severity: {labels.get('severity', 'unknown')}",
            f"Summary: {annotations.get('summary', '-')}",
            f"Description: {annotations.get('description', '-')}",
            ""
        ])

    text = "\n".join(lines)
    send_telegram(text)
    return {"ok": True}
