#!/usr/bin/env bash
set -euo pipefail

sudo apt update
sudo apt install -y curl git  docker-compose-plugin ufw fail2ban postgresql-client openssl unzip nano
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker "$USER" || true

sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 8080
sudo ufw allow 3000
sudo ufw allow 9090
sudo ufw allow 5678
sudo ufw --force enable

sudo tee /etc/fail2ban/jail.local >/dev/null <<'EOF'
[sshd]
enabled = true
port = ssh
maxretry = 5
bantime = 1h
findtime = 10m
EOF
sudo systemctl restart fail2ban

chmod +x scripts/*.sh

echo "Base packages installed. If Docker permission fails, log out and log in again."
