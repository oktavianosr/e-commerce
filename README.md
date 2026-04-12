# E-Commerce Backend API

A production-ready e-commerce REST API built with **Node.js**, **Express**, **TypeScript**, **Prisma ORM**, and **MySQL**.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express 5 | HTTP Framework |
| TypeScript | Type Safety |
| Prisma 5 | ORM |
| MySQL | Database |
| JSON Web Token | Authentication |
| bcrypt | Password Hashing |
| Zod | Request Validation |

## Project Structure

```
src/
├── controllers/            # Route handlers (class-based, extends BaseController)
│   ├── base.controller.ts  # Consistent response helper (respondSuccess / respondError)
│   ├── authController.ts   # Signup, Login, Me
│   ├── productController.ts# CRUD Products + Search
│   └── userController.ts   # Address management + User management
├── exceptions/             # Custom error classes
│   ├── root.ts             # HttpException base class + ErrorCode enum
│   ├── bad-request.ts      # 400 Bad Request
│   ├── not-found.ts        # 404 Not Found
│   ├── unauthorized.ts     # 401 Unauthorized
│   ├── validation.ts       # 422 Unprocessable Entity
│   └── internal-exceptions.ts # 500 Internal Server Error
├── middleware/
│   ├── auth.ts             # JWT token verification
│   ├── admin.ts            # Role-based access (ADMIN only)
│   └── errors.ts           # Global error response middleware
├── routes/
│   ├── index.ts            # Root router (/api)
│   ├── auth.ts             # /api/auth/*
│   ├── products.ts         # /api/products/*
│   ├── users.ts            # /api/users/*
│   ├── cart.ts             # /api/cart/*        (planned)
│   └── orders.ts           # /api/order/*       (planned)
├── schema/
│   └── users.ts            # Zod validation schemas (SignUpSchema, AddressSchema)
├── types/
│   ├── express.d.ts        # Express Request augmentation (req.user)
│   └── authenticated-request.ts # AuthenticatedRequest type for protected routes
├── error-handler.ts        # errorHandler HOF — wraps controllers with try/catch
├── secrets.ts              # Environment variable exports
└── index.ts                # App entry point
```

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | - | Register a new user |
| POST | `/login` | - | Login and receive JWT token |
| GET | `/me` | JWT | Get current authenticated user |

### Products (`/api/products`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Admin | Create a product |
| GET | `/` | Admin | List all products (paginated) |
| GET | `/search` | JWT | Search products *(planned)* |
| GET | `/:id` | Admin | Get product by ID |
| PUT | `/:id` | Admin | Update a product |
| DELETE | `/:id` | Admin | Delete a product |

### Users (`/api/users`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/address` | JWT | Add a new address |
| DELETE | `/address/:id` | JWT | Delete an address |
| GET | `/address` | JWT | List user's addresses |
| PUT | `/` | JWT | Update user profile *(planned)* |
| PUT | `/:id/role` | Admin | Change user role *(planned)* |
| GET | `/` | Admin | List all users *(planned)* |
| GET | `/:id` | Admin | Get user by ID *(planned)* |

### Cart (`/api/cart`) *(planned)*

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | JWT | Add item to cart |
| GET | `/` | JWT | Get user's cart |
| PUT | `/:id` | JWT | Change item quantity |
| DELETE | `/:id` | JWT | Remove item from cart |

### Orders (`/api/order`) *(planned)*

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | JWT | Create order from cart |
| GET | `/` | JWT | List user's orders |
| GET | `/:id` | JWT | Get order by ID |
| PUT | `/:id/cancel` | JWT | Cancel an order |
| GET | `/index` | Admin | List all orders (filter by status) |
| GET | `/users/:id` | Admin | List orders by user |
| PUT | `/:id/status` | Admin | Update order status |

## Database Schema

### Current Models

```
User       ── 1:N ── Address
Product
```

### Planned Models

```
User       ── 1:N ── Address
           ── 1:N ── CartItem ── N:1 ── Product
           ── 1:N ── Order    ── 1:N ── OrderProduct ── N:1 ── Product
                               ── 1:N ── OrderEvent

Product

Order Status: PENDING → ACCEPTED → OUT_FOR_DELIVERY → DELIVERED
                      └─────────→ CANCELLED
```

| Model | Description |
|---|---|
| **User** | Account with role (ADMIN / USER), related addresses, cart, and orders |
| **Product** | Name, description, price, tags |
| **Address** | Shipping / billing address linked to user |
| **CartItem** | Links user to product with quantity |
| **Order** | Net amount, delivery address, status tracking |
| **OrderProduct** | Junction table: products in an order with quantity |
| **OrderEvent** | Tracks order status changes throughout lifecycle |

## Architecture Highlights

- **Class-based Controllers** — All controllers extend `BaseController` for consistent JSON responses:
  ```json
  { "success": true, "message": "...", "data": {...}, "meta": {...} }
  ```
- **Centralized Error Handling** — `errorHandler` HOF wraps all controllers, catches `HttpException` and `ZodError` automatically
- **Custom Exception Hierarchy** — `HttpException` → `BadRequestException`, `NotFoundException`, `UnauthorizedException`, etc.
- **Type-safe Auth** — `AuthenticatedRequest` interface ensures `req.user` is always defined in protected routes
- **Zod Validation** — Schema-based request body validation with detailed error responses

## Getting Started

### Prerequisites

- Node.js >= 18
- MySQL >= 8.0

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd e-commerce

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials
```

### Environment Variables

```env
DATABASE_URL="mysql://root:root@localhost:3306/ecommerce?schema=public"
PORT=3000
JWT_SECRET="your-secret-key"
```

### Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### Run

```bash
# Development
npm run start

# Format code
npm run format
```

## Error Response Format

All errors follow a consistent structure:

```json
{
  "success": false,
  "message": "User already exists",
  "errorCode": 1002,
  "errors": null
}
```

| Error Code | Name |
|---|---|
| 1001 | USER_NOT_FOUND |
| 1002 | USER_ALREADY_EXISTS |
| 1003 | INCORRECT_CREDENTIALS |
| 2001 | UNPROCESSABLE_ENTITY |
| 3001 | INTERNAL_EXCEPTION |
| 4001 | UNAUTHORIZED |

## License

ISC
