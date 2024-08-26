# i want this to run on raspberry pi also
FROM arm64v8/node:20-alpine

WORKDIR /app

#for database storage
RUN mkdir -p /app/data

COPY . .

RUN npm install

EXPOSE 3001

CMD ["npm", "start"]