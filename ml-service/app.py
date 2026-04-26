"""
EduERP ML Service — Flask API
Exposes 4 endpoints:
  POST /predict/risk        — At-risk classification
  POST /predict/performance — Final score prediction
  POST /predict/anomaly     — Attendance anomaly detection
  POST /predict/full        — All three at once (used by Spring Boot)
  GET  /health              — Health check
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# ── Load models once at startup ───────────────────────────────────────
BASE = os.path.dirname(os.path.abspath(__file__))

scaler       = joblib.load(os.path.join(BASE, 'scaler.pkl'))
clf_risk     = joblib.load(os.path.join(BASE, 'at_risk_model.pkl'))
reg_perf     = joblib.load(os.path.join(BASE, 'performance_model.pkl'))
iso_anomaly  = joblib.load(os.path.join(BASE, 'anomaly_model.pkl'))

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
    from sklearn.preprocessing import StandardScaler as SS
    # Use the raw isolation forest decision function
    score = iso_anomaly.decision_function(row_att)[0]
    label = iso_anomaly.predict(row_att)[0]
    return {
        'is_anomaly':   bool(label == -1),
        'anomaly_score': round(float(score), 4),  # more negative = more anomalous
    }


# ── Routes ────────────────────────────────────────────────────────────

@app.route('/health')
def health():
    return jsonify({
        'status':  'UP',
        'service': 'EduERP ML Service',
        'models':  ['at_risk_model', 'performance_model', 'anomaly_model'],
        'version': '1.0.0',
    })


@app.route('/predict/risk', methods=['POST'])
def predict_risk():
    """
    Classify a student as at-risk or on-track.
    Input:  { avg_attendance, midterm_score, assignment_score,
              missed_deadlines, study_hours_daily, subject_count }
    Output: { is_at_risk, risk_level, confidence, label }
    """
    try:
        data  = request.get_json(force=True)
        X     = parse_features(data)
        pred  = clf_risk.predict(X)[0]
        proba = clf_risk.predict_proba(X)[0]
        prob_at_risk = float(proba[1])

        return jsonify({
            'is_at_risk':  bool(pred == 1),
            'risk_level':  risk_level(prob_at_risk),
            'confidence':  round(float(max(proba)) * 100, 1),
            'label':       'AT RISK' if pred == 1 else 'ON TRACK',
            'probability': round(prob_at_risk, 3),
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/predict/performance', methods=['POST'])
def predict_performance():
    """
    Predict a student's final exam score.
    Input:  { avg_attendance, midterm_score, assignment_score,
              missed_deadlines, study_hours_daily, subject_count }
    Output: { predicted_score, grade, interpretation }
    """
    try:
        data  = request.get_json(force=True)
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
        return jsonify({
            'predicted_score': score,
            'grade':           grade,
            'interpretation':  interp_map[grade],
            'pass':            score >= 40,
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/predict/anomaly', methods=['POST'])
def predict_anomaly():
    """
    Detect unusual attendance patterns.
    Input:  { avg_attendance, missed_deadlines, midterm_score }
    Output: { is_anomaly, anomaly_score, message }
    """
    try:
        data       = request.get_json(force=True)
        attendance = float(data.get('avg_attendance',    75.0))
        missed     = float(data.get('missed_deadlines',   1.0))
        midterm    = float(data.get('midterm_score',     60.0))
        result     = anomaly_score_from_row(attendance, missed, midterm)
        result['message'] = (
            'Unusual attendance pattern detected — faculty review recommended.'
            if result['is_anomaly']
            else 'Attendance pattern appears normal.'
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/predict/full', methods=['POST'])
def predict_full():
    """
    Run all three models and return a combined prediction object.
    This is the single endpoint called by Spring Boot.
    """
    try:
        data = request.get_json(force=True)
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

        return jsonify({
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
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print("=" * 50)
    print(f"  EduERP ML Service starting on port {port}")
    print("  Endpoints:")
    print("    GET  /health")
    print("    POST /predict/risk")
    print("    POST /predict/performance")
    print("    POST /predict/anomaly")
    print("    POST /predict/full     ← Spring Boot uses this")
    print("=" * 50)
    app.run(host='0.0.0.0', port=port, debug=False)
