# Hotel Manager — Система управления объектами размещения

## 🇷🇺

**Hotel Manager** — это демонстрационный проект, созданный для портфолио(в связи с реалиями текущего рынка труда). Он представляет собой полнофункциональную систему управления бронированием для отелей, баз отдыха, гостевых домов и других объектов размещения.

Проект демонстрирует современный подход к разработке веб-приложений с использованием **NestJS** на бэкенде и **Nuxt 3** на фронтенде. Вся инфраструктура поднимается через **Docker Compose**, что упрощает развёртывание и тестирование.

> 💡 **Цель проекта** — показать навыки разработки сложных full‑stack приложений, умение проектировать базы данных, создавать безопасные REST API и удобный интерфейс для управления.

### 📦 Возможности (реализовано на данный момент)

#### Бэкенд (NestJS + PostgreSQL)

- 🔐 **Аутентификация и авторизация**
  - Регистрация (только роль `guest`)
  - Вход по email/паролю, выдача JWT
  - Роли: `guest`, `manager`, `admin`, `superadmin`
  - Защита маршрутов с помощью Guards (`JwtAuthGuard`, `RolesGuard`)

- 🏢 **Управление рабочими пространствами (Workspace)**
  - Полный CRUD
  - Уникальные `name` и `slug` (slug используется в URL)
  - Поиск как по UUID, так и по slug

- 🏨 **Управление объектами размещения (Property)**
  - Полный CRUD, привязка к Workspace
  - Уникальный глобальный `slug`
  - Фильтрация по `workspaceId`

- 🛡 **Безопасность**
  - Хеширование паролей (bcrypt)
  - Helmet, CORS, валидация через class-validator
  - Защита от SQL-инъекций (TypeORM)

- 🌱 **Seed базы данных**
  - При первом запуске автоматически создаётся суперадмин (данные из `.env`)

#### Фронтенд (Nuxt 3)

- 🖥 **Адаптивный интерфейс** (в процессе разработки)
- 🔑 Страницы входа и регистрации
- 📋 Панель управления для работы с Workspace и Property (требует авторизации)
- ⚡️ Горячая перезагрузка (HMR) в Docker

---

### 🧱 Технологический стек

| Компонент          | Технологии                                                                |
|--------------------|---------------------------------------------------------------------------|
| **Бэкенд**         | NestJS, TypeORM, PostgreSQL, Passport (JWT), bcrypt, class-validator      |
| **Фронтенд**       | Nuxt 3, Vue 3, Vite, TailwindCSS (план)                                   |
| **Инфраструктура** | Docker, Docker Compose, Git (GitLab / GitHub)                             |
| **Инструменты**    | ESLint, Prettier, TypeScript                                              |

---

### 🚀 Быстрый старт

#### Требования
- Docker и Docker Compose
- Git

#### Запуск проекта

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/yourusername/hotel-manager.git
   cd hotel-manager
   ```

2. Скопируйте файлы окружения:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. Запустите контейнеры:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. Откройте в браузере:
   - Фронтенд: `http://localhost:3000`
   - Бэкенд API: `http://localhost:3010/api`

5. Авторизуйтесь как суперадмин (по умолчанию):
   - Email: `admin@example.com`
   - Пароль: `admin`

> 🔧 **Примечание**: Вы можете изменить учётные данные суперадмина в `backend/.env` перед запуском.

---

### 📂 Структура проекта

```
hotel-manager/
├── backend/               # NestJS приложение
│   ├── src/
│   ├── Dockerfile.dev
│   ├── .env.example
│   └── package.json
├── frontend/              # Nuxt 3 приложение
│   ├── app/
│   ├── Dockerfile.dev
│   └── nuxt.config.ts
├── docker-compose.dev.yml
└── README.md
```

---

### 🤝 Лицензия

Проект является демонстрационным и не предназначен для коммерческого использования без доработок. Все права на код принадлежат автору.

---

### 📬 Контакты

- Telegram: [@unnamedqdq](https://t.me/unnamedqdq)
- Почта: yura_anisimov@list.ru

## 🇬🇧

**Hotel Manager** is a demonstration project for a portfolio. It showcases a fully functional booking management system for hotels, resorts, guest houses, and other accommodation facilities.

The project demonstrates modern web development practices using **NestJS** for the backend and **Nuxt 3** for the frontend, with everything running inside **Docker Compose** for easy setup and testing.

> 💡 **Goal**: To exhibit skills in building complex full‑stack applications, database design, secure REST APIs, and user‑friendly interfaces.

### ✨ Features (currently implemented)

#### Backend (NestJS + PostgreSQL)

- 🔐 **Authentication & Authorization**
  - Registration (only `guest` role)
  - Login with email/password, JWT issuance
  - Roles: `guest`, `manager`, `admin`, `superadmin`
  - Route protection with Guards (`JwtAuthGuard`, `RolesGuard`)

- 🏢 **Workspace Management**
  - Full CRUD
  - Unique `name` and `slug` (slug used in URLs)
  - Lookup by UUID or slug

- 🏨 **Property Management**
  - Full CRUD, linked to a Workspace
  - Globally unique `slug`
  - Filtering by `workspaceId`

- 🛡 **Security**
  - Password hashing (bcrypt)
  - Helmet, CORS, class-validator
  - SQL injection protection (TypeORM)

- 🌱 **Database Seeding**
  - Creates a superadmin on first run (credentials from `.env`)

#### Frontend (Nuxt 3)

- 🖥 **Responsive UI** (in progress)
- 🔑 Login / Registration pages
- 📋 Admin dashboard for Workspace and Property management (requires auth)
- ⚡️ Hot Module Replacement inside Docker

---

### 🧱 Tech Stack

| Component          | Technologies                                                         |
|--------------------|----------------------------------------------------------------------|
| **Backend**        | NestJS, TypeORM, PostgreSQL, Passport (JWT), bcrypt, class-validator |
| **Frontend**       | Nuxt 3, Vue 3, Vite                                                  |
| **Infrastructure** | Docker, Docker Compose, Git (GitLab / GitHub)                        |
| **Tooling**        | ESLint, Prettier, TypeScript                                         |

---

### 🚀 Quick Start

#### Prerequisites
- Docker & Docker Compose
- Git

#### Run the project

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hotel-manager.git
   cd hotel-manager
   ```

2. Copy environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. Start containers:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. Open in browser:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3010/api`

5. Log in as superadmin (default):
   - Email: `admin@example.com`
   - Password: `admin`

> 🔧 **Note**: You can change superadmin credentials in `backend/.env` before starting.

---

### 📂 Project Structure

```
hotel-manager/
├── backend/               # NestJS application
│   ├── src/
│   ├── Dockerfile.dev
│   ├── .env.example
│   └── package.json
├── frontend/              # Nuxt 3 application
│   ├── app/
│   ├── Dockerfile.dev
│   └── nuxt.config.ts
├── docker-compose.dev.yml
└── README.md
```

---

### 🤝 License

This is a demonstration project and not intended for commercial use without further development. All rights belong to the author.

---

### 📬 Contact

- Telegram: [@unnamedqdq](https://t.me/unnamedqdq)
- Email: yura_anisimov@list.ru
