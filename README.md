# Skill Enhancement Companion

A comprehensive application to help users analyze their skills, find skill gaps, discover trending technologies, and get course recommendations to enhance their career prospects.

## 🚀 Features

- **Skill Gap Analysis**: Analyze your current skills against job market requirements
- **Career Trend Analysis**: Discover trending skills in your industry or role
- **Course Recommendations**: Get personalized course suggestions to close skill gaps
- **Resume Analysis**: Upload your resume for automated skill extraction and analysis
- **User Profiles**: Track your progress and manage your skill development journey

## 🧰 Tech Stack

### Frontend
- React 18
- Redux Toolkit for state management
- Material UI for UI components
- Chart.js for data visualization
- Formik & Yup for form validation
- Firebase Authentication

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Mongoose for data modeling
- Express-validator for input validation

### ML Services
- Python with FastAPI
- TensorFlow/PyTorch for NLP models
- Scikit-learn for data processing
- NLTK and Spacy for text analysis

## 📋 Prerequisites

- Node.js v20.x
- npm v10.x
- MongoDB (local or Atlas)
- Python 3.10+
- (Optional) Firebase project for authentication

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/skill-companion.git
cd skill-companion
```

### 2. Set up environment variables

Create `.env` files in both frontend and backend directories.

Example frontend `.env`:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
```

Example backend `.env`:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/skill-companion
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

### 3. Install dependencies

```bash
# Install root dependencies
npm install

# This will also install frontend and backend dependencies
```

### 4. Set up ML environment (optional)

```bash
cd ml
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 5. Run development servers

```bash
# Run frontend and backend concurrently
npm run dev

# Or run them separately
npm run dev:frontend
npm run dev:backend
```

## 📦 Folder Structure

```
skill-companion/
├── frontend/                # React frontend application
│   ├── public/              # Static files
│   └── src/                 # Source code
│       ├── components/      # Reusable UI components
│       ├── layouts/         # Layout components
│       ├── pages/           # Page components
│       ├── services/        # API services
│       ├── store/           # Redux store
│       └── hooks/           # Custom React hooks
├── backend/                 # Node.js backend API
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── scripts/             # Utility scripts
│   └── services/            # Business logic
└── ml/                      # Python ML services
    ├── data/                # Data processing
    ├── models/              # ML models
    └── utils/               # Utility functions
```

## 📚 API Documentation

API documentation is available at:
- Development: http://localhost:5000/api/docs
- Production: https://your-api-url.com/api/docs

## 🧪 Testing

```bash
# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend

# Run all tests
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/skill-companion](https://github.com/yourusername/skill-companion)