FROM node:18-alpine
WORKDIR /app
COPY . .
RUN rm -r yarn.lock
RUN yarn install
CMD ["npx", "tsc"]
CMD ["node", "dist/index.js"]
EXPOSE 80