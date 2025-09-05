FROM oven/bun:1
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    ca-certificates \
    wget \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY package.json ./
RUN bun install 

COPY src ./src

ENV NODE_ENV=production

RUN chown -R bun:bun ./src 

USER bun
EXPOSE 3000
CMD ["bun", "run", "dev"]

