# 🚀 Inventory Management System

A modern full-stack **Inventory Management System** built with **Spring Boot**, **React (Vite)**, and **MySQL**. This application helps businesses efficiently manage products, categories, inventory levels, and stock analytics through a clean and responsive dashboard.

## ✨ Features

- 🔐 Secure JWT Authentication
- 📦 Product Management (Add, Update, Delete, Search)
- 📂 Category Management
- 📊 Dashboard Analytics
- 📉 Low Stock Monitoring
- 🔍 Product Search
- 📱 Responsive User Interface
- 🎨 Modern Glassmorphism UI with Smooth Animations

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- Bootstrap 5
- Framer Motion
- React Icons
- Recharts

### Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT Authentication
- Maven

### Database
- MySQL

---

## 📁 Project Structure

```
inventory-management-system/
│
├── inventory/          # Spring Boot Backend
│
└── inventory-ui/       # React Frontend
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/inventory-management-system.git
```

### 2. Backend

```bash
cd inventory
```

Configure MySQL in:

```
src/main/resources/application.properties
```

Run:

```bash
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

---

### 3. Frontend

```bash
cd inventory-ui
```

Install dependencies

```bash
npm install
```

Run

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 📡 API Modules

### Authentication
- Register
- Login

### Categories
- Create Category
- Get Categories
- Update Category
- Delete Category

### Products
- Add Product
- Get Products
- Update Product
- Delete Product
- Search Products

### Dashboard
- Inventory Summary
- Total Products
- Total Categories
- Inventory Value
- Low Stock Products

---

## 📸 Screenshots

> Screenshots will be added after UI completion.

- Login Page
- Dashboard
- Product Management
- Category Management

---

## 🚀 Deployment

Frontend:
```
Will be deployed on Vercel
```

Backend:
```
Will be deployed on Railway
```

---

## 👨‍💻 Author

**Rushikesh**

GitHub:
https://github.com/rushikeshthakre12

---

## 📄 License

This project was developed as part of the **BeRAM Drones Internship Assignment**.
