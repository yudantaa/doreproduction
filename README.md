# Dore Production Inventory Management System

Welcome to the **Dore Production Inventory Management System**! This project is designed to streamline the inventory management process for Dore Production, a company specializing in sound and lighting equipment rental for events.

## 📖 Overview

The **Inventory Management System** is a web-based application built with Laravel, utilizing Tailwind CSS for styling and MySQL for data storage. This system aims to replace the manual record-keeping process currently in use, providing a more efficient, secure, and user-friendly solution for managing inventory items, loans, and user roles.

### Key Features
- **User Management**: Supports multiple user roles (Admin, Employee, Visitor) with role-based access control.
- **Inventory Tracking**: Add, edit, and remove items from inventory, categorized by type (e.g., sound, lighting).
- **Loan Management**: Easily manage equipment loans, including tracking item availability and return dates.
- **Blog Section**: Share updates, tips, and announcements through a blog integrated into the platform.
- **Responsive Design**: Built with Tailwind CSS, ensuring a seamless user experience on both desktop and mobile devices.

## 🚀 Technologies Used
- **Backend**: PHP, Laravel
- **Frontend**: HTML, CSS, Tailwind CSS
- **Database**: MySQL
- **Development Tools**: Visual Studio Code, Git, Composer, npm

## 📦 Installation

To get started with this project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dore-production-inventory.git
   cd dore-production-inventory
   ```

2. Install dependencies:
   ```bash
   composer install
   npm install
   ```

3. Copy the `.env.example` file to `.env` and configure your database settings:
   ```bash
   cp .env.example .env
   ```

4. Generate the application key:
   ```bash
   php artisan key:generate
   ```

5. Run migrations to set up the database:
   ```bash
   php artisan migrate
   ```

6. Serve the application:
   ```bash
   php artisan serve
   ```
