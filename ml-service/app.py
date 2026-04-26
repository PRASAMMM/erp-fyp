"""
EduERP ML Service — FastAPI
Exposes 4 endpoints:
  POST /predict/risk        — At-risk classification
  POST /predict/performance — Final score prediction
  POST /predict/anomaly     — Attendance anomaly detection
  POST /predict/full        — All three at once (used by Spring Boot)
  GET  /                    — Health check
"""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import os

app = FastAPI(title="EduERP ML Service", description="AI prediction endpoints for EduERP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load models safely at startup ───────────────────────────────────────
BASE = os.path.dirname(os.path.abspath(__file__))

scaler = None
clf_risk = None
reg_perf = None
iso_anomaly = None

try:
    scaler       = joblib.load(os.path.join(BASE, 'scaler.pkl'))
    clf_risk     = joblib.load(os.path.join(BASE, 'at_risk_model.pkl'))
    reg_perf     = joblib.load(os.path.join(BASE, 'performance_model.pkl'))
    iso_anomaly  = joblib.load(os.path.join(BASE, 'anomaly_model.pkl'))
    print("✅ All ML models loaded successfully.")
except Exception as e:
    print(f"⚠️ Warning: Failed to load one or more ML models: {e}")
    print("The API will run, but predictions may fail until models are trained.")

FEATURES = ['avg_attendance', 'midterm_score', 'assignment_score',
            'missed_deadlines', 'study_hours_daily', 'subject_count']

# ── Helpers ───────────────────────────────────────────────────────────

def parse_features(data: dict) -> np.ndarray:
    """Extract + scale the 6 model features from request JSON."""
    row = [[
        float(data.get('avg_attendance',    75.0)),
        float(data.get('midterm_score',     60.0)),
        float(data.get('assignment_score',  70.0)),
        float(data.get('missed_deadlines',   1.0)),
        float(data.get('study_hours_daily',  3.0)),
        float(data.get('subject_count',      5.0)),
    ]]
    return scaler.transform(row)

def grade_band(score: float) -> str:
    if score >= 80: return 'A'
    if score >= 65: return 'B'
    if score >= 50: return 'C'
    if score >= 40: return 'D'
    return 'F'

def risk_level(prob: float) -> str:
    if prob >= 0.75: return 'HIGH'
    if prob >= 0.45: return 'MEDIUM'
    return 'LOW'

def anomaly_score_from_row(attendance: float, missed: float, midterm: float) -> dict:
    row_att = np.array([[attendance, missed, midterm]])
    # Use the raw isolation forest decision function
    score = iso_anomaly.decision_function(row_att)[0]
    label = iso_anomaly.predict(row_att)[0]
    return {
        'is_anomaly':   bool(label == -1),
        'anomaly_score': round(float(score), 4),  # more negative = more anomalous
    }


# ── Routes ────────────────────────────────────────────────────────────

@app.get("/")
def home():
    return {"status": "ML service running"}

@app.get("/health")
def health():
    return {
        'status':  'UP',
        'service': 'EduERP ML Service',
        'models':  ['at_risk_model', 'performance_model', 'anomaly_model'],
        'version': '1.0.0',
    }

@app.post("/predict/risk")
async def predict_risk(request: Request):
    """
    Classify a student as at-risk or on-track.
    Input:  { avg_attendance, midterm_score, assignment_score, missed_deadlines, study_hours_daily, subject_count }
    Output: { is_at_risk, risk_level, confidence, label }
    """
    if clf_risk is None or scaler is None:
        return JSONResponse(status_code=503, content={'error': 'Models not loaded on server. Please retrain models.'})

    try:
        data  = await request.json()
        X     = parse_features(data)
        pred  = clf_risk.predict(X)[0]
        proba = clf_risk.predict_proba(X)[0]
        prob_at_risk = float(proba[1])

        return {
            'is_at_risk':  bool(pred == 1),
            'risk_level':  risk_level(prob_at_risk),
            'confidence':  round(float(max(proba)) * 100, 1),
            'label':       'AT RISK' if pred == 1 else 'ON TRACK',
            'probability': round(prob_at_risk, 3),
        }
    except Exception as e:
        return JSONResponse(status_code=400, content={'error': str(e)})


@app.post("/predict/performance")
async def predict_performance(request: Request):
    """
    Predict a student's final exam score.
    Input:  { avg_attendance, midterm_score, assignment_score, missed_deadlines, study_hours_daily, subject_count }
    Output: { predicted_score, grade, interpretation }
    """
    if reg_perf is None or scaler is None:
        return JSONResponse(status_code=503, content={'error': 'Models not loaded on server. Please retrain models.'})

    try:
        data  = await request.json()
        X     = parse_features(data)
        score = float(reg_perf.predict(X)[0])
        score = round(min(max(score, 0), 100), 1)
        grade = grade_band(score)

        interp_map = {
            'A': 'Excellent — student is performing very well.',
            'B': 'Good — student is on track to pass comfortably.',
            'C': 'Average — student may need some guidance.',
            'D': 'Below average — at risk of failing. Intervention advised.',
            'F': 'Critical — student is likely to fail. Urgent intervention needed.',
        }
        return {
            'predicted_score': score,
            'grade':           grade,
            'interpretation':  interp_map[grade],
            'pass':            score >= 40,
        }
    except Exception as e:
        return JSONResponse(status_code=400, content={'error': str(e)})


@app.post("/predict/anomaly")
async def predict_anomaly(request: Request):
    """
    Detect unusual attendance patterns.
    Input:  { avg_attendance, missed_deadlines, midterm_score }
    Output: { is_anomaly, anomaly_score, message }
    """
    if iso_anomaly is None or scaler is None:
        return JSONResponse(status_code=503, content={'error': 'Models not loaded on server. Please retrain models.'})

    try:
        data       = await request.json()
        attendance = float(data.get('avg_attendance',    75.0))
        missed     = float(data.get('missed_deadlines',   1.0))
        midterm    = float(data.get('midterm_score',     60.0))
        result     = anomaly_score_from_row(attendance, missed, midterm)
        result['message'] = (
            'Unusual attendance pattern detected — faculty review recommended.'
            if result['is_anomaly']
            else 'Attendance pattern appears normal.'
        )
        return result
    except Exception as e:
        return JSONResponse(status_code=400, content={'error': str(e)})


@app.post("/predict/full")
async def predict_full(request: Request):
    """
    Run all three models and return a combined prediction object.
    This is the single endpoint called by Spring Boot.
    """
    if None in (clf_risk, reg_perf, iso_anomaly, scaler):
        return JSONResponse(status_code=503, content={
            'error': 'ML models are missing or incompatible. Please wait for training.'
        })

    try:
        data = await request.json()
        X    = parse_features(data)

        # Model 1 — At-risk
        pred_risk  = clf_risk.predict(X)[0]
        proba      = clf_risk.predict_proba(X)[0]
        prob_risk  = float(proba[1])

        # Model 2 — Performance
        pred_score = float(reg_perf.predict(X)[0])
        pred_score = round(min(max(pred_score, 0), 100), 1)

        # Model 3 — Anomaly
        attendance = float(data.get('avg_attendance', 75.0))
        missed     = float(data.get('missed_deadlines', 1.0))
        midterm    = float(data.get('midterm_score', 60.0))
        anom       = anomaly_score_from_row(attendance, missed, midterm)

        return {
            'risk': {
                'is_at_risk':  bool(pred_risk == 1),
                'risk_level':  risk_level(prob_risk),
                'confidence':  round(float(max(proba)) * 100, 1),
                'label':       'AT RISK' if pred_risk == 1 else 'ON TRACK',
                'probability': round(prob_risk, 3),
            },
            'performance': {
                'predicted_score': pred_score,
                'grade':           grade_band(pred_score),
                'pass':            pred_score >= 40,
                'interpretation':  (
                    'Performing well' if pred_score >= 65 else
                    'Needs improvement' if pred_score >= 40 else
                    'Critical — failing likely'
                ),
            },
            'anomaly': anom,
            'summary': (
                f"Predicted score: {pred_score}/100 | "
                f"Risk: {risk_level(prob_risk)} | "
                f"Grade: {grade_band(pred_score)} | "
                f"Anomaly: {'Yes' if anom['is_anomaly'] else 'No'}"
            ),
        }
    except Exception as e:
        return JSONResponse(status_code=400, content={'error': str(e)})

if __name__ == '__main__':
    import uvicorn
    port = int(os.environ.get('PORT', 5001))
    print(f"Starting EduERP ML Service on port {port}")
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=False)
