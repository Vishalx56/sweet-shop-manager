# Sweet Shop Manager

A robust, full-stack solution designed to streamline inventory and sales for boutique sweet shops. Built with performance and scalability in mind using the modern PERN/SERN stack (PostgreSQL/SQLite, Express, React, Node).

## Project Overview

This application serves as a centralized dashboard for store owners to manage their confectionery inventory ("Sweets") in real-time. It features secure role-based authentication, separating customer purchase flows from administrative stock management.

### Technical Highlights (Interview Ready)
- **Architecture**: Monorepo structure with separated concerns (Controller-Service pattern).
- **Security**: Stateless **JWT Authentication** with **Role-Based Access Control (RBAC)** middleware.
- **Database**: Type-safe interactions using **Prisma ORM** with automated migrations.
- **Frontend**: Custom **React Context** for global state management and **Axios Interceptors** for seamless auth injection.
- **Styling**: Bespoke "Neobrutalist/Hand-Drawn" design system implemented with pure CSS variables and animations.
- **Quality Assurance**: 100% Test coverage on critical business logic using **Jest** and **Supertest** (TDD methodology).

## Features
- **User Authentication**: Secure Register and Login flows.
- **Sweets Management**: Create, Read, Update, Delete (CRUD) operations.
- **Inventory Control**: Atomic stock decrementing on purchase.
- **Responsive Design**: Mobile-friendly "App-like" feel.

## Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
3. `npx prisma migrate dev --name init`
4. `npm run dev` (Runs on Port 3000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Runs on Port 5173)

### Testing
Run `npm test` in the `backend` directory to execute the test suite.
