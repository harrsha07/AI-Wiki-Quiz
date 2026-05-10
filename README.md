# AI Wiki Quiz Generator
Transform Wikipedia articles into engaging quizzes using AI.

https://ai-wiki-quiz-1.onrender.com/

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.121+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

## 🌟 Features

- **AI-Powered Quiz Generation**: Automatically creates quizzes from any Wikipedia article using Google Gemini AI
- **Multiple Difficulty Levels**: Choose from Easy, Medium, or Hard difficulty settings
- **Topic Filtering**: Focus quizzes on specific topics (AI, Science, History, Technology, Mathematics)
- **Quiz History**: Track and revisit previously generated quizzes
- **Performance Analytics**: View detailed statistics and performance metrics
- **Leaderboard**: Compete with others on a global leaderboard
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between bright and darkmagic themes with system preference detection
- **Interactive UI**: Smooth animations and transitions powered by Framer Motion
- **Educational Insights**: Get article summaries, key entities, and related topics

## 📋 Prerequisites

- **Python** (version 3.8 or higher)
- **npm** (comes with Node.js)
- **Google Gemini API Key** (free from [Google AI Studio](https://aistudio.google.com/))

## 🚀 Quick Start

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

Create a `.env` file in the backend directory by copying the example:
```bash
cp .env.example .env
```

Or create it manually:
```bash
touch .env
```

Add your Google Gemini API key to the `.env` file:
```
GEMINI_API_KEY=your_actual_api_key_here
```

**Important Security Note**: Never commit your actual API key to version control. The `.env` file is included in `.gitignore` to prevent accidental exposure.

### 5. Start the Backend Server

With the virtual environment activated:
```bash
python main.py
```

The backend will be available at `http://localhost:8001`.

### 6. Access the Application

1. Make sure both the backend and frontend servers are running
2. Open your browser and go to `http://localhost:3000`
3. Enter a Wikipedia URL to generate a quiz
4. Take the quiz and view your results and statistics

## 🏗️ Project Structure

```
ai-wiki-quiz/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components (QuizDisplay, StatsDashboard, etc.)
│   │   ├── contexts/       # React contexts (ThemeContext)
│   │   ├── services/       # API services
│   │   ├── tabs/           # Tab components (GenerateQuizTab, HistoryTab)
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
│   ├── .env.example        # Example environment variables file
│   └── .env               # Your environment variables (not committed)
├── sample_data/            # Sample Wikipedia articles and quiz outputs
├── screenshots/            # Application screenshots
├── README.md              # Project overview (this file)
├── SETUP.md               # Detailed setup guide
└── LICENSE                # License information
```

## 🔄 API Endpoints

Base URL: `http://localhost:8001/api`

- `POST /generate_quiz` - Generate quiz from Wikipedia URL
- `GET /history` - Get quiz history
- `GET /quiz/{id}` - Get specific quiz by ID

## 🎨 Technologies Used

### Frontend
- **React 18+** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **daisyUI** - Tailwind CSS component library
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **LangChain** - Framework for developing applications with LLMs
- **Google Gemini** - AI model for quiz generation
- **BeautifulSoup** - Web scraping library
- **SQLite** - Lightweight database

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```
GEMINI_API_KEY=your_google_gemini_api_key
```

### Tailwind Configuration

Custom themes are defined in `frontend/tailwind.config.js`:
- **bright**: Light theme with purple/pink/teal gradients
- **darkmagic**: Dark theme with navy/violet/cyan colors

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Frontend: Vite will automatically use the next available port if 3000 is taken
   - Backend: Change the port in `main.py` if 8001 is taken

2. **API Key Issues**
   - Ensure your Google Gemini API key is valid and has proper permissions
   - Check that the `.env` file is in the correct location (backend directory)

3. **Dependency Installation**
   - If you encounter issues with `pip install`, try upgrading pip first:
     ```bash
     pip install --upgrade pip
     ```

4. **Python Virtual Environment**
   - Make sure the virtual environment is activated before running the backend
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

### Connection Issues

If you see connection errors:
- Verify that the backend server is running on port 8001
- Check that no other process is using port 8001
- Make sure your firewall allows connections on port 8001

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

## 📈 Performance Considerations

- Quiz generation typically takes 20-30 seconds due to LLM processing time
- Clients should implement appropriate timeout settings (minimum 60 seconds)
- Consider asynchronous handling for the /generate_quiz endpoint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini for powering the AI quiz generation
- Wikipedia for providing the educational content

- All the open-source libraries and tools that made this project possible


