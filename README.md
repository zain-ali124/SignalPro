# 📈 SignalPro — Crypto Trading Signal Platform

A full-stack web application where users can subscribe to trading signal packages and receive daily crypto & forex signals from an admin.

---

## 🧰 What Is This?

SignalPro is a platform where:
- **Users** sign up, pay for a package, and get trading signals every day
- **Admins** post signals, approve payments, and manage users
- Signals include entry price, stop loss, take profit, and analysis
- Users can view live charts using TradingView

---

## ⚙️ Tech Stack

| Part | Technology |
|---|---|
| Frontend | React, TailwindCSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Auth | JWT (JSON Web Tokens) |
| File Upload | Multer + Cloudinary |
| Charts | Recharts + TradingView Widget |

---

## 📦 Packages / Plans

| Package | Signals Per Day | Price |
|---|---|---|
| 🥉 Bronze | 3 | $29/month |
| 🥈 Silver | 6 | $49/month |
| 🥇 Gold | 10 | $99/month |
| 💎 Diamond | Unlimited | $199/month |

---

## 📁 Project Structure

```
trading-signal-platform/
├── client/       ← React Frontend
└── server/       ← Node.js Backend
```

---

## 🚀 How To Run The Project

### Step 1 — Clone or download the project

```bash
git clone https://github.com/yourusername/trading-signal-platform.git
cd trading-signal-platform
```

---

### Step 2 — Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=any_random_secret_key
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ADMIN_NAME=Super Admin
ADMIN_EMAIL=admin@tradingplatform.com
ADMIN_PASSWORD=Admin@123456

CLIENT_URL=http://localhost:5173
```

Seed the database (creates admin account + 4 packages):

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

---

### Step 3 — Setup the Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend will run on: `http://localhost:5173`

> ⚠️ Make sure the backend is also running at the same time.

---

## 🔑 How To Login As Admin

After running the seed command, use these credentials:

```
Email:    admin@tradingplatform.com
Password: Admin@123456
```

---

## 👤 How The User Flow Works

```
1. User visits the website
2. User clicks "Get Started" and registers
3. User selects a package (Bronze / Silver / Gold / Diamond)
4. User sends payment and uploads a screenshot as proof
5. Account status = "Pending"
6. Admin reviews the screenshot and approves or rejects
7. If approved → Account becomes "Active"
8. User can now view daily trading signals
9. Signal limit resets every day at midnight
```

---

## 🛠️ Admin Can Do

- View dashboard stats (users, revenue, signals)
- Post new trading signals
- Approve or reject user payments
- Suspend or activate user accounts
- Upgrade user packages
- Edit package prices and features

---

## 📡 API Routes

### Auth
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login
GET    /api/auth/me                Get current user
POST   /api/auth/forgot-password   Send reset link
POST   /api/auth/reset-password/:token   Reset password
```

### User
```
GET    /api/users/profile          Get profile
PUT    /api/users/profile          Update profile
PUT    /api/users/change-password  Change password
GET    /api/users/signal-status    Check today's signal usage
```

### Signals
```
GET    /api/signals                Get signals (applies daily limit)
GET    /api/signals/all            Browse all signals
POST   /api/signals                Create signal (admin only)
PUT    /api/signals/:id            Edit signal (admin only)
DELETE /api/signals/:id            Delete signal (admin only)
```

### Payments
```
GET    /api/payments/my            My payment history
POST   /api/payments/upload-proof  Upload payment screenshot
GET    /api/payments               All payments (admin only)
PUT    /api/payments/:id/approve   Approve payment (admin only)
PUT    /api/payments/:id/reject    Reject payment (admin only)
```

### Admin
```
GET    /api/admin/stats                   Dashboard stats
GET    /api/admin/users                   All users
PUT    /api/admin/users/:id/status        Change user status
PUT    /api/admin/users/:id/package       Change user package
GET    /api/admin/packages                All packages
PUT    /api/admin/packages/:id            Edit package
```

---

## 🌐 Pages

### Public Pages
| Page | URL |
|---|---|
| Landing Page | `/` |
| Login | `/login` |
| Register | `/register` |
| Forgot Password | `/forgot-password` |

### User Dashboard
| Page | URL |
|---|---|
| Dashboard Home | `/dashboard` |
| Signals | `/dashboard/signals` |
| Live Chart | `/dashboard/chart` |
| Payment History | `/dashboard/payments` |
| Profile | `/dashboard/profile` |

### Admin Panel
| Page | URL |
|---|---|
| Admin Dashboard | `/admin` |
| Manage Signals | `/admin/signals` |
| Manage Users | `/admin/users` |
| Payments | `/admin/payments` |
| Packages | `/admin/packages` |

---

## 🎨 UI Features

- ✅ Dark and Light mode toggle
- ✅ Orange glowing theme with glassmorphism cards
- ✅ Smooth animations using Framer Motion
- ✅ Fully responsive (works on mobile)
- ✅ Live TradingView chart (BTC, ETH, SOL, EUR/USD, Gold, and more)
- ✅ 3-step registration with payment proof upload
- ✅ Admin analytics charts (area chart + pie chart)

---

## ☁️ How To Deploy

### Frontend → Vercel
```bash
cd client
npm run build
# Upload to Vercel
```

### Backend → Railway / DigitalOcean / VPS
```bash
cd server
npm start
```

### Database → MongoDB Atlas
- Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Copy the connection string into your `.env` as `MONGO_URI`

### File Storage → Cloudinary
- Create a free account at [cloudinary.com](https://cloudinary.com)
- Copy your cloud name, API key, and API secret into `.env`

---

## 🔒 Security Features

- Passwords are hashed using **bcryptjs**
- All routes are protected with **JWT tokens**
- File uploads are restricted to images only (max 5MB)
- Rate limiting on login and register routes
- Admin-only routes are double-protected
- Input validation on all forms

---

## ⏰ Automatic Daily Reset

Every day at **midnight**, a cron job automatically resets every user's daily signal count back to 0. This is handled by `node-cron` in the backend.

---

## 🐛 Common Errors & Fixes

| Error | Fix |
|---|---|
| `MongoDB connection failed` | Check your `MONGO_URI` in `.env` |
| `Cloudinary upload failed` | Check your Cloudinary keys in `.env` |
| `Token expired` | Login again to get a new token |
| `Account not active` | Admin needs to approve your payment first |
| `Daily limit reached` | Wait until midnight for the reset |
| `uploads folder missing` | It is created automatically on first run |

---

## 📞 Need Help?

If something is not working:
1. Make sure both `server` and `client` are running
2. Check your `.env` file has all values filled in
3. Make sure your IP is whitelisted in MongoDB Atlas
4. Check the browser console for error messages
5. Check the terminal for backend error messages

---

## 📝 License

This project is for personal and commercial use. Feel free to modify it for your own trading platform.

---

> Built with ❤️ using the MERN Stack