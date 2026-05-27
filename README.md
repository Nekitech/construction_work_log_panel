# Журнал работ на строительном объекте

## Запуск

### Production

```bash
cp .env.example .env
docker compose up --build
```

Приложение: http://localhost  
Swagger: http://localhost:3000/api

Миграции и тестовые данные применяются автоматически при первом старте.

---

### Dev (hot reload)

```bash
cp .env.example .env
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Приложение: http://localhost:5173  
Swagger: http://localhost:3000/api
