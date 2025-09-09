# 🌾 Harvest Direct

**A Modern Digital Platform Connecting Farmers Directly with Consumers**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-indigo)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-cyan)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)](https://www.postgresql.org/)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

Harvest Direct is a comprehensive full-stack web application that revolutionizes the agricultural supply chain by creating a direct connection between farmers and consumers. The platform eliminates middlemen, ensures fair pricing, and promotes sustainable farming practices through a modern, user-friendly digital marketplace.

### **Mission Statement**
Empowering farmers with technology while providing consumers access to fresh, quality agricultural products through transparent, direct trade relationships.

### **Key Benefits**
- **For Farmers:** Direct market access, better profit margins, digital presence, order management
- **For Consumers:** Fresh produce, transparent sourcing, competitive pricing, quality assurance
- **For Admins:** Platform oversight, user management, quality control, analytics

## ✨ Features

### 🔐 **User Authentication & Authorization**
- **Secure Authentication System** with bcrypt password hashing
- **Role-Based Access Control** (Admin, Farmer, Consumer)
- **User Account Approval** workflow with admin verification
- **Protected Routes** with custom authentication hooks
- **Session Management** with localStorage integration

### 👨‍🌾 **Farmer Management System**
- **Farmer Profile & Certification** management with verification badges
- **Product Listing & Inventory** management with image uploads
- **Order Management** with status tracking (Pending → Confirmed → Shipped → Delivered)
- **Financial Tracking & Reporting** with revenue analytics and CSV export
- **Educational Resources** access and management

### 🛒 **Consumer Shopping Experience**
- **Product Browsing & Discovery** with advanced search and filtering
- **Shopping Cart System** with real-time updates and stock validation
- **Order Placement & Tracking** with seamless checkout process
- **Rating & Review System** for products and farmers
- **Wishlist Management** and purchase history

### 🔔 **Communication & Engagement**
- **Real-Time Push Notifications** for order updates and new products
- **Event & Workshop Listings** for agricultural education and networking
- **Farmer Rating System** based on order experiences
- **Community Features** for knowledge sharing

### 📊 **Administrative Controls**
- **User Account Approval** with comprehensive verification process
- **Product Quality Control** with approval/rejection workflows
- **Platform Analytics** and user management
- **Educational Content Management** for farmer resources
- **Event Organization** and community building

### 💰 **E-Commerce Functionality**
- **Secure Payment Processing** integration ready
- **Inventory Management** with automatic stock updates
- **Multi-Vendor Support** (multiple farmers per order)
- **Order Status Tracking** throughout the fulfillment process
- **Financial Reporting** for farmers and platform analytics

## 🛠 Tech Stack

### **Frontend**
- **Framework:** Next.js 15.4.5 with App Router
- **Language:** TypeScript for type safety
- **Styling:** Tailwind CSS 4.0 with custom animations
- **UI Components:** Custom React components with responsive design
- **State Management:** React Hooks (useState, useEffect, custom hooks)

### **Backend**
- **Runtime:** Node.js with Next.js API Routes
- **Database ORM:** Prisma with PostgreSQL
- **Authentication:** Custom JWT-like system with bcryptjs
- **File Handling:** Next.js built-in file upload support
- **API Design:** RESTful APIs with proper HTTP methods

### **Database**
- **Primary Database:** PostgreSQL
- **ORM:** Prisma for type-safe database operations
- **Migration System:** Prisma Migrate for schema management
- **Relationships:** Complex relational data with foreign keys

### **Development Tools**
- **Linting:** ESLint with custom configuration
- **Code Quality:** TypeScript strict mode
- **Package Manager:** npm/yarn
- **Version Control:** Git with structured commit history

## 🏗 Architecture

### **MVC Pattern Implementation**

The application follows the Model-View-Controller (MVC) architectural pattern:

#### **Model Layer (Database)**
```
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── migrations/            # Database migration files
```

#### **View Layer (Frontend)**
```
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── admin/            # Admin dashboard
│   │   ├── farmer/           # Farmer dashboard  
│   │   ├── consumer/         # Consumer dashboard
│   │   └── login/            # Authentication pages
│   └── components/           # Reusable React components
```

#### **Controller Layer (Backend)**
```
├── src/
│   ├── app/api/              # API route handlers
│   │   ├── admin/           # Admin operations
│   │   ├── farmer/          # Farmer operations
│   │   ├── cart/            # Shopping cart management
│   │   ├── orders/          # Order processing
│   │   ├── products/        # Product management
│   │   └── notifications/   # Notification system
│   └── lib/                 # Utility functions and configurations
```

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18.x or higher
- PostgreSQL database
- npm or yarn package manager

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/fuad-mahee/harvest-direct.git
cd harvest-direct
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/harvest_direct"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Seed the database
npx prisma db seed
```

5. **Start the development server**
```bash
npm run dev
# or
yarn dev
```

6. **Access the application**
Open [http://localhost:3000](http://localhost:3000) in your browser.

### **Default Admin Account**
```
Email: admin@harvestdirect.com
Password: admin123
```

## 📡 API Documentation

### **Authentication Endpoints**
- `POST /api/login` - User authentication
- `POST /api/signup` - User registration

### **Product Management**
- `GET /api/products` - List products with filters
- `POST /api/farmer/products` - Create new product
- `PUT /api/farmer/products/[id]` - Update product
- `DELETE /api/farmer/products/[id]` - Delete product

### **Order Management**
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders` - Update order status

### **Cart Operations**
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart` - Remove cart item

### **Admin Operations**
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/[id]` - Approve/reject users
- `GET /api/admin/products` - Review products
- `PUT /api/admin/products/[id]` - Approve/reject products

## 🗄 Database Schema

### **Core Models**

```prisma
model User {
  id           String        @id @default(cuid())
  email        String        @unique
  password     String
  name         String?
  role         UserRole      @default(CONSUMER)
  status       UserStatus    @default(PENDING)
  products     Product[]
  orders       Order[]
  // ... additional fields
}

model Product {
  id          String        @id @default(cuid())
  name        String
  description String?
  price       Float
  category    String
  quantity    Int
  farmerId    String
  farmer      User          @relation(fields: [farmerId], references: [id])
  // ... additional fields
}

model Order {
  id         String      @id @default(cuid())
  userId     String
  user       User        @relation(fields: [userId], references: [id])
  total      Float
  status     OrderStatus @default(PENDING)
  items      OrderItem[]
  // ... additional fields
}
```

## 👥 User Roles

### **Admin** 🔧
- User account approval/rejection
- Product quality control
- Platform analytics and monitoring
- Educational content management
- Event organization

### **Farmer** 🌱
- Product listing and inventory management
- Order fulfillment and status updates
- Financial tracking and reporting
- Profile and certification management
- Educational resource access

### **Consumer** 🛍
- Product browsing and purchasing
- Shopping cart and order management
- Rating and review submission
- Event participation
- Wishlist management

## 📱 Screenshots

### **Landing Page**
Modern, responsive design with hero section and feature highlights.

### **Product Catalog**
Advanced filtering, search functionality, and detailed product cards.

### **Shopping Cart**
Real-time updates, quantity management, and seamless checkout.

### **Dashboard Views**
Role-specific dashboards with comprehensive functionality.

## 🤝 Contributing

We welcome contributions to Harvest Direct! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add JSDoc comments for functions
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo:** [Coming Soon]
- **Documentation:** [Wiki](https://github.com/fuad-mahee/harvest-direct/wiki)
- **Issues:** [Bug Reports](https://github.com/fuad-mahee/harvest-direct/issues)
- **Discussions:** [Community Forum](https://github.com/fuad-mahee/harvest-direct/discussions)

---

**Built with ❤️ for the farming community**

*Harvest Direct - Bridging the gap between farmers and consumers through technology*
