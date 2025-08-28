# Canteen Ordering System

**Live Demo:** [https://canteen-system-qgop.vercel.app/](https://canteen-system-qgop.vercel.app/)

A modern web application for managing canteen orders built with **React (Vite)**, **Node.js**, **Express**, and **MongoDB**. This system allows users to browse menu items, place orders, and for admins to manage menu and orders efficiently.


---

## Features

- Browse the canteen menu with categories and prices.
- Place, track, and manage orders.
- Admin panel to add, update, or remove menu items.
- Real-time order updates (optional with WebSockets).
- User authentication and role-based access (Admin/User).

---

## Tech Stack

- **Frontend:** React + Vite, TailwindCSS (optional)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas or local)
- **Authentication:** JWT (JSON Web Tokens)
- **State Management:** React Context / Redux (optional)
- **Tools:** Postman, VSCode, Git

---

## Project Structure

```text
canteen-ordering-system/
├─ backend/
│  ├─ models/         # Mongoose models
│  ├─ routes/         # Express routes
│  ├─ controllers/    # Route handlers
│  ├─ middleware/     # Auth and error handling
│  ├─ server.js       # Entry point
├─ frontend/
│  ├─ src/
│  │  ├─ components/  # React components
│  │  ├─ pages/       # Page components
│  │  ├─ context/     # State management
│  │  ├─ App.jsx      # Main app component
│  │  └─ main.jsx     # Vite entry
├─ .env               # Environment variables
├─ package.json
└─ README.md
