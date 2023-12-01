FROM node:21.2.0 AS builder

WORKDIR /workdir

# 安装依赖
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

# 构建
COPY . .
RUN npm run build

FROM busybox:latest

COPY --from=builder /workdir/dist /dist
WORKDIR /dist
