# Skill Companion Application

A comprehensive career development platform that helps professionals track their skills, identify gaps, analyze job market trends, and get personalized learning recommendations.

## Features

- 🎯 **Skill Gap Analysis**: Advanced analysis of your current skills against market demands
- 📊 **Job Market Trends**: Real-time insights into industry requirements and emerging skills
- 📝 **Resume Analysis**: AI-powered resume evaluation and improvement suggestions
- 📚 **Course Recommendations**: Personalized learning paths based on your skill gaps
- 👤 **Professional Profile**: Comprehensive profile management with skill tracking
- 📈 **Career Progress Tracking**: Monitor your professional development over time

## Tech Stack

### Frontend
- React.js with Material-UI
- Redux for state management
- Recharts for data visualization
- React Router for navigation
- Material UI Date Pickers
- Emotion for styled components

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Helmet for security
- Morgan for logging
- Express Rate Limit for API protection

### ML Components
- Python
- Pandas & NumPy for data processing
- Scikit-learn for ML models
- NLTK for text processing
- BeautifulSoup4 for web scraping
- Custom recommendation algorithms

## Project Structure

```
skill-companion/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── services/      # API integration services
│   │   ├── hooks/        # Custom React hooks
│   │   └── store/        # Redux store configuration
├── backend/               # Node.js backend API
│   ├── controllers/      # Request handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/         # API routes
│   ├── middleware/    # Custom middleware
│   └── services/     # Business logic
└── ml/              # Machine learning components
    ├── data/       # Training and analysis data
    ├── utils/     # ML utilities
    └── models/   # ML model implementations
```

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB
- npm or yarn
- pip (Python package manager)

## Installation

### 1. Frontend Setup

```bash
cd frontend
npm install
```

Key frontend dependencies:
- @mui/material @emotion/react @emotion/styled
- @mui/icons-material
- react-router-dom
- recharts
- @mui/x-date-pickers

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a .env file in the backend directory with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

### 3. ML Components Setup

```bash
cd ml
pip install -r requirements.txt
```

## Running the Application

### Start the Frontend

```bash
cd frontend
npm start
```
Access the application at `http://localhost:3000`

### Start the Backend Server

```bash
cd backend
npm start
```
API will be available at `http://localhost:5001`

### Start ML Services

```bash
cd ml
python -m uvicorn main:app --reload
```

## API Documentation

The backend provides the following main endpoints:

- `/api/user` - User profile management
- `/api/skills` - Skill analysis and tracking
- `/api/courses` - Course recommendations
- `/api/jobs` - Job market analysis
- `/api/resume` - Resume analysis and optimization

## Security Features

- JWT authentication
- API rate limiting
- Helmet security headers
- MongoDB injection protection
- CORS configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the component library
- MongoDB for the database solution
- Python scientific computing community
- Open-source ML model contributors