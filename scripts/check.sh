#!/usr/bin/env bash
set -e
curl -f http://localhost/api/health
curl -f http://localhost/api/hotels
curl -f http://localhost/api/rooms
curl -f http://localhost/api/metrics >/dev/null
docker compose ps
