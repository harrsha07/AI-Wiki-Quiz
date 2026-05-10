# AI Wiki Quiz Generator - Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 16 or higher)
- **Python** (version 3.8 or higher)
- **npm** (comes with Node.js)
- **Git** for version control

## 🛠️ Development Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-wiki-quiz
```

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000` (or the next available port).

### 3. Backend Setup

Open a new terminal window and navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

### 4. API Key Configuration

Create a `.env` file in the backend directory:
```bash
touch .env
```

Add your Google Gemini API key to the `.env` file:
```
GEMINI_API_KEY=your_actual_api_key_here
```

You can obtain a Google Gemini API key from the [Google AI Studio](https://aistudio.google.com/).

### 5. Start the Backend Server

With the virtual environment activated:
```bash
python main.py
```

The backend will be available at `http://localhost:8000`.

## 🏗️ Project Structure

```
ai-wiki-quiz/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts (ThemeContext)
│   │   ├── services/       # API services
│   │   ├── tabs/           # Tab components
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Application entry point
│   ├── public/             # Static assets
│   ├── index.html          # HTML template
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   ├── postcss.config.js   # PostCSS configuration
│   └── vite.config.js      # Vite configuration
├── backend/
│   ├── controllers/        # Business logic
│   ├── models/             # Data models and schemas
│   ├── routes/             # API route definitions
│   ├── utils/              # Utility functions
│   ├── main.py             # FastAPI application entry point
│   ├── scraper.py          # Wikipedia scraping functionality
│   ├── llm_quiz_generator.py # AI quiz generation
│   ├── database.py         # Database setup
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── README.md              # Project overview
├── SETUP.md               # This setup guide
└── LICENSE                # License information
```

## 🧪 Development Workflow

### Frontend Development

1. **Component Development**: Create new components in `frontend/src/components/`
2. **State Management**: Use React hooks for local state, ThemeContext for theme management
3. **API Integration**: Use the service layer in `frontend/src/services/`
4. **Styling**: Use Tailwind CSS classes with daisyUI components

### Backend Development

1. **Route Creation**: Add new routes in `backend/routes/`
2. **Business Logic**: Implement controllers in `backend/controllers/`
3. **Data Models**: Define models in `backend/models/`
4. **Utilities**: Add helper functions in `backend/utils/`

### Database Schema

The application uses SQLite with SQLAlchemy ORM. The database schema includes:
- **Quiz table**: Stores generated quizzes with metadata

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
GEMINI_API_KEY=your_google_gemini_api_key
```

### Tailwind Configuration

Custom themes are defined in `frontend/tailwind.config.js`:
- **bright**: Light theme
- **darkmagic**: Dark theme

### API Endpoints

Base URL: `http://localhost:8000/api`

- `POST /generate_quiz` - Generate quiz from Wikipedia URL
- `GET /history` - Get quiz history
- `GET /quiz/{id}` - Get specific quiz by ID

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Frontend: Vite will automatically use the next available port if 3000 is taken
   - Backend: Change the port in `main.py` if 8000 is taken

2. **API Key Issues**
   - Ensure your Google Gemini API key is valid and has proper permissions
   - Check that the `.env` file is in the correct location

3. **Dependency Installation**
   - If you encounter issues with `pip install`, try upgrading pip first:
     ```bash
     pip install --upgrade pip
     ```

4. **Python Virtual Environment**
   - Make sure the virtual environment is activated before running the backend
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

### Development Tools

1. **Code Editor**: VS Code with extensions:
   - ES7+ React/Redux/React-Native snippets
   - Python
   - Tailwind CSS IntelliSense
   - Prettier

2. **Browser Development Tools**:
   - React Developer Tools
   - Redux DevTools (if using Redux in the future)

## 📈 Performance Optimization

### Frontend
- **Bundle Analysis**: Use `npm run build` to analyze bundle size
- **Image Optimization**: Use modern image formats and lazy loading
- **Code Splitting**: Implement dynamic imports for large components

### Backend
- **Database Indexing**: Ensure proper indexing on frequently queried fields
- **Caching**: Implement caching for frequently accessed data
- **Connection Pooling**: Use connection pooling for database connections

## 🔒 Security Best Practices

### Frontend
- **Input Validation**: Always validate user inputs
- **API Error Handling**: Properly handle API errors without exposing sensitive information
- **Content Security Policy**: Implement CSP headers

### Backend
- **Input Sanitization**: Sanitize all user inputs
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **Authentication**: Add authentication for protected endpoints (future enhancement)
- **HTTPS**: Use HTTPS in production

## 🚀 Production Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your web server
```

### Backend Deployment
```bash
cd backend
# Install production dependencies
pip install -r requirements.txt
# Use a production WSGI server like Gunicorn
```

### Environment Configuration
- Set proper CORS origins
- Configure database connections for production
- Set up reverse proxy (Nginx/Apache)
- Enable HTTPS with SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📞 Support

For support, please open an issue on the GitHub repository or contact the maintainers.