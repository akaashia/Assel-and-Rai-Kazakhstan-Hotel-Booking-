terraform {
  required_version = ">= 1.4.0"

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }

    null = {
      source  = "hashicorp/null"
      version = "~> 3.2"
    }
  }
}

provider "docker" {}

resource "docker_network" "hotel_iac_network" {
  name = "hotel_iac_network"
}

resource "docker_image" "postgres" {
  name = "postgres:16"
}

resource "docker_image" "nginx" {
  name = "nginx:1.27-alpine"
}

resource "docker_image" "prometheus" {
  name = "prom/prometheus:latest"
}

resource "docker_image" "grafana" {
  name = "grafana/grafana:latest"
}

resource "docker_image" "n8n" {
  name = "n8nio/n8n:latest"
}

resource "docker_image" "jenkins" {
  name = "jenkins/jenkins:lts"
}

resource "null_resource" "deploy_stack_with_docker_compose" {
  triggers = {
    compose_sha = filesha256("${path.module}/../docker-compose.yml")
  }

  provisioner "local-exec" {
    command = "cd ${path.module}/.. && docker compose up -d --build"
  }
}

output "project_urls" {
  value = {
    frontend    = "http://localhost"
    backend_api = "http://localhost/api/health"
    prometheus = "http://localhost:9090"
    grafana    = "http://localhost:3007"
    n8n         = "http://localhost:5678"
    jenkins     = "http://localhost:8080"
  }
}
