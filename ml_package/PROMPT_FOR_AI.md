# Context
I have a full-stack college ERP system:
- **Frontend**: React + Vite at `ai-erp-frontend/`
- **Backend**: Spring Boot (Java) at `erp-backend/`
- **New ML service**: Flask (Python) that runs on port 5000

I have built 3 ML models (Random Forest classifier, regressor, Isolation Forest) that predict student academic risk. I need you to integrate the provided files into my existing codebase exactly as described below.

---

# Files I am giving you

## Python (goes in a new `ml-service/` folder at the root of my project)
- `python/train_models.py` — trains all 3 models, saves .pkl files
- `python/app.py` — Flask REST API serving predictions on port 5000
- `python/requirements.txt` — Python dependencies

## Java (goes into erp-backend Spring Boot)
- `java/MLService.java` → copy to `erp-backend/src/main/java/com/erp/erp_backend/service/MLService.java`
- `java/MLPredictionController.java` → copy to `erp-backend/src/main/java/com/erp/erp_backend/controller/MLPredictionController.java`

## React (goes into ai-erp-frontend)
- `react/MLPredictionCard.jsx` → copy to `ai-erp-frontend/src/components/MLPredictionCard.jsx`
- `react/AtRiskDashboard.jsx` → copy to `ai-erp-frontend/src/components/AtRiskDashboard.jsx`
- `react/mlApi.js` → **do not replace api.js** — paste all exported functions at the bottom of `ai-erp-frontend/src/services/api.js`

---

# Changes needed in existing files

## 1. `erp-backend/src/main/resources/application.properties`
Add this one line at the bottom:
```
ml.service.url=http://localhost:5000
```

## 2. `ai-erp-frontend/src/pages/student/StudentDashboard.jsx`
Add import at top (after existing imports):
```jsx
import MLPredictionCard from '../../components/MLPredictionCard';
```
In the JSX RIGHT COLUMN section, add BEFORE `<AIRecommendations />`:
```jsx
<MLPredictionCard studentId={user?.id || user?._id} />
```

## 3. `ai-erp-frontend/src/pages/admin/AdminDashboard.jsx`
Add import at top:
```jsx
import AtRiskDashboard from '../../components/AtRiskDashboard';
```
Add just before the closing `</Layout>` tag:
```jsx
<AtRiskDashboard />
```

## 4. `ai-erp-frontend/src/pages/faculty/FacultyDashboard.jsx`
Same as AdminDashboard — same import + same `<AtRiskDashboard />` before `</Layout>`.

---

# How to run after integration
Open 3 terminal tabs simultaneously:
```bash
# Tab 1 — Flask ML service (must stay running)
cd ml-service && pip3 install -r requirements.txt && python3 train_models.py && python3 app.py

# Tab 2 — Spring Boot
cd erp-backend && ./mvnw spring-boot:run

# Tab 3 — React
cd ai-erp-frontend && npm run dev
```

---

# What this adds to the app
- **Student Dashboard**: Shows an AI Prediction card with predicted final score, risk level (HIGH/MEDIUM/LOW), grade, and confidence %
- **Admin Dashboard**: Shows an At-Risk Student Detection panel listing all at-risk students with badges
- **Faculty Dashboard**: Same At-Risk panel as Admin
- **New API endpoints** on Spring Boot:
  - `GET /api/ml/health` — check Flask status
  - `GET /api/ml/predict/{studentId}` — predict for a student
  - `GET /api/ml/at-risk` — list all at-risk students
