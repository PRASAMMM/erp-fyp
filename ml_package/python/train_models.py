"""
EduERP ML Training Script
Trains 3 models:
  1. At-Risk Classifier       → at_risk_model.pkl
  2. Performance Predictor    → performance_model.pkl
  3. Anomaly Detector         → anomaly_model.pkl
Also saves scaler.pkl and generates evaluation charts.
"""

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import os

from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, IsolationForest
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import (
    classification_report, confusion_matrix,
    mean_absolute_error, r2_score, mean_squared_error
)

np.random.seed(42)
N = 500

# ─────────────────────────────────────────────────────────────────────
# 1. GENERATE SYNTHETIC DATA  (replace with real MongoDB export later)
# ─────────────────────────────────────────────────────────────────────
print("=" * 55)
print("  EduERP ML Training Pipeline")
print("=" * 55)
print("\n[1/5] Generating synthetic student data...")

departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'MBA']
classes     = ['FY', 'SY', 'TY', 'Final Year']

student_ids   = [f"STU{str(i).zfill(4)}" for i in range(N)]
dept_col      = np.random.choice(departments, N)
class_col     = np.random.choice(classes, N)

avg_attendance     = np.clip(np.random.normal(72, 16, N), 30, 100)
midterm_score      = np.clip(np.random.normal(58, 18, N), 0, 100)
assignment_score   = np.clip(np.random.normal(65, 15, N), 0, 100)
missed_deadlines   = np.random.randint(0, 10, N)
study_hours_daily  = np.clip(np.random.normal(3.5, 1.5, N), 0.5, 8)
subject_count      = np.random.randint(4, 7, N)

# Final score is correlated with inputs (realistic relationship)
final_score = (
    0.35 * avg_attendance
    + 0.35 * midterm_score
    + 0.15 * assignment_score
    + 5.0  * study_hours_daily
    - 2.5  * missed_deadlines
    + np.random.normal(0, 6, N)
)
final_score = np.clip(final_score, 0, 100)

# At-risk: attendance < 65 OR midterm < 40 OR final predicted < 40
is_at_risk = (
    (avg_attendance < 65) |
    (midterm_score  < 40) |
    (final_score    < 40)
).astype(int)

df = pd.DataFrame({
    'student_id':       student_ids,
    'department':       dept_col,
    'class':            class_col,
    'avg_attendance':   np.round(avg_attendance, 1),
    'midterm_score':    np.round(midterm_score, 1),
    'assignment_score': np.round(assignment_score, 1),
    'missed_deadlines': missed_deadlines,
    'study_hours_daily':np.round(study_hours_daily, 1),
    'subject_count':    subject_count,
    'final_score':      np.round(final_score, 1),
    'is_at_risk':       is_at_risk,
})

os.makedirs('data', exist_ok=True)
df.to_csv('data/student_data.csv', index=False)
print(f"   Generated {N} student records → data/student_data.csv")
print(f"   At-risk students: {is_at_risk.sum()} ({is_at_risk.mean()*100:.1f}%)")

# ─────────────────────────────────────────────────────────────────────
# 2. FEATURES & PREPROCESSING
# ─────────────────────────────────────────────────────────────────────
print("\n[2/5] Preprocessing features...")

FEATURES = ['avg_attendance', 'midterm_score', 'assignment_score',
            'missed_deadlines', 'study_hours_daily', 'subject_count']

X = df[FEATURES].values
y_risk  = df['is_at_risk'].values
y_score = df['final_score'].values

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
joblib.dump(scaler, 'scaler.pkl')
print("   Scaler saved → scaler.pkl")

# ─────────────────────────────────────────────────────────────────────
# 3. MODEL 1 — AT-RISK CLASSIFIER
# ─────────────────────────────────────────────────────────────────────
print("\n[3/5] Training models...")
print("   [Model 1] At-Risk Classifier (Random Forest)...")

X_tr, X_te, y_tr, y_te = train_test_split(
    X_scaled, y_risk, test_size=0.2, random_state=42, stratify=y_risk)

clf = RandomForestClassifier(n_estimators=150, max_depth=8,
                             min_samples_leaf=3, random_state=42)
clf.fit(X_tr, y_tr)
joblib.dump(clf, 'at_risk_model.pkl')

y_pred_clf = clf.predict(X_te)
acc = (y_pred_clf == y_te).mean()
cv_scores = cross_val_score(clf, X_scaled, y_risk, cv=5, scoring='f1')

print(f"   Accuracy : {acc*100:.1f}%")
print(f"   F1 Score : {cv_scores.mean():.3f} ± {cv_scores.std():.3f} (5-fold CV)")
print(f"   Saved    → at_risk_model.pkl")

# ─────────────────────────────────────────────────────────────────────
# 4. MODEL 2 — PERFORMANCE PREDICTOR
# ─────────────────────────────────────────────────────────────────────
print("\n   [Model 2] Performance Score Predictor (Random Forest Regressor)...")

X_tr2, X_te2, y_tr2, y_te2 = train_test_split(
    X_scaled, y_score, test_size=0.2, random_state=42)

reg = RandomForestRegressor(n_estimators=150, max_depth=8,
                             min_samples_leaf=3, random_state=42)
reg.fit(X_tr2, y_tr2)
joblib.dump(reg, 'performance_model.pkl')

y_pred_reg = reg.predict(X_te2)
mae  = mean_absolute_error(y_te2, y_pred_reg)
r2   = r2_score(y_te2, y_pred_reg)
rmse = mean_squared_error(y_te2, y_pred_reg) ** 0.5

print(f"   MAE  : {mae:.2f} marks")
print(f"   RMSE : {rmse:.2f} marks")
print(f"   R²   : {r2:.3f}")
print(f"   Saved → performance_model.pkl")

# ─────────────────────────────────────────────────────────────────────
# 5. MODEL 3 — ANOMALY DETECTOR
# ─────────────────────────────────────────────────────────────────────
print("\n   [Model 3] Attendance Anomaly Detector (Isolation Forest)...")

X_att = df[['avg_attendance', 'missed_deadlines', 'midterm_score']].values
X_att_scaled = StandardScaler().fit_transform(X_att)

iso = IsolationForest(contamination=0.1, n_estimators=100, random_state=42)
iso.fit(X_att_scaled)
joblib.dump(iso, 'anomaly_model.pkl')

anomaly_labels = iso.predict(X_att_scaled)
n_anomalies = (anomaly_labels == -1).sum()
print(f"   Flagged {n_anomalies} anomalous attendance records ({n_anomalies/N*100:.1f}%)")
print(f"   Saved  → anomaly_model.pkl")

# ─────────────────────────────────────────────────────────────────────
# 6. EVALUATION CHARTS
# ─────────────────────────────────────────────────────────────────────
print("\n[4/5] Generating evaluation charts...")

os.makedirs('charts', exist_ok=True)

plt.style.use('seaborn-v0_8-whitegrid')
colors = {'blue': '#3B82F6', 'red': '#EF4444', 'green': '#10B981',
          'amber': '#F59E0B', 'gray': '#6B7280'}

# Chart 1 — Feature Importance (Classifier)
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.suptitle('Model Evaluation — EduERP At-Risk Classifier', fontsize=14, fontweight='bold')

imp_clf = pd.Series(clf.feature_importances_, index=FEATURES).sort_values()
bars = axes[0].barh(imp_clf.index, imp_clf.values,
                    color=[colors['blue'] if v > 0.15 else colors['gray'] for v in imp_clf.values])
axes[0].set_title('Feature Importance', fontsize=12)
axes[0].set_xlabel('Importance Score')
for bar, val in zip(bars, imp_clf.values):
    axes[0].text(val + 0.002, bar.get_y() + bar.get_height()/2,
                 f'{val:.3f}', va='center', fontsize=9)

# Chart 2 — Confusion Matrix
cm = confusion_matrix(y_te, y_pred_clf)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=axes[1],
            xticklabels=['On Track', 'At Risk'],
            yticklabels=['On Track', 'At Risk'])
axes[1].set_title('Confusion Matrix', fontsize=12)
axes[1].set_ylabel('Actual')
axes[1].set_xlabel('Predicted')

plt.tight_layout()
plt.savefig('charts/classifier_eval.png', dpi=150, bbox_inches='tight')
plt.close()
print("   Saved → charts/classifier_eval.png")

# Chart 3 — Predicted vs Actual (Regressor)
fig2, axes2 = plt.subplots(1, 2, figsize=(14, 5))
fig2.suptitle('Model Evaluation — EduERP Performance Predictor', fontsize=14, fontweight='bold')

axes2[0].scatter(y_te2, y_pred_reg, alpha=0.4, color=colors['blue'], s=20)
mn, mx = min(y_te2.min(), y_pred_reg.min()), max(y_te2.max(), y_pred_reg.max())
axes2[0].plot([mn, mx], [mn, mx], 'r--', lw=1.5, label='Perfect prediction')
axes2[0].set_xlabel('Actual Final Score')
axes2[0].set_ylabel('Predicted Final Score')
axes2[0].set_title(f'Actual vs Predicted  (R²={r2:.3f})', fontsize=12)
axes2[0].legend(fontsize=9)

imp_reg = pd.Series(reg.feature_importances_, index=FEATURES).sort_values()
axes2[1].barh(imp_reg.index, imp_reg.values,
              color=[colors['green'] if v > 0.2 else colors['gray'] for v in imp_reg.values])
axes2[1].set_title('Feature Importance (Regressor)', fontsize=12)
axes2[1].set_xlabel('Importance Score')

plt.tight_layout()
plt.savefig('charts/regressor_eval.png', dpi=150, bbox_inches='tight')
plt.close()
print("   Saved → charts/regressor_eval.png")

# Chart 4 — Risk Distribution
fig3, axes3 = plt.subplots(1, 2, figsize=(14, 5))
fig3.suptitle('Student Risk Distribution — Training Data', fontsize=14, fontweight='bold')

risk_counts = df['is_at_risk'].value_counts()
axes3[0].pie(risk_counts.values,
             labels=['On Track', 'At Risk'],
             colors=[colors['green'], colors['red']],
             autopct='%1.1f%%', startangle=90,
             wedgeprops={'edgecolor': 'white', 'linewidth': 2})
axes3[0].set_title('Risk Distribution', fontsize=12)

axes3[1].scatter(
    df[df['is_at_risk'] == 0]['avg_attendance'],
    df[df['is_at_risk'] == 0]['midterm_score'],
    alpha=0.3, label='On Track', color=colors['green'], s=15)
axes3[1].scatter(
    df[df['is_at_risk'] == 1]['avg_attendance'],
    df[df['is_at_risk'] == 1]['midterm_score'],
    alpha=0.5, label='At Risk',  color=colors['red'],   s=20, marker='x')
axes3[1].axvline(65,  color=colors['red'],   linestyle='--', alpha=0.4, lw=1, label='75% threshold')
axes3[1].axhline(40,  color=colors['amber'], linestyle='--', alpha=0.4, lw=1, label='Pass mark')
axes3[1].set_xlabel('Attendance %')
axes3[1].set_ylabel('Midterm Score')
axes3[1].set_title('Risk by Attendance vs Midterm', fontsize=12)
axes3[1].legend(fontsize=9)

plt.tight_layout()
plt.savefig('charts/risk_distribution.png', dpi=150, bbox_inches='tight')
plt.close()
print("   Saved → charts/risk_distribution.png")

# ─────────────────────────────────────────────────────────────────────
# 7. SUMMARY
# ─────────────────────────────────────────────────────────────────────
print("\n[5/5] Summary")
print("=" * 55)
print("  Models trained and saved:")
print("    at_risk_model.pkl      — classifier (RF)")
print("    performance_model.pkl  — regressor (RF)")
print("    anomaly_model.pkl      — IsolationForest")
print("    scaler.pkl             — StandardScaler")
print("\n  Evaluation charts:")
print("    charts/classifier_eval.png")
print("    charts/regressor_eval.png")
print("    charts/risk_distribution.png")
print("\n  Key metrics:")
print(f"    At-Risk Classifier Accuracy : {acc*100:.1f}%")
print(f"    Performance Predictor MAE   : {mae:.2f} marks")
print(f"    Performance Predictor R²    : {r2:.3f}")
print(f"    Anomaly Detector Flagged    : {n_anomalies} students")
print("=" * 55)
print("\n  Next step: python app.py   (starts Flask on port 5000)")
print("=" * 55)
