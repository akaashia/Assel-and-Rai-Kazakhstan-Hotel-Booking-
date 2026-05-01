import asyncio
import html
import logging
import os
import platform
import shutil
import subprocess
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import aiohttp
import docker
import psutil
from aiogram import Bot, Dispatcher, F
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import Command, CommandObject
from aiogram.types import Message
from apscheduler.schedulers.asyncio import AsyncIOScheduler


# =========================
# ENV CONFIG
# =========================

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
ALLOWED_CHAT_ID = int(os.getenv("TELEGRAM_CHAT_ID", "0"))

PROJECT_DIR = os.getenv("PROJECT_DIR", "/app/project")
TIMEZONE = os.getenv("BOT_TIMEZONE", "Asia/Almaty")
DAILY_REPORT_HOUR = int(os.getenv("DAILY_REPORT_HOUR", "14"))

POSTGRES_CONTAINER = os.getenv("POSTGRES_CONTAINER", "hotel_postgres")
POSTGRES_USER = os.getenv("POSTGRES_USER", "hotel_user")
POSTGRES_DB = os.getenv("POSTGRES_DB", "hotel_db")

BACKEND_HEALTH_URL = os.getenv("BACKEND_HEALTH_URL", "http://hotel_backend:4000/health")
BACKEND_ROOMS_URL = os.getenv("BACKEND_ROOMS_URL", "http://hotel_backend:4000/rooms")
AI_CHAT_URL = os.getenv("AI_CHAT_URL", "http://hotel_backend:4000/v1/chat")
PROMETHEUS_URL = os.getenv("PROMETHEUS_URL", "http://hotel_prometheus:9090")
ALERTMANAGER_URL = os.getenv("ALERTMANAGER_URL", "http://hotel_alertmanager:9093")
N8N_URL = os.getenv("N8N_URL", "http://hotel_n8n:5678")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

LOG_FILE = "/var/log/devops_bot.log"

logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher()
scheduler = AsyncIOScheduler(timezone=ZoneInfo(TIMEZONE))


# =========================
# HELPERS
# =========================

def is_admin(message: Message) -> bool:
    return message.chat.id == ALLOWED_CHAT_ID


async def deny_if_not_admin(message: Message) -> bool:
    if not is_admin(message):
        logging.warning("Unauthorized access from chat_id=%s", message.chat.id)
        await message.answer("⛔ Access denied. Бұл бот тек админге арналған.")
        return True
    return False


def safe(text: str) -> str:
    return html.escape(str(text))


def run_cmd(cmd: list[str], cwd: str | None = None, timeout: int = 60) -> tuple[int, str, str]:
    logging.info("RUN CMD: %s", " ".join(cmd))
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        return result.returncode, result.stdout.strip(), result.stderr.strip()
    except subprocess.TimeoutExpired as exc:
        return 124, exc.stdout or "", f"Timeout after {timeout}s"


def get_docker_client():
    return docker.from_env()


def status_level(cpu: float, ram: float, disk: float) -> str:
    if cpu > 80 or ram > 85 or disk > 80:
        return "🔴 CRITICAL"
    if cpu > 60 or ram > 70 or disk > 65:
        return "🟡 WARNING"
    return "🟢 OK"


async def http_check(url: str, timeout: int = 5) -> tuple[bool, str]:
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=timeout) as resp:
                text = await resp.text()
                return 200 <= resp.status < 300, f"{resp.status} {text[:120]}"
    except Exception as exc:
        return False, str(exc)


async def post_ai_analyze(report_text: str) -> str:
    if not GEMINI_API_KEY:
        return "AI summary unavailable: GEMINI_API_KEY жоқ."

    prompt = (
        "Сен DevOps мониторинг ассистентісің. "
        "Мына серверлік есепті қысқа талда. Проблема болса админге нақты ескерту бер. "
        "Жауап қазақша болсын, қысқа және нақты:\n\n"
        + report_text
    )

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    )

    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, timeout=20) as resp:
                data = await resp.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as exc:
        logging.exception("Gemini analyze failed")
        return f"AI summary unavailable: {safe(exc)}"


async def send_long(message: Message, text: str, chunk: int = 3900):
    for i in range(0, len(text), chunk):
        await message.answer(text[i:i + chunk])


# =========================
# COMMANDS
# =========================

@dp.message(Command("start"))
async def cmd_start(message: Message):
    if await deny_if_not_admin(message):
        return

    text = """
<b>🛠 Kazakhstan Hotel Booking DevOps Admin Bot</b>

Қолжетімді командалар:

/status — CPU, RAM, Disk, uptime
/services — Docker контейнерлер статусы
/logs &lt;service&gt; [lines] — контейнер логтары
/db_status — PostgreSQL статусы
/fail2ban — banned IP тізімі
/top — TOP-5 processes by CPU/RAM
/backup — PostgreSQL dump жасау
/deploy — git pull + docker compose up -d --build
/restart &lt;service&gt; — контейнерді restart
/report — толық сайт + DevOps есеп
/help — көмек

Авто есеп: күн сайын 14:00.
"""
    await message.answer(text)


@dp.message(Command("help"))
async def cmd_help(message: Message):
    await cmd_start(message)


@dp.message(Command("status"))
async def cmd_status(message: Message):
    if await deny_if_not_admin(message):
        return

    cpu = psutil.cpu_percent(interval=1)
    ram = psutil.virtual_memory().percent
    disk = psutil.disk_usage("/").percent

    boot_time = datetime.fromtimestamp(psutil.boot_time())
    uptime = datetime.now() - boot_time

    level = status_level(cpu, ram, disk)

    text = f"""
<b>📊 Server Status</b>

Status: <b>{level}</b>

CPU: <b>{cpu}%</b>
RAM: <b>{ram}%</b>
Disk: <b>{disk}%</b>
Uptime: <b>{str(uptime).split('.')[0]}</b>

OS: <code>{safe(platform.platform())}</code>
"""
    await message.answer(text)


@dp.message(Command("services"))
async def cmd_services(message: Message):
    if await deny_if_not_admin(message):
        return

    try:
        client = get_docker_client()
        containers = client.containers.list(all=True)

        lines = ["<b>🐳 Docker Services</b>\n"]
        for c in containers:
            icon = "🟢" if c.status == "running" else "🔴"
            lines.append(f"{icon} <b>{safe(c.name)}</b> — <code>{safe(c.status)}</code>")

        await send_long(message, "\n".join(lines))
    except Exception as exc:
        logging.exception("services failed")
        await message.answer(f"❌ Docker error: <code>{safe(exc)}</code>")


@dp.message(Command("logs"))
async def cmd_logs(message: Message, command: CommandObject):
    if await deny_if_not_admin(message):
        return

    if not command.args:
        await message.answer("Қолдану: <code>/logs service_name [lines]</code>")
        return

    parts = command.args.split()
    service = parts[0]
    lines = 50

    if len(parts) > 1:
        try:
            lines = min(max(int(parts[1]), 1), 300)
        except ValueError:
            lines = 50

    try:
        client = get_docker_client()
        container = client.containers.get(service)
        logs = container.logs(tail=lines).decode(errors="ignore")
        text = f"<b>📜 Logs: {safe(service)}</b>\n<pre>{safe(logs[-3500:])}</pre>"
        await send_long(message, text)
    except docker.errors.NotFound:
        await message.answer(f"❌ Container not found: <code>{safe(service)}</code>")
    except Exception as exc:
        logging.exception("logs failed")
        await message.answer(f"❌ Logs error: <code>{safe(exc)}</code>")


@dp.message(Command("db_status"))
async def cmd_db_status(message: Message):
    if await deny_if_not_admin(message):
        return

    checks = []

    code, out, err = run_cmd([
        "docker", "exec", POSTGRES_CONTAINER,
        "pg_isready", "-U", POSTGRES_USER, "-d", POSTGRES_DB
    ])
    checks.append(f"Connection: {'🟢 OK' if code == 0 else '🔴 ERROR'}\n<code>{safe(out or err)}</code>")

    sql_size = "select pg_size_pretty(pg_database_size(current_database()));"
    code, out, err = run_cmd([
        "docker", "exec", POSTGRES_CONTAINER,
        "psql", "-U", POSTGRES_USER, "-d", POSTGRES_DB,
        "-tAc", sql_size
    ])
    checks.append(f"DB size: <b>{safe(out or err)}</b>")

    sql_conn = "select count(*) from pg_stat_activity;"
    code, out, err = run_cmd([
        "docker", "exec", POSTGRES_CONTAINER,
        "psql", "-U", POSTGRES_USER, "-d", POSTGRES_DB,
        "-tAc", sql_conn
    ])
    checks.append(f"Active connections: <b>{safe(out or err)}</b>")

    sql_slow = """
    select query, calls, round(total_exec_time::numeric,2) as total_ms
    from pg_stat_statements
    order by total_exec_time desc
    limit 3;
    """
    code, out, err = run_cmd([
        "docker", "exec", POSTGRES_CONTAINER,
        "psql", "-U", POSTGRES_USER, "-d", POSTGRES_DB,
        "-c", sql_slow
    ])
    if code == 0:
        checks.append(f"<b>Slow queries:</b>\n<pre>{safe(out[-1800:])}</pre>")
    else:
        checks.append("Slow queries: pg_stat_statements қосылмаған немесе қолжетімсіз.")

    await send_long(message, "<b>🗄 PostgreSQL Status</b>\n\n" + "\n\n".join(checks))


@dp.message(Command("fail2ban"))
async def cmd_fail2ban(message: Message):
    if await deny_if_not_admin(message):
        return

    code, out, err = run_cmd(["fail2ban-client", "status"], timeout=20)

    if code != 0:
        await message.answer(
            "⚠️ Fail2Ban қолжетімсіз.\n"
            "Docker ішінде бұл қалыпты болуы мүмкін. Толық тексеру үшін bot.py systemd арқылы host-та іске қосылады.\n\n"
            f"<code>{safe(err)}</code>"
        )
        return

    text = "<b>🛡 Fail2Ban Status</b>\n<pre>" + safe(out) + "</pre>"
    await send_long(message, text)


@dp.message(Command("top"))
async def cmd_top(message: Message):
    if await deny_if_not_admin(message):
        return

    processes = []
    for proc in psutil.process_iter(["pid", "name", "cpu_percent", "memory_percent"]):
        try:
            processes.append(proc.info)
        except Exception:
            pass

    top_cpu = sorted(processes, key=lambda x: x.get("cpu_percent") or 0, reverse=True)[:5]
    top_ram = sorted(processes, key=lambda x: x.get("memory_percent") or 0, reverse=True)[:5]

    lines = ["<b>🔥 Top CPU</b>"]
    for p in top_cpu:
        lines.append(f"<code>{p['pid']}</code> {safe(p['name'])} — CPU {p.get('cpu_percent') or 0}%")

    lines.append("\n<b>🧠 Top RAM</b>")
    for p in top_ram:
        lines.append(f"<code>{p['pid']}</code> {safe(p['name'])} — RAM {round(p.get('memory_percent') or 0, 2)}%")

    await message.answer("\n".join(lines))


@dp.message(Command("backup"))
async def cmd_backup(message: Message):
    if await deny_if_not_admin(message):
        return

    backup_dir = Path(PROJECT_DIR) / "backups"
    backup_dir.mkdir(parents=True, exist_ok=True)

    filename = backup_dir / f"hotel_db_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sql"

    cmd = [
        "docker", "exec", POSTGRES_CONTAINER,
        "pg_dump", "-U", POSTGRES_USER, POSTGRES_DB
    ]

    logging.info("Creating backup: %s", filename)

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)

        if result.returncode != 0:
            await message.answer(f"❌ Backup failed:\n<pre>{safe(result.stderr[-2500:])}</pre>")
            return

        filename.write_text(result.stdout, encoding="utf-8")
        size = filename.stat().st_size / 1024 / 1024

        await message.answer(
            f"✅ Backup created\n"
            f"File: <code>{safe(filename)}</code>\n"
            f"Size: <b>{size:.2f} MB</b>"
        )

    except Exception as exc:
        logging.exception("backup failed")
        await message.answer(f"❌ Backup error: <code>{safe(exc)}</code>")


@dp.message(Command("deploy"))
async def cmd_deploy(message: Message):
    if await deny_if_not_admin(message):
        return

    await message.answer("🚀 Deploy started: git pull + docker compose up -d --build")

    code1, out1, err1 = run_cmd(["git", "pull"], cwd=PROJECT_DIR, timeout=90)
    code2, out2, err2 = run_cmd(["docker", "compose", "up", "-d", "--build"], cwd=PROJECT_DIR, timeout=300)

    if code1 == 0 and code2 == 0:
        await message.answer("✅ Deploy completed successfully.")
        return

    error_text = (err1 + "\n" + err2 + "\n" + out2).strip()
    first_20 = "\n".join(error_text.splitlines()[:20])

    await message.answer(
        "❌ Deploy failed.\n"
        "Алғашқы 20 жол error:\n"
        f"<pre>{safe(first_20)}</pre>"
    )


@dp.message(Command("restart"))
async def cmd_restart(message: Message, command: CommandObject):
    if await deny_if_not_admin(message):
        return

    if not command.args:
        await message.answer("Қолдану: <code>/restart container_name</code>")
        return

    service = command.args.strip().split()[0]

    try:
        client = get_docker_client()
        container = client.containers.get(service)
        container.restart()
        await message.answer(f"✅ Restarted: <code>{safe(service)}</code>")
    except docker.errors.NotFound:
        await message.answer(f"❌ Container not found: <code>{safe(service)}</code>")
    except Exception as exc:
        logging.exception("restart failed")
        await message.answer(f"❌ Restart error: <code>{safe(exc)}</code>")


@dp.message(Command("report"))
async def cmd_report(message: Message):
    if await deny_if_not_admin(message):
        return

    report = await build_report()
    await send_long(message, report)


# =========================
# DAILY REPORT
# =========================

async def build_report() -> str:
    cpu = psutil.cpu_percent(interval=1)
    ram = psutil.virtual_memory().percent
    disk = psutil.disk_usage("/").percent
    level = status_level(cpu, ram, disk)

    backend_ok, backend_msg = await http_check(BACKEND_HEALTH_URL)
    rooms_ok, rooms_msg = await http_check(BACKEND_ROOMS_URL)
    prometheus_ok, prometheus_msg = await http_check(f"{PROMETHEUS_URL}/-/healthy")
    alertmanager_ok, alertmanager_msg = await http_check(f"{ALERTMANAGER_URL}/-/healthy")

    try:
        client = get_docker_client()
        containers = client.containers.list(all=True)
        running = sum(1 for c in containers if c.status == "running")
        stopped = len(containers) - running
        docker_line = f"Running: {running}, stopped: {stopped}"
    except Exception as exc:
        docker_line = f"Docker error: {exc}"

    base_report = f"""
<b>📋 Daily DevOps Report</b>
Time: <code>{datetime.now(ZoneInfo(TIMEZONE)).strftime('%Y-%m-%d %H:%M:%S')}</code>

<b>Server:</b>
Status: <b>{level}</b>
CPU: <b>{cpu}%</b>
RAM: <b>{ram}%</b>
Disk: <b>{disk}%</b>

<b>Website/API:</b>
Backend health: {'🟢 OK' if backend_ok else '🔴 FAIL'} — <code>{safe(backend_msg)}</code>
Rooms API: {'🟢 OK' if rooms_ok else '🔴 FAIL'} — <code>{safe(rooms_msg[:80])}</code>

<b>Monitoring:</b>
Prometheus: {'🟢 OK' if prometheus_ok else '🔴 FAIL'} — <code>{safe(prometheus_msg)}</code>
Alertmanager: {'🟢 OK' if alertmanager_ok else '🔴 FAIL'} — <code>{safe(alertmanager_msg)}</code>

<b>Docker:</b>
{safe(docker_line)}
"""

    ai_summary = await post_ai_analyze(base_report)

    return base_report + "\n<b>🤖 AI Admin Analysis:</b>\n" + safe(ai_summary)


async def scheduled_daily_report():
    try:
        text = await build_report()
        await bot.send_message(ALLOWED_CHAT_ID, text)
    except Exception:
        logging.exception("daily report failed")


# =========================
# MAIN
# =========================

async def main():
    if not BOT_TOKEN:
        raise RuntimeError("TELEGRAM_BOT_TOKEN is empty")
    if not ALLOWED_CHAT_ID:
        raise RuntimeError("TELEGRAM_CHAT_ID is empty")

    scheduler.add_job(
        scheduled_daily_report,
        "cron",
        hour=DAILY_REPORT_HOUR,
        minute=0,
        id="daily_devops_report",
        replace_existing=True,
    )
    scheduler.start()

    logging.info("DevOps Admin Bot started")
    await bot.send_message(ALLOWED_CHAT_ID, "✅ DevOps Admin Bot started. Команда: /start")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
