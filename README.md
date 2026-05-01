# Kazakhstan Hotel Booking DevOps Project

Бұл архив Ubuntu 22.04/24.04 серверінде бір командамен іске қосылатын отель брондау жобасына арналған.

## Құрамы

- FastAPI backend
- React frontend
- PostgreSQL database
- Nginx reverse proxy
- Prometheus
- Grafana
- Alertmanager
- Telegram alert adapter
- n8n + Gemini workflow
- Jenkins
- Terraform
- Ansible
- backup және deploy scripts

## 1. Ubuntu ішінде архивті ашу

```bash
unzip hotel-booking-project-ready.zip
cd hotel-booking-project-ready
```

## 2. Бірінші дайындық

```bash
bash scripts/first-run.sh
```

Егер Docker permission қатесі шықса, терминалдан шығып қайта кіріңіз.

## 3. Жобаны іске қосу

```bash
docker compose up -d --build
```

## 4. Контейнерлерді тексеру

```bash
docker compose ps
```

## 5. Негізгі сілтемелер

```text
Frontend/Nginx: http://localhost
HTTPS self-signed: https://localhost
Backend API: http://localhost:4000
Backend docs: http://localhost:4000/docs
Prometheus: http://localhost:9090
Grafana: http://localhost:3000
n8n: http://localhost:5678
Jenkins: http://localhost:8080
```

## 6. API тексеру

```bash
curl http://localhost/api/hotels
curl http://localhost/api/rooms
curl "http://localhost/api/rooms?hotel_id=1&check_in=2026-05-20&check_out=2026-05-22"
curl http://localhost/api/bookings/1
curl http://localhost/api/metrics
```

AI endpoint:

```bash
curl "http://localhost/api/v1/assistant?question=Отель жүйесі не істейді?"
```

## 7. PostgreSQL тексеру

```bash
docker exec -it hotel_postgres psql -U hotel_user -d hotel_db
```

psql ішінде:

```sql
\dt
select * from hotels;
select * from rooms;
select * from clients;
select * from bookings;
select * from payments;
\q
```

## 8. Grafana

Кіру:

```text
Login: admin
Password: .env ішіндегі GF_SECURITY_ADMIN_PASSWORD
```

Prometheus datasource автоматты түрде қосылады.
Дайын dashboard: Hotel Booking Backend Monitoring.
Қосымша dashboard импорттау үшін Grafana Dashboard ID: 1860.

## 9. Telegram alert тест

Backend контейнерін уақытша тоқтату:

```bash
docker stop hotel_backend
```

1 минуттан кейін Alertmanager Telegram-ға хабарлама жіберуі керек.
Қайта қосу:

```bash
docker start hotel_backend
```

## 10. n8n workflow импорттау

n8n ашыңыз:

```text
http://localhost:5678
```

Содан кейін:

```text
Workflows -> Import from File -> /files/n8n_workflow_hotel_ai_assistant.json
```

Webhook path:

```text
POST http://localhost:5678/webhook/chat
```

Тест:

```bash
curl -X POST http://localhost:5678/webhook-test/chat   -H "Content-Type: application/json"   -d '{"question":"Қонақүй брондау жүйесі не істейді?"}'
```

Workflow production режимге қосылған соң:

```bash
curl -X POST http://localhost:5678/webhook/chat   -H "Content-Type: application/json"   -d '{"question":"Бос номерлерді қалай көремін?"}'
```

## 11. Jenkins

Бастапқы пароль:

```bash
docker exec hotel_jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Pipeline script ретінде `jenkins/Jenkinsfile` қолдануға болады.

## 12. Backup

```bash
bash scripts/backup.sh
ls backups
```

Cron қосу:

```bash
crontab -e
```

Қосу:

```text
0 3 * * * /home/USER/hotel-booking-project-ready/scripts/backup.sh
```

`USER` орнына өз Ubuntu username қойыңыз.

## 13. Deploy

```bash
bash scripts/deploy.sh
```

## 14. Terraform

```bash
cd terraform
terraform init
terraform validate
terraform plan
cd ..
```

## 15. Ansible

```bash
sudo apt install -y ansible
cd ansible
ansible-playbook -i inventory playbook.yml --check
cd ..
```

## 16. GitHub-қа жүктеу

`.env` GitHub-қа шықпауы керек.

```bash
git init
git add .
git commit -m "Initial hotel booking DevOps project"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

## 17. Қорғауда көрсету реті

1. `docker compose ps`
2. `curl http://localhost/api/hotels`
3. `curl http://localhost/api/rooms`
4. PostgreSQL кестелері
5. Grafana dashboard
6. Prometheus Targets
7. Telegram alert test
8. n8n Gemini workflow
9. Jenkins job
10. Terraform validate
11. Ansible check
12. Backup script

## 18. Маңызды қауіпсіздік

`.env` файлында құпия кілттер бар. Оны GitHub-қа жүктемеңіз.
Егер кілттер чатта немесе басқа жерде көрініп қалса, қорғаудан кейін жаңа token/key жасап ауыстырған дұрыс.
