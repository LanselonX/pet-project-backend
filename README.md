# Pet Project — Backend API

REST API for a meal ordering app. Built with NestJS, Prisma and PostgreSQL

Frontend is in a separate repo: [pet-project-frontend](https://github.com/LanselonX/pet-project-frontend).

## What it does

- Registration and login with JWT access + refresh tokens (kept in httpOnly cookies)
- Browsing the meal menu, with filtering by type and full nutrition data per meal
- Cart and order processing, both wrapped in transactions
- Admin CRUD for meals, chefs and users
- A dashboard endpoint with counts and pending orders
- Image upload

## Stack

NestJS 11 with Prisma 6 over PostgreSQL. Auth runs on Passport (local + two JWT strategies) with bcrypt for hashing. Validation is class-validator / class-transformer through a global pipe, file uploads go through Multer, and everything is TypeScript in strict mode. The Prisma client is generated into `generated/prisma` rather than the default location

## Auth

There are two tokens. The access token lives in an `Authentication` cookie, the refresh token in a `Refresh` cookie — both httpOnly. On login or register the server issues both, and stores a **bcrypt hash** of the refresh token in the user's `refreshToken` column

When the access token expires, the client calls `GET /auth/refresh`. The refresh strategy pulls the token out of the cookie, compares it against the stored hash, and if it matches issues a fresh access cookie. Logout clears both cookies and nulls out the stored token, so a session can be killed from the server side

Roles are `USER`, `ADMIN` and `CHEF`. Admin-only routes are protected by stacking `JwtAuthGuard` with `RolesGuard` and marking the handler with `@Roles(Role.ADMIN)`

One thing the access token carries is the user's role, which is what the frontend middleware reads to gate the admin panel

## Endpoints

### Auth

| Method | Endpoint         | Description              | Auth           |
| ------ | ---------------- | ------------------------ | -------------- |
| POST   | `/auth/register` | Register                 | —              |
| POST   | `/auth/login`    | Login                    | —              |
| GET    | `/auth/refresh`  | Refresh the access token | Refresh cookie |
| POST   | `/auth/logout`   | Logout                   | JWT            |
| GET    | `/auth/profile`  | Current user (id + role) | JWT            |

### Meals

| Method | Endpoint           | Description                      | Auth        |
| ------ | ------------------ | -------------------------------- | ----------- |
| GET    | `/meals`           | List meals, filterable by type   | JWT         |
| GET    | `/meals/:id`       | One meal with full nutrient info | —           |
| GET    | `/meals/admin`     | All meals (admin view)           | JWT + ADMIN |
| POST   | `/meals`           | Create a meal                    | JWT + ADMIN |
| PATCH  | `/meals/admin/:id` | Update a meal                    | JWT + ADMIN |
| DELETE | `/meals/:id`       | Delete a meal                    | JWT + ADMIN |

Meal types are `VEGETARIAN`, `NOT_SPICY`, `LOW_CARB`, `GLUTEN_FREE`. A meal can have several at once, since `type` is an array. Filtering uses a comma-separated query: `?type=VEGETARIAN,NOT_SPICY`

### Cart

| Method | Endpoint | Description              | Auth |
| ------ | -------- | ------------------------ | ---- |
| POST   | `/cart`  | Add items to the cart    | JWT  |
| GET    | `/cart`  | Get the cart with totals | JWT  |

The body is a list of items, not a single one:

```json
{
  "items": [{ "mealId": 1, "quantity": 2 }]
}
```

If a meal is already in the cart, its quantity gets bumped instead of duplicated. The whole thing runs inside a Prisma `$transaction`, and a `[cartId, mealId]` unique constraint backs that up at the DB level

### Orders

| Method | Endpoint             | Description                  | Auth        |
| ------ | -------------------- | ---------------------------- | ----------- |
| POST   | `/orders`            | Place an order from the cart | JWT         |
| GET    | `/orders`            | My orders (paginated)        | JWT         |
| GET    | `/orders/:id`        | One of my orders             | JWT         |
| GET    | `/orders/admin`      | All orders                   | JWT + ADMIN |
| GET    | `/orders/admin/:id`  | Any user's order             | JWT + ADMIN |
| PATCH  | `/orders/status/:id` | Change an order's status     | JWT + ADMIN |

Pagination is `?page=1&limit=5`, and limit is capped at 50

Status flow is `PENDING → SHIPPED → DELIVERED`, with `CANCELED` as the off-ramp. Placing an order is atomic: in one transaction it copies every cart item into the order and clears the cart

### Users (admin)

| Method | Endpoint     | Description    |
| ------ | ------------ | -------------- |
| GET    | `/users`     | List all users |
| DELETE | `/users/:id` | Delete a user  |

### Chefs (admin)

| Method | Endpoint     | Description                      |
| ------ | ------------ | -------------------------------- |
| POST   | `/chefs`     | Create a chef profile for a user |
| PATCH  | `/chefs/:id` | Update a chef                    |
| DELETE | `/chefs/:id` | Delete a chef                    |

### Dashboard (admin)

| Method | Endpoint     | Description                                                            |
| ------ | ------------ | ---------------------------------------------------------------------- |
| GET    | `/dashboard` | Counts (meals, users, orders, revenue) plus the list of pending orders |

Revenue is summed only over orders in the `SHIPPED` status

### Upload

| Method | Endpoint  | Description                          | Auth        |
| ------ | --------- | ------------------------------------ | ----------- |
| POST   | `/upload` | Upload an image (field name `image`) | JWT + ADMIN |

Files land in `/uploads/tmp` first and the response gives you `{ filename, url }`. When you actually attach that image to a meal, the meal service moves it out of `tmp` into its final place. Uploads are capped at 5 MB and filtered to images only. Static files are served from `/uploads/*` and `/assets/*`

## Database

```
User ─┬─ Cart ── CartItem ── Meal
      ├─ Order ── OrderItem ── Meal
      └─ Chef ── Meal[]

Meal ─┬─ Macronutrients (1:1)
      └─ Micronutrients (1:1)
```

A few things worth knowing:

- A user has at most one cart (`userId` is unique), and cart items cascade-delete with the cart
- `CartItem` has a unique `[cartId, mealId]` pair, so the same meal can't show up twice
- `Meal.type` is an array, so one meal can belong to multiple types
- Macro and micronutrients are separate 1:1 tables that cascade-delete with their meal
- The refresh token sits on the `User` row as a bcrypt hash — there's no separate session table

## Running locally

You'll need Node 20+, PostgreSQL, and npm

```bash
git clone https://github.com/LanselonX/pet-project-backend.git
cd pet-project-backend
npm install

cp .env.example .env        # fill in the values

npx prisma migrate dev      # run migrations
npx prisma db seed          # optional: seed test data
npm run start:dev
```

By default the API comes up on the port from `.env` (`PORT`). The seed script creates a default user and admin from the `USER_*` / `ADMIN_*` variables

## Running with Docker

There's a `docker-compose.yml` that just brings up PostgreSQL, so you don't have to install it locally:

```bash
docker compose up -d        # starts the db
npx prisma migrate dev
npm run start:dev
```

Make sure `DATABASE_URL` points at the host/port the compose file exposes. There's also a `Dockerfile` that builds the app, runs `prisma migrate deploy` and the seed, then starts the server — that's what the production image uses

## Environment

Copy `.env.example` to `.env` and fill it in. The important ones:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@db:5432/pet_project?schema=public"

# JWT
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRATION=15m     # also used as cookie Max-Age
JWT_REFRESH_EXPIRATION=7d

# Server
PORT=4000
CLIENT_URL=http://localhost:3000   # used for CORS

# Seed accounts
USER_EMAIL=...
USER_PASSWORD=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
```

Small catch to be aware of: the token cookies set `Max-Age` from the expiration values via `Number(...)`. The sample `.env` ships them as `15m` / `7d`, which `Number()` turns into `NaN` — if you want the cookie max-age to behave, use plain seconds there (e.g. `900` and `604800`). The JWT lifetime itself is fine either way

## Project structure

```
src/
├── auth/            # local + jwt + refresh strategies, guards, @Roles decorator
├── meals/           # meal CRUD, type filtering, nutrient relations
├── cart/            # cart with transactional addToCart
├── orders/          # orders, pagination, status updates
├── chefs/           # chef profiles
├── users/           # user management (admin)
├── dashboard/       # aggregated stats for the admin panel
├── file/            # image upload (POST /upload)
├── database/        # Prisma service wrapper
├── utils/           # filename helpers, total-price, seed helpers, interfaces
└── main.ts          # bootstrap: CORS, cookie-parser, static assets, validation pipe

common/
├── decorators/      # @MealTypeQuery()
├── dto/             # InfinityPaginationResponseDto
├── interfaces/      # ReqWithUser
├── types/           # pagination options
└── infinity-pagination.ts

prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

## License

MIT
