# FinTrack - Personal Finance Manager

FinTrack is a comprehensive personal finance application designed to help you track your income and expenses with ease. Built with the MERN stack (MongoDB, Express.js, React, Node.js), it offers a modern, responsive user interface and powerful visualization tools to give you insights into your spending habits.

## 🚀 Features

- **Transaction Tracking**: Easily add, edit, and delete income and expense transactions.
- **Visual Analytics**: View your financial data with clear and interactive charts using Recharts.
- **Secure Authentication**: User registration and login functionality to keep your data private.
- **Responsive Design**: A seamless experience across desktop and mobile devices, styled with Tailwind CSS.
- **Date Filtering**: Filter your transactions by date to analyze specific periods.

## 🛠️ Tech Stack

### Frontend
- **React**: UI library for building the interface.
- **Vite**: Next-generation frontend tooling for fast development.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Recharts**: Composable charting library for React.
- **Axios**: Promise-based HTTP client for API requests.
- **Lucide React**: Beautiful & consistent icons.

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing data.
- **Mongoose**: ODM library for MongoDB and Node.js.

## 📦 Installation & Setup

### Prerequisites
- Node.js installed.
- MongoDB instance (local or Atlas).

### 1. Clone the Repository
```bash
git clone https://github.com/s1ub1am/FinTrack.git
cd FinTrack
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory with the following variables:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```
Start the server:
```bash
npm start
```

### 3. Frontend Setup
Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
```
Start the development server:
```bash
npm run dev
```

## 🚀 Deployment

The application is designed to be deployed with ease:
- **Frontend**: Configured for deployment on GitHub Pages.
- **Backend**: optimized for platforms like Railway or Render.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.
