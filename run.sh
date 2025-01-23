#!/bin/bash

# Parando serviço do swarm front-suporte
docker stack rm front-suporte

# Removendo imagem antiga
docker image rm app-front-suporte:latest

# Construir a imagem nova
docker build -t app-front-suporte:latest .

# Deployar o stack
docker stack deploy -c docker-compose.yml front-suporte