<p align="center">
  <img src="https://em-content.zobj.net/source/apple/391/pizza_1f355.png" width="80" alt="PizzaApp Logo" />
</p>

<h1 align="center">🍕 PizzaApp — Full-Stack Pizza Delivery</h1>

<p align="center">
  <strong>A production-grade pizza ordering platform with live pizza builder, Razorpay payments, real-time order tracking, and a full admin dashboard.</strong>
</p>

<p align="center">
  <a href="https://oibsip-app-blush-seven.vercel.app">🌐 Live Demo</a> &nbsp;·&nbsp;
  <a href="https://github.com/AEVILOP">👤 GitHub</a> &nbsp;·&nbsp;
  <a href="https://linkedin.com/in/anirban-banerjee">💼 LinkedIn</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Razorpay-Test_Mode-3395FF?style=flat-square&logo=razorpay&logoColor=white" alt="Razorpay" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Render-Backend-46E3B7?style=flat-square&logo=render&logoColor=white" alt="Render" />
</p>

---

## 📸 Preview

| Home Page | Menu + Pagination | Pizza Builder |
|:---------:|:-----------------:|:-------------:|
| Auto-scrolling carousel of popular pizzas | Filter by category, 8 items/page | Drag-and-drop ingredient selection |

| Checkout (GST Invoice) | Order Tracking | Admin Dashboard |
|:----------------------:|:--------------:|:---------------:|
| Subtotal, GST 5%, platform fee, delivery | Real-time status updates | Revenue analytics & order management |

---

## ✨ Features

### 🛒 Customer Side
- **30+ Menu Items** — 20 pizzas (Veg, Non-Veg, Vegan), 5 drinks, 5 combo deals
- **Live Pizza Builder** — Choose base, sauce, cheese, and toppings with real-time visual preview
- **Smart Pagination** — 8 items per page with animated transitions and category filters
- **Auto-Scroll Carousel** — Homepage showcases popular pizzas in an infinite-scroll ribbon
- **Realistic Billing** — GST (5%), platform fee (₹10), conditional delivery charges (free above ₹499)
- **Razorpay Payments** — Integrated test-mode checkout (no real charges)
- **Order Tracking** — Real-time status: Confirmed → Preparing → Out for Delivery → Delivered
- **Responsive Design** — Dark theme, glassmorphism, Framer Motion animations

### 🔐 Authentication & Security
- **JWT Authentication** — Access tokens (15min) + refresh tokens (7 days, httpOnly cookie)
- **Auto-login after signup** — Seamless onboarding, no email verification friction
- **Password validation** — Min 8 chars, uppercase, number, special character with strength meter
- **Role-based access** — Separate `user` and `admin` roles
- **Security middleware** — Helmet, CORS, rate limiting, mongo sanitization

### 👨‍💼 Admin Panel
- **Dashboard** — Revenue stats, order counts, at-a-glance metrics
- **Order Management** — View all orders, update status through the delivery pipeline
- **Inventory Control** — Manage ingredient stock levels, availability toggles
- **Low Stock Alerts** — Automated email notifications when ingredients run low

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB Atlas |
| **Payments** | Razorpay (Test Mode) |
| **Auth** | JWT (Access + Refresh tokens), bcryptjs |
| **Email** | Nodemailer + Gmail App Passwords |
| **Hosting** | Vercel (Frontend) + Render (Backend) |

---

## 📁 Project Structure

```
pizza-app/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Layout.jsx     # App shell with navbar + footer
│   │   │   ├── Navbar.jsx     # Navigation with auth state
│   │   │   ├── PizzaPreview.jsx # Live pizza visual builder
│   │   │   ├── RazorpayCheckout.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── Loading.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx    # Home with auto-scroll carousel
│   │   │   ├── Menu.jsx       # Paginated menu with filters
│   │   │   ├── Builder.jsx    # Custom pizza builder
│   │   │   ├── Checkout.jsx   # GST billing + Razorpay
│   │   │   ├── Orders.jsx     # Order history
│   │   │   ├── OrderDetail.jsx
│   │   │   ├── AuthPages.jsx  # Login, Register, Forgot/Reset
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   └── AdminInventory.jsx
│   │   ├── context/           # React Context (Auth, Checkout)
│   │   └── utils/             # Axios config, formatters
│   └── vercel.json            # SPA routing config
│
├── server/                    # Express Backend
│   ├── controllers/           # Route handlers
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── catalogController.js
│   │   └── adminController.js
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Order.js
│   │   ├── PizzaVariety.js
│   │   └── Ingredient.js
│   ├── middleware/             # Auth, validation, error handling
│   ├── routes/                # Express routers
│   ├── utils/                 # Tokens, email, seed data
│   └── index.js               # Server entry point
│
├── .env.example               # Environment template
├── render.yaml                # Render deployment config
└── package.json               # Root scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **MongoDB Atlas** account ([free tier](https://www.mongodb.com/cloud/atlas))
- **Razorpay** test account ([dashboard](https://dashboard.razorpay.com/))
- **Gmail App Password** ([generate one](https://myaccount.google.com/apppasswords))

### 1. Clone the repository

```bash
git clone https://github.com/AEVILOP/OIBSIP_Web-Devlopment-and-Designing_Level3.git
cd OIBSIP_Web-Devlopment-and-Designing_Level3
```

### 2. Install dependencies

```bash
# Root + Server dependencies
npm install

# Client dependencies
cd client && npm install && cd ..
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/pizzaapp
ACCESS_TOKEN_SECRET=<random-64-char-string>
REFRESH_TOKEN_SECRET=<random-64-char-string>
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

RAZORPAY_KEY_ID=rzp_test_XXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXX

CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=your@gmail.com
VITE_API_URL=http://localhost:5000
```

### 4. Run the app

```bash
# Terminal 1 — Start the backend (auto-seeds 30 menu items)
cd server && npm run dev

# Terminal 2 — Start the frontend
cd client && npm run dev
```

Open **http://localhost:5173** and start ordering! 🍕

---

## 🌐 Deployment

### Frontend → Vercel

1. Import the GitHub repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `client`
3. Add env variable: `VITE_API_URL` = your Render backend URL
4. Deploy!

### Backend → Render

1. Create a **Web Service** on [render.com](https://render.com)
2. Set **Root Directory** to `server`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. Add all `.env` variables (MongoDB, JWT, Razorpay, Gmail, CLIENT_URL)
6. Deploy!

---

## 🔑 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Create a new account |
| POST | `/login` | Log in & receive JWT |
| POST | `/refresh-token` | Refresh access token |
| POST | `/logout` | Invalidate session |
| POST | `/forgot-password` | Send reset email |
| POST | `/reset-password` | Reset with token |

### Catalog (`/api/catalog`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pizzas` | Get all menu items |
| GET | `/ingredients` | Get all ingredients |

### Orders (`/api/orders`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create Razorpay order |
| POST | `/verify` | Verify payment & save |
| GET | `/my-orders` | User's order history |
| GET | `/:id` | Single order details |

### Admin (`/api/admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Dashboard metrics |
| GET | `/orders` | All orders |
| PATCH | `/orders/:id/status` | Update order status |
| PATCH | `/inventory/:id` | Update ingredient stock |

---

## 🧪 Test Credentials

**Razorpay Test Card:**
- Card Number: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- OTP: `1234`

---

## 👨‍💻 Author

**Anirban Banerjee**

- GitHub: [@AEVILOP](https://github.com/AEVILOP)
- LinkedIn: [Anirban Banerjee](https://linkedin.com/in/anirban-banerjee)

---

## 📄 License

This project is part of the **Oasis Infobyte** Web Development & Designing Internship (Level 3).

---

<p align="center">
  Made with ❤️ and 🍕 by <a href="https://github.com/AEVILOP">Anirban Banerjee</a>
</p>
