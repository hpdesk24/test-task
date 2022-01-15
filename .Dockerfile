# Prebuilt MS image
FROM mcr.microsoft.com/playwright:bionic

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

CMD ["npx", "playwright", "test"]