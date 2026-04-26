// ─────────────────────────────────────────────────────────────────────────────
// src/services/api.js
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getHeaders = () => {
  const token = localStorage.getItem('erp_token') || localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `Server error ${res.status}` }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const login = (data) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const register = (data) =>
  fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

// ── USERS ─────────────────────────────────────────────────────────────────────
export const getUsers = () =>
  fetch(`${BASE_URL}/users`, { headers: getHeaders() }).then(handleResponse);

export const getUserById = (id) =>
  fetch(`${BASE_URL}/users/${id}`, { headers: getHeaders() }).then(handleResponse);

export const updateUser = (id, data) =>
  fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteUser = (id) =>
  fetch(`${BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse);

export const getStudents = () =>
  fetch(`${BASE_URL}/users/students`, { headers: getHeaders() }).then(handleResponse);

export const getFaculty = () =>
  fetch(`${BASE_URL}/users/faculty`, { headers: getHeaders() }).then(handleResponse);

export const getFacultyStudents = (facultyId, subjectId = null) => {
  const url = subjectId 
    ? `${BASE_URL}/users/faculty/${facultyId}/students?subjectId=${subjectId}`
    : `${BASE_URL}/users/faculty/${facultyId}/students`;
  return fetch(url, { headers: getHeaders() }).then(handleResponse);
};

export const getStudentByRegNo = (regNo) =>
  fetch(`${BASE_URL}/users/student/reg/${encodeURIComponent(regNo)}`, {
    headers: getHeaders(),
  }).then(handleResponse);

// ── SUBJECTS ──────────────────────────────────────────────────────────────────
export const getAllSubjects = () =>
  fetch(`${BASE_URL}/subjects`, { headers: getHeaders() }).then(handleResponse);

export const getSubjectById = (id) =>
  fetch(`${BASE_URL}/subjects/${id}`, { headers: getHeaders() }).then(handleResponse);

// Get subjects for the logged-in user (faculty → subjects they teach, student → enrolled)
export const getMySubjects = (userId, role) =>
  fetch(`${BASE_URL}/subjects/my?userId=${userId}&role=${role}`, {
    headers: getHeaders(),
  }).then(handleResponse);

export const createSubject = (data) =>
  fetch(`${BASE_URL}/subjects`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateSubject = (id, data) =>
  fetch(`${BASE_URL}/subjects/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

// Admin sets the full enrolled student list for a subject
export const setSubjectStudents = (subjectId, studentIds) =>
  fetch(`${BASE_URL}/subjects/${subjectId}/students`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ studentIds }),
  }).then(handleResponse);

export const deleteSubject = (id) =>
  fetch(`${BASE_URL}/subjects/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse);

// ── MARKS ─────────────────────────────────────────────────────────────────────
export const getAllMarks = () =>
  fetch(`${BASE_URL}/marks`, { headers: getHeaders() }).then(handleResponse);

export const getMarksByStudent = (studentId) =>
  fetch(`${BASE_URL}/marks/student/${studentId}`, { headers: getHeaders() }).then(handleResponse);

export const getMarksBySubject = (subjectId) =>
  fetch(`${BASE_URL}/marks/subject/${subjectId}`, { headers: getHeaders() }).then(handleResponse);

export const assignMarks = (data) =>
  fetch(`${BASE_URL}/marks`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateMarks = (id, data) =>
  fetch(`${BASE_URL}/marks/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteMarks = (id) =>
  fetch(`${BASE_URL}/marks/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse);

// ── ATTENDANCE ────────────────────────────────────────────────────────────────
export const getAllAttendance = () =>
  fetch(`${BASE_URL}/attendance`, { headers: getHeaders() }).then(handleResponse);

export const getAttendanceByStudent = (studentId) =>
  fetch(`${BASE_URL}/attendance/student/${studentId}`, {
    headers: getHeaders(),
  }).then(handleResponse);

export const getAttendanceBySubject = (subjectId) =>
  fetch(`${BASE_URL}/attendance/subject/${subjectId}`, {
    headers: getHeaders(),
  }).then(handleResponse);

export const markAttendance = (data) =>
  fetch(`${BASE_URL}/attendance`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateAttendance = (id, data) =>
  fetch(`${BASE_URL}/attendance/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteAttendance = (id) =>
  fetch(`${BASE_URL}/attendance/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse);

// ── ASSIGNMENTS ───────────────────────────────────────────────────────────────
export const getAllAssignments = () =>
  fetch(`${BASE_URL}/assignments`, { headers: getHeaders() }).then(handleResponse);

export const getAssignmentsByStudent = (studentId) =>
  fetch(`${BASE_URL}/assignments/student/${studentId}`, {
    headers: getHeaders(),
  }).then(handleResponse);

export const getAssignmentsBySubject = (subjectId) =>
  fetch(`${BASE_URL}/assignments/subject/${subjectId}`, {
    headers: getHeaders(),
  }).then(handleResponse);

export const createAssignment = (data) =>
  fetch(`${BASE_URL}/assignments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateAssignment = (id, data) =>
  fetch(`${BASE_URL}/assignments/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteAssignment = (id) =>
  fetch(`${BASE_URL}/assignments/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse);

// ── ANNOUNCEMENTS ─────────────────────────────────────────────────────────────
export const getAnnouncements = () =>
  fetch(`${BASE_URL}/announcements`, { headers: getHeaders() }).then(handleResponse);

export const createAnnouncement = (data) =>
  fetch(`${BASE_URL}/announcements`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteAnnouncement = (id) =>
  fetch(`${BASE_URL}/announcements/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse);

// ── STUDY MATERIALS ───────────────────────────────────────────────────────────
export const getAllMaterials = () =>
  fetch(`${BASE_URL}/materials`, { headers: getHeaders() }).then(handleResponse);

export const getMaterialsByDept = (dept) =>
  fetch(`${BASE_URL}/materials/department/${encodeURIComponent(dept)}`, {
    headers: getHeaders(),
  }).then(handleResponse);

export const getMaterialsByFaculty = (facultyId) =>
  fetch(`${BASE_URL}/materials/faculty/${facultyId}`, {
    headers: getHeaders(),
  }).then(handleResponse);

export const uploadMaterial = (data) =>
  fetch(`${BASE_URL}/materials`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteMaterial = (id) =>
  fetch(`${BASE_URL}/materials/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse);

// ── AI ────────────────────────────────────────────────────────────────────────
export const sendAIMessage = async ({ mode = 'chat', message, history = [], username = 'anonymous' }) => {
  const cleanHistory = history
    .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text || m.content || '' }))
    .filter((m) => m.content.trim() !== '');

  const res = await fetch(`${BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ mode, message, history: cleanHistory, username }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `AI request failed (${res.status})`);
  }

  const data = await res.json();
  return { reply: data.response || data.reply || 'No response received' };
};

export const getAIReminders = async (username = 'anonymous') => {
  const res = await fetch(`${BASE_URL}/ai/reminders?username=${encodeURIComponent(username)}`, {
    headers: getHeaders(),
  });
  if (!res.ok) return [];
  return res.json();
};

export const getAIStatus = async () => {
  const res = await fetch(`${BASE_URL}/ai/status`);
  if (!res.ok) return { status: 'DOWN' };
  return res.json();
};

// Aliases
export const getStudentMarks = getMarksByStudent;
export const getStudentAttendance = getAttendanceByStudent;
export const getStudentAssignments = getAssignmentsByStudent;

// ── ML INTEGRATION ────────────────────────────────────────────────────────────
export const getStudentPrediction = async (studentId) => {
  return fetch(`${BASE_URL}/ml/predict/${studentId}`, { headers: getHeaders() }).then(handleResponse);
};

export const getPredictionManual = async (features) => {
  return fetch(`${BASE_URL}/ml/predict`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(features),
  }).then(handleResponse);
};

export const getAtRiskStudents = async (facultyId = null) => {
  const url = facultyId 
    ? `${BASE_URL}/ml/at-risk?facultyId=${facultyId}`
    : `${BASE_URL}/ml/at-risk`;
  return fetch(url, { headers: getHeaders() }).then(handleResponse);
};

export const checkMLHealth = async () => {
  return fetch(`${BASE_URL}/ml/health`, { headers: getHeaders() }).then(handleResponse);
};
