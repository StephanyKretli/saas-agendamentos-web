FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

# Variáveis NEXT_PUBLIC_* são inlinadas no bundle durante o `next build`.
# Precisam existir AQUI, como ARG, e não só no runtime do container — caso
# contrário o navegador recebe o fallback do código, enquanto o servidor usa
# o valor real. Divergência entre os dois quebra a deduplicação da Meta.
ARG NEXT_PUBLIC_META_PIXEL_ID
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BOOKING_BASE_URL
ARG NEXT_PUBLIC_GOOGLE_ADS_ID
ARG NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL

ENV NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BOOKING_BASE_URL=$NEXT_PUBLIC_BOOKING_BASE_URL
ENV NEXT_PUBLIC_GOOGLE_ADS_ID=$NEXT_PUBLIC_GOOGLE_ADS_ID
ENV NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL=$NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
