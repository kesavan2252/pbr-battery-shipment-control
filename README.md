
# PBR Battery Management System

A full-stack application for managing battery contracts and shipments with real-time monitoring.

## Features
- Contract lifecycle management (creation, locking, tracking)
- Shipment progress monitoring with threshold alerts
- Real-time updates via WebSocket
- Role-based access control (Admin/User)
- Responsive UI with dark/light mode
- Secure JWT authentication

## Tech Stack
**Frontend:**
- React 18
- Tailwind CSS
- Redux Toolkit
- Axios
- Socket.IO Client

**Backend:**
- Node.js 20
- Express 4
- MongoDB/Mongoose
- JSON Web Tokens
- Socket.IO
- Nodemailer

## Installation
1. Clone repository:
```bash
git clone https://github.com/<your-username>/prb-battery-management.git
```

2. **Backend Setup:**
```bash
cd pbr-battery-backend
npm install

# Create .env file with:
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pbr-system
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

3. **Frontend Setup:**
```bash
cd ..\pbr-battery-frontend
npm install

# Create .env.development file with:
VITE_API_URL=http://localhost:5000
```

4. Start both servers:
```bash
# In backend directory
npm start

# In frontend directory
npm run dev
```

## Directory Structure
```
pbr-battery-management/
├── pbr-battery-backend/     # Node.js API
│   ├── controllers/        # Business logic
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   └── utils/              # Helpers and middleware
└── pbr-battery-frontend/   # React Application
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── hooks/          # Custom hooks
    │   ├── pages/          # Application views
    │   └── services/       # API clients
```

## Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for token signing | Yes |
| `VITE_API_URL` | Backend API URL | Yes |

## Deployment
[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/new)

## Contributing
1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
MIT License
```

        
