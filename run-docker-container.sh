docker run -dp 127.0.0.1:3000:3000 \
  -w /app -v "$(pwd):/app" \
  --network tenet-app \
  -e MYSQL_HOST=172.18.0.3 \
  -e MYSQL_USER=root \
  -e MYSQL_PASSWORD=secret \
  -e MYSQL_DB=nodemysql \
  node:18-alpine \
  sh -c "yarn install && yarn run dev"