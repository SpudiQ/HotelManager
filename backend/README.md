# Hotel Manager Backend

## 🇷🇺 Русская версия

# Бэкенд системы управления объектами размещения

Современный, масштабируемый бэкенд для управления объектами размещения, построенный на **NestJS**, **TypeORM** и **PostgreSQL**. Реализованы полные CRUD-операции для рабочих пространств (workspaces) и объектов (properties), безопасная аутентификация и ролевая модель доступа.

## Возможности

- **Аутентификация и авторизация** – JWT-токены, регистрация (только гостевой доступ), роли (guest, manager, admin, superadmin).
- **Управление ресурсами** – рабочие пространства (организации) и объекты (отели, базы отдыха) с уникальными slug для удобных URL.
- **Гибкий поиск по идентификатору** – большинство эндпоинтов принимают как UUID, так и slug.
- **Составная уникальность** – slug объекта уникален глобально, slug и название рабочего пространства также глобально уникальны.
- **Подгрузка связанных данных** – при запросе рабочего пространства автоматически включаются его объекты (eager loading).
- **Безопасность** – Helmet, CORS, валидация через DTO, хеширование паролей bcrypt.
- **Начальное заполнение базы** – при первом запуске создаётся суперадмин (данные из `.env`).

## Стек технологий

- **Фреймворк**: [NestJS](https://nestjs.com/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **База данных**: PostgreSQL (через Docker)
- **Аутентификация**: Passport.js (Local + JWT стратегии)
- **Валидация**: class-validator + class-transformer

## Быстрый старт

### Требования

- Docker & Docker Compose
- Node.js (опционально, для локальной разработки)

### Установка

1. Склонируйте репозиторий.
2. Скопируйте `backend/.env.example` в `backend/.env` и при необходимости измените настройки.
3. Из корня проекта выполните:

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. API будет доступно по адресу `http://localhost:3010/api`.

> Для разработки используется `synchronize: true` – таблицы создаются автоматически.

### Переменные окружения

| Переменная          | Значение по умолчанию   | Описание                          |
|---------------------|-------------------------|-----------------------------------|
| `PORT`              | 3010                    | Порт сервера                      |
| `DB_HOST`           | localhost               | Хост PostgreSQL                   |
| `DB_PORT`           | 5432                    | Порт PostgreSQL                   |
| `DB_USERNAME`       | postgres                | Пользователь БД                   |
| `DB_PASSWORD`       | postgres                | Пароль БД                         |
| `DB_NAME`           | hotelmanager            | Имя БД                            |
| `JWT_SECRET`        | default-secret-key      | Секрет для подписи JWT            |
| `ADMIN_EMAIL`       | admin@example.com       | Email суперадмина (при seed)      |
| `ADMIN_PASSWORD`    | admin                   | Пароль суперадмина (при seed)     |
| `FRONTEND_URL`      | http://localhost:3000   | Разрешённый источник для CORS     |

## Документация API

Все эндпоинты имеют префикс `/api`. Для защищённых маршрутов необходимо передавать JWT в заголовке `Authorization`:

```
Authorization: Bearer <your-token>
```

### Аутентификация

#### `POST /auth/register`

Регистрация нового пользователя (всегда с ролью `guest`).

**Тело запроса**:
```json
{
  "email": "user@example.com",
  "password": "secret123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",    // необязательно
  "workspaceId": "..."       // необязательно
}
```

**Ответ** (`201 Created`):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "guest",
  "workspaceId": null,
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### `POST /auth/login`

Аутентификация и получение JWT-токена.

**Тело запроса**:
```json
{
  "email": "admin@example.com",
  "password": "admin"
}
```

**Ответ** (`200 OK`):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Рабочее пространство (Workspace)

Рабочее пространство представляет организацию (например, сеть отелей). Для операций записи требуются роли **admin** или **superadmin**; GET-эндпоинты доступны любому аутентифицированному пользователю.

| Метод | Эндпоинт                        | Описание                                   | Доступ          |
|-------|---------------------------------|--------------------------------------------|-----------------|
| POST  | `/workspaces`                   | Создать рабочее пространство               | admin/superadmin|
| GET   | `/workspaces`                   | Список всех рабочих пространств            | authenticated   |
| GET   | `/workspaces/:identifier`       | Получить рабочее пространство по UUID или slug | authenticated |
| PATCH | `/workspaces/:id`               | Обновить рабочее пространство (только UUID) | admin/superadmin|
| DELETE| `/workspaces/:id`               | Удалить рабочее пространство               | admin/superadmin|

#### `POST /workspaces`

**Тело запроса**:
```json
{
  "name": "My Resort",
  "slug": "my-resort",
  "settings": {}
}
```

**Ответ** (`201 Created`):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "My Resort",
  "slug": "my-resort",
  "settings": {},
  "createdAt": "...",
  "updatedAt": "..."
}
```

> При запросе `GET /workspaces/:identifier` в ответе автоматически присутствует массив `properties` (благодаря eager loading).

### Объект размещения (Property)

Объект размещения – физическое заведение (отель, база отдыха), принадлежащее рабочему пространству.

| Метод | Эндпоинт                          | Описание                                       | Доступ          |
|-------|-----------------------------------|------------------------------------------------|-----------------|
| POST  | `/properties`                     | Создать объект (требуется `workspaceId`)       | admin/superadmin|
| GET   | `/properties`                     | Список объектов (опционально `workspaceId`)    | authenticated   |
| GET   | `/properties/:identifier`         | Получить объект по UUID или slug               | authenticated   |
| PATCH | `/properties/:id`                 | Обновить объект (только UUID)                  | admin/superadmin|
| DELETE| `/properties/:id`                 | Удалить объект                                 | admin/superadmin|

#### `POST /properties`

**Тело запроса**:
```json
{
  "name": "Beach Hotel",
  "slug": "beach-hotel",
  "type": "hotel",
  "address": "123 Ocean Drive",
  "description": "Luxury beachfront resort",
  "workspaceId": "550e8400-e29b-41d4-a716-446655440000",
  "contacts": {
    "phone": "+1234567890",
    "email": "info@beachhotel.com"
  },
  "settings": {
    "checkIn": "14:00",
    "checkOut": "11:00"
  },
  "isActive": true
}
```

**Ответ** (`201 Created`):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Beach Hotel",
  "slug": "beach-hotel",
  "type": "hotel",
  "address": "123 Ocean Drive",
  "description": "Luxury beachfront resort",
  "contacts": {...},
  "settings": {...},
  "isActive": true,
  "workspaceId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### `GET /properties?workspaceId=...`

Возвращает все объекты, возможно фильтрованные по `workspaceId`.

## Особенности реализации

- **Гибкий идентификатор**: в `GET /workspaces/:identifier` и `GET /properties/:identifier` `:identifier` может быть как **UUID**, так и **slug**.
- **Eager loading**: при получении рабочего пространства в ответе автоматически включаются его объекты.
- **Уникальность**: поля `name` и `slug` рабочего пространства глобально уникальны. `slug` объекта также глобально уникален.
- **Ролевая иерархия**:
  - `guest` – может просматривать публичные данные (в будущем управлять своими бронированиями).
  - `manager` – может управлять объектами, бронированиями и основными настройками.
  - `admin` – полный доступ ко всем ресурсам в рамках своего рабочего пространства.
  - `superadmin` – может создавать рабочие пространства и управлять всеми пользователями.

## Обработка ошибок

API возвращает стандартные HTTP-статусы:

- `200 OK` – успешные GET, PATCH, DELETE.
- `201 Created` – успешный POST.
- `400 Bad Request` – ошибка валидации.
- `401 Unauthorized` – отсутствует или недействителен токен.
- `403 Forbidden` – недостаточно прав.
- `404 Not Found` – ресурс не найден.
- `409 Conflict` – нарушение уникальности (например, дубликат slug).
- `500 Internal Server Error` – непредвиденная ошибка (подробности в логах).

## Безопасность

- **Helmet** устанавливает безопасные HTTP-заголовки.
- **CORS** ограничивает разрешённый источник.
- **JWT** токены истекают через 1 день.
- **Пароли** хешируются bcrypt (10 раундов).
- **ValidationPipe** с `whitelist: true` отбрасывает неизвестные поля из DTO.
- **SQL-инъекции** исключены благодаря использованию TypeORM с параметризованными запросами.

## Планы на развитие

- **Категории** – группировка номеров/домиков (Стандарт, Люкс).
- **Единицы размещения** – отдельные номера, домики.
- **Тарифы и цены** – динамическое ценообразование по датам.
- **Бронирования** – управление бронями.
- **Платёжная интеграция** – ЮKassa / Т‑Банк.
- **Миграции** – замена `synchronize: true` на миграции для production.

---

## 🇬🇧 English version

# Hotel Manager Backend

A modern, scalable backend for managing accommodation properties, built with **NestJS**, **TypeORM**, and **PostgreSQL**. It provides full CRUD operations for workspaces and properties, secure authentication, and role‑based access control.

## Features

- **Authentication & Authorization** – JWT‑based login, registration (guest only), and role‑based guards (guest, manager, admin, superadmin).
- **Resource Management** – Workspaces (organizations) and properties (hotels, resorts, etc.) with unique slugs for human‑readable URLs.
- **Flexible Identifier Lookup** – Most endpoints accept either a UUID or a slug, making API calls intuitive.
- **Composite Uniqueness** – Property slugs must be unique globally; workspace names and slugs are also globally unique.
- **Eager Loading** – Workspace responses automatically include their associated properties.
- **Security** – Helmet, CORS, input validation via DTOs, and password hashing with bcrypt.
- **Database Seeding** – Automatically creates a superadmin on first run (credentials configurable via `.env`).

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Database**: PostgreSQL (via Docker)
- **Authentication**: Passport.js (Local + JWT strategies)
- **Validation**: class-validator + class-transformer

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js (optional, for local development)

### Setup

1. Clone the repository.
2. Copy `backend/.env.example` to `backend/.env` and adjust variables if needed.
3. From the project root, run:

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. The API will be available at `http://localhost:3010/api`.

> The backend is configured with `synchronize: true` for development – tables are created automatically.

### Environment Variables

| Variable          | Default               | Description                          |
|-------------------|-----------------------|--------------------------------------|
| `PORT`            | 3010                  | Server port                          |
| `DB_HOST`         | localhost             | PostgreSQL host                      |
| `DB_PORT`         | 5432                  | PostgreSQL port                      |
| `DB_USERNAME`     | postgres              | Database user                        |
| `DB_PASSWORD`     | postgres              | Database password                    |
| `DB_NAME`         | hotelmanager          | Database name                        |
| `JWT_SECRET`      | default-secret-key    | Secret for JWT signing               |
| `ADMIN_EMAIL`     | admin@example.com     | Default superadmin email (seed)      |
| `ADMIN_PASSWORD`  | admin                 | Default superadmin password (seed)   |
| `FRONTEND_URL`    | http://localhost:3000 | Allowed CORS origin                  |

## API Documentation

All endpoints are prefixed with `/api`. Authentication is required for most routes – send the JWT in the `Authorization` header:

```
Authorization: Bearer <your-token>
```

### Authentication

#### `POST /auth/register`

Register a new user (always created with role `guest`).

**Request body**:
```json
{
  "email": "user@example.com",
  "password": "secret123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",    // optional
  "workspaceId": "..."       // optional
}
```

**Response** (`201 Created`):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "guest",
  "workspaceId": null,
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### `POST /auth/login`

Authenticate and receive a JWT token.

**Request body**:
```json
{
  "email": "admin@example.com",
  "password": "admin"
}
```

**Response** (`200 OK`):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Workspace

Workspace represents an organization (e.g., a hotel chain or a single property owner). All endpoints require **admin or superadmin** role for write operations; GET endpoints are accessible to any authenticated user.

| Method | Endpoint                        | Description                                 | Access          |
|--------|---------------------------------|---------------------------------------------|-----------------|
| POST   | `/workspaces`                   | Create a new workspace                      | admin/superadmin|
| GET    | `/workspaces`                   | List all workspaces                         | authenticated   |
| GET    | `/workspaces/:identifier`       | Get workspace by UUID or slug               | authenticated   |
| PATCH  | `/workspaces/:id`               | Update workspace (id required, not slug)    | admin/superadmin|
| DELETE | `/workspaces/:id`               | Delete workspace                            | admin/superadmin|

#### `POST /workspaces`

**Request body**:
```json
{
  "name": "My Resort",
  "slug": "my-resort",
  "settings": {}
}
```

**Response** (`201 Created`):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "My Resort",
  "slug": "my-resort",
  "settings": {},
  "createdAt": "...",
  "updatedAt": "..."
}
```

> The `properties` array is automatically included when using `GET /workspaces/:identifier` because of eager loading.

### Property

Property represents a physical establishment (hotel, resort, etc.) belonging to a workspace.

| Method | Endpoint                          | Description                                      | Access          |
|--------|-----------------------------------|--------------------------------------------------|-----------------|
| POST   | `/properties`                     | Create a new property (requires workspaceId)     | admin/superadmin|
| GET    | `/properties`                     | List all properties (optional `workspaceId` query) | authenticated |
| GET    | `/properties/:identifier`         | Get property by UUID or slug                     | authenticated   |
| PATCH  | `/properties/:id`                 | Update property (id required, not slug)          | admin/superadmin|
| DELETE | `/properties/:id`                 | Delete property                                  | admin/superadmin|

#### `POST /properties`

**Request body**:
```json
{
  "name": "Beach Hotel",
  "slug": "beach-hotel",
  "type": "hotel",
  "address": "123 Ocean Drive",
  "description": "Luxury beachfront resort",
  "workspaceId": "550e8400-e29b-41d4-a716-446655440000",
  "contacts": {
    "phone": "+1234567890",
    "email": "info@beachhotel.com"
  },
  "settings": {
    "checkIn": "14:00",
    "checkOut": "11:00"
  },
  "isActive": true
}
```

**Response** (`201 Created`):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Beach Hotel",
  "slug": "beach-hotel",
  "type": "hotel",
  "address": "123 Ocean Drive",
  "description": "Luxury beachfront resort",
  "contacts": {...},
  "settings": {...},
  "isActive": true,
  "workspaceId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### `GET /properties?workspaceId=...`

Returns all properties, optionally filtered by `workspaceId`.

## Special Notes

- **Identifier flexibility**: In `GET /workspaces/:identifier` and `GET /properties/:identifier`, `:identifier` can be either a **UUID** or a **slug**.
- **Eager loading**: When fetching a workspace, its properties are automatically included in the response.
- **Uniqueness**: Workspace `name` and `slug` are globally unique. Property `slug` is also globally unique.
- **Role hierarchy**:
  - `guest` – can view public data and manage own bookings (future).
  - `manager` – can manage properties, bookings, and basic settings (future).
  - `admin` – full access to all resources within a workspace.
  - `superadmin` – can create workspaces and manage all users.

## Error Handling

The API returns standard HTTP status codes:

- `200 OK` – successful GET, PATCH, DELETE.
- `201 Created` – successful POST.
- `400 Bad Request` – validation error.
- `401 Unauthorized` – missing or invalid token.
- `403 Forbidden` – insufficient role.
- `404 Not Found` – resource not found.
- `409 Conflict` – unique constraint violation (e.g., duplicate slug).
- `500 Internal Server Error` – unexpected server error (logs detailed in console).

## Security

- **Helmet** sets secure HTTP headers.
- **CORS** restricts requests to configured origin.
- **JWT** tokens expire after 1 day.
- **Passwords** are hashed with bcrypt (10 rounds).
- **ValidationPipe** with `whitelist: true` strips unknown properties from DTOs.
- **No SQL injection** – TypeORM uses parameterized queries.

## Future Development

- **Category** – group accommodation units (e.g., Standard, Deluxe).
- **AccommodationUnit** – individual rooms/cottages.
- **Rate** – dynamic pricing per date.
- **Booking** – reservation management.
- **Payment integration** – with YooKassa / T‑Bank.
- **Migration** – replace `synchronize: true` with proper migrations for production.

---

*This project is built as a portfolio piece to demonstrate clean architecture, secure API design, and modern NestJS practices.*