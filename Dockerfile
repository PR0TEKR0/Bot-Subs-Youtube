# Imagen base
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos del proyecto al contenedor
COPY package*.json ./
RUN npm install

COPY . .

# Puerto expuesto
EXPOSE 3000

# Comando por defecto
CMD ["node", "app.js"]
