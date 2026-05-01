#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATE="$(date +%Y-%m-%d_%H-%M-%S)"
BACKUP_DIR="$ROOT_DIR/backups/$DATE"
mkdir -p "$BACKUP_DIR"

cd "$ROOT_DIR"
if [ -f .env ]; then set -a; . ./.env; set +a; fi

docker exec hotel_postgres pg_dump -U "${DB_USER:-hotel_user}" "${DB_NAME:-hotel_db}" > "$BACKUP_DIR/hotel_db.sql"
cp docker-compose.yml "$BACKUP_DIR/"
cp .env.example "$BACKUP_DIR/" 2>/dev/null || true
cp -r monitoring "$BACKUP_DIR/"
cp -r nginx "$BACKUP_DIR/"

tar -czf "$ROOT_DIR/backups/hotel_backup_$DATE.tar.gz" -C "$BACKUP_DIR" .
echo "Backup created: $ROOT_DIR/backups/hotel_backup_$DATE.tar.gz"
