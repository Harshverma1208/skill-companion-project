# Skill Companion Application

A comprehensive skill analysis and career development platform that helps users track their professional growth, identify skill gaps, and get personalized recommendations.

## Project Structure

```
skill-companion/
├── frontend/          # React frontend application
├── backend/          # Python backend API
└── ml/              # Machine learning components
```

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- npm or yarn
- pip (Python package manager)

## Installation

### 1. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install

# Required packages for the frontend
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install react-router-dom
npm install recharts
npm install @mui/x-date-pickers date-fns
```

### 2. Backend Setup

Navigate to the backend directory and set up a Python virtual environment:

```bash
cd backend

# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate

# Install required packages
pip install -r requirements.txt
```

### 3. ML Components Setup

Navigate to the ml directory and install required packages:

```bash
cd ml

# Install required packages
pip install pandas numpy scikit-learn nltk networkx beautifulsoup4 requests
```

## Running the Application

### 1. Start the Frontend (Development)

```bash
cd frontend
npm start
```
The frontend will be available at `http://localhost:3000`

To run on a different port:
```bash
# Windows PowerShell
$env:PORT=3001; npm start

# Linux/Mac
PORT=3001 npm start
```

### 2. Start the Backend Server

```bash
cd backend
.\venv\Scripts\activate
python app.py
```
The API will be available at `