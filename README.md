# 🕒 Attendance System - Frontend

A beautifully crafted, modern web app to manage employee attendance efficiently.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC)

## 🚀 Key Features

### 🔐 Authentication & Authorization

- **Role-based access control** (Admin, Manager, Employee)
- **Secure JWT authentication**
- **Protected routes** based on user roles
- **Password management** with change password functionality

### 👥 Employee Management

- **Employee profiles** with detailed information
- **Department assignment**
- **Role management** (Admin, Manager, Employee)
- **Bulk employee operations** (for admins/managers)

### 🏢 Department Management

- **Department creation and management**
- **Attendance rules configuration** (max clock-in/out times, late tolerance)
- **Employee assignment** to departments
- **Department-specific reporting**

### ⏰ Attendance Tracking

- **Clock in/out functionality** with real-time status
- **Automatic status calculation** (Late, On Time, Early Leave, Absent)
- **Working hours calculation**
- **Attendance history** with filtering options
- **Admin/Manager override** for clock in/out

### 📈 Reporting & Analytics

- **Real-time dashboard** with key metrics
- **Attendance reports** with date range filtering
- **Department-wise analytics**
- **Export functionality** (Excel & CSV formats)
- **Summary statistics**

### 🎨 User Experience

- **Dark theme** with gradient backgrounds
- **Responsive design** for all devices
- **Real-time updates** and notifications
- **Intuitive navigation** with sidebar menu
- **Loading states** and error handling

## 🧰 Technology Stack

- **Frontend Framework**: React 18
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Styling**: Tailwind CSS + DaisyUI
- **Icons**: Heroicons (via SVG)
- **Notifications**: React Toastify
- **Date Handling**: date-fns
- **UI Components**: Custom components with Tailwind CSS

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server running

### Setup Instructions

1. **Clone the repository**

```text
git clone https://github.com/ImranNursandi/attendance-system-frontend
```

2. **Install dependencies**

```text
npm install
```

3. **Environment Configuration**

- Create a .env file in the root directory: \*

```text
VITE_API_BASE_URL=http://localhost:8080
```

4. **Start the development server**

```text
npm run dev
```

4. **Access the application**

Open http://localhost:5173 in your browser.
