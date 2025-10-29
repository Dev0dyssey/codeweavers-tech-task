# Vehicle Inventory & Finance Calculator

A modern Angular web application for browsing vehicle inventory and calculating finance options. Built with Angular 20, TypeScript, and Angular Material.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Testing](#testing)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

This application provides a comprehensive vehicle browsing and financing experience, allowing users to browse vehicles, search and filter results, view detailed vehicle information, and calculate custom finance quotes.

---

## ✨ Features

- Browse vehicle inventory with search and filtering capabilities
- Sort vehicles by price, year, or mileage (ascending/descending)
- View detailed vehicle information
- Calculate finance quotes with customizable deposit and term options
- Responsive design with modern UI/UX

---

## 🛠 Tech Stack

- **Framework**: Angular 20.3.0
- **Language**: TypeScript 5.9.2
- **UI Library**: Angular Material 20.2.10
- **State Management**: Angular Signals (reactive primitives)
- **Routing**: Angular Router with lazy-loaded components
- **Forms**: Reactive Forms with validation
- **Testing**: Jasmine & Karma

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.19.0+ or v20.11.0+ (LTS recommended, supports latest versions)
- **npm**: v9.0.0+ (comes with Node.js)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd codeweavers-tech-task
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200/`

The app will automatically reload when you make changes to source files.

### 4. Build for Production

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

---

## 💡 Decisions

### Allowing user input on deposit and term

Task stated the deposit values can be hardcoded, I decided to make them default and allow users to modify these. This more closely resembles real life use case. Max term of 120 is an arbitrarily chosen number and can be updated at any point.

### Clamping the deposit and term values

Aim is to prevent users being able to type in values that would break the logic, especially with deposit calculations. More robust validation is another option and can be discussed.

---

## 🧪 Testing

Run unit tests with:

```bash
npm test
```

Tests are written using **Jasmine** and run with **Karma** test runner.

---

## 🔮 Future Enhancements

### Potential Features
- [ ] API integration with real backend
- [ ] Advanced filtering to allow multiple filters at once
- [ ] Home Screen
- [ ] User authentication
- [ ] Visual and styling improvements

### Technical Improvements
- [ ] E2E testing with Cypress or Playwright

---

## 📄 License

This project was created as a technical assessment for Codeweavers.

---

**Built with ❤️ using Angular 20**
