# AI-Powered Campus Management System (EICT)

This is a comprehensive, production-ready ERP system with built-in Machine Learning capabilities to predict student performance, detect attendance anomalies, and identify at-risk students. It also features an AI Chatbot for intuitive querying.

## System Architecture

The project consists of three independent, modular microservices:

1. **Frontend (`ai-erp-frontend`)**: Built with React and Vite. Communicates with the Backend API.
2. **Backend API (`erp-backend`)**: Built with Java 17 and Spring Boot. Handles business logic, authentication, connects to MongoDB Atlas, and delegates ML tasks to the ML Service.
3. **ML Service (`ml-service`)**: Built with Python and Flask. Loads pre-trained scikit-learn models (Random Forest, Isolation Forest) to provide predictions via REST API.

**Data Flow:**
`React UI` ↔ `Spring Boot Backend` ↔ `Flask ML Service`

---

## 1. Setup Instructions

Ensure you have the following installed:
- Node.js (v18+)
- Java 17 (JDK)
- Python 3.9+
- Maven (optional, wrapper is included)

### Clone the repository
```bash
git clone <repository-url>
cd <project-root>
```

---

## 2. Environment Variables

Create `.env` files based on the provided `.env.example` templates in each service directory.

### Frontend (`ai-erp-frontend/.env`)
```env
VITE_API_URL=http://localhost:8080/api
```

### Backend (`erp-backend/.env`)
*Note: In local development, you can pass these as system variables or rely on defaults in `application.properties`.*
```env
PORT=8080
MONGO_URI=your_mongodb_atlas_connection_string
ML_SERVICE_URL=http://localhost:5001
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

### ML Service (`ml-service/.env`)
```env
PORT=5001
```

---

## 3. Running Locally

Each service must be run independently.

### A. ML Service (Start this first)
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```
*Runs on `http://localhost:5001`. Health Check: `GET http://localhost:5001/health`*

### B. Backend API
```bash
cd erp-backend
./mvnw clean package
./mvnw spring-boot:run
```
*Runs on `http://localhost:8080`.*

### C. Frontend
```bash
cd ai-erp-frontend
npm install
npm run dev
```
*Runs on `http://localhost:5173`.*

---

## 4. Deployment Readiness

This project is configured to be deployed on modern PaaS providers.

- **Frontend:** Ready for **Vercel** or **Netlify**. Set the `VITE_API_URL` environment variable to your production backend URL. Use the command `npm run build`.
- **Backend:** Ready for **Render** or **Railway**. The application listens to the dynamically assigned `$PORT` environment variable. Set `MONGO_URI`, `ML_SERVICE_URL`, and `GROQ_API_KEY`.
- **ML Service:** Ready for **Render** or **Railway**. Uses Gunicorn (or Flask's development server wrapped in a production script). The app binds to `$PORT` and `0.0.0.0`.

### Health Check Endpoints for Deployment Probes:
- Backend: `GET /api/ml/health`
- ML Service: `GET /health`

---

## 5. Machine Learning Models
Models are pre-trained and saved as `.pkl` files in `ml-service/`. They are loaded into memory *once* at startup to optimize API latency.
- `at_risk_model.pkl`: Random Forest Classifier
- `performance_model.pkl`: Random Forest Regressor
- `anomaly_model.pkl`: Isolation Forest

### Security Note
Secrets (like API keys and Database URIs) MUST NEVER be committed to version control. Always use environment variables for deployment and keep local secrets in a `.env` file that is excluded via `.gitignore`.
