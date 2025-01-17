# Etapa 1: Construção do React
FROM node:16 as build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia os arquivos do projeto
COPY . .

# Faz o build da aplicação
RUN npm run build

# Etapa 2: Servir com NGINX
FROM nginx:alpine

# Copia os arquivos estáticos do build para o NGINX
COPY --from=build /app/build /usr/share/nginx/html

# Copia o arquivo de configuração padrão do NGINX (opcional)
EXPOSE 80

# Define o comando padrão
CMD ["nginx", "-g", "daemon off;"]
