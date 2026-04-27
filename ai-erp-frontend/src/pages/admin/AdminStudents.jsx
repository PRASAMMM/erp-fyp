import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import * as api from '../../services/api';

const DEPT_OPTIONS = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Economics'];
const CLASS_OPTIONS = ['FY', 'SY', 'TY', 'LY'];

function AddStudentModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '', username: '', password: '', email: '', phone: '',
    registrationNumber: '', department: '', className: '', role: 'STUDENT'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.register(form);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Add New Student</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Fill in the student details below</div>
          </div>
          <button className="btn btn-ghost" style={{ padding: 8 }} onClick={onClose}><Icons.X /></button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" required placeholder="e.g. Rahul Sharma" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Registration Number *</label>
                <input className="form-input" required placeholder="e.g. 2024CS001" value={form.registrationNumber}
                  onChange={e => setForm(f => ({ ...f, registrationNumber: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input className="form-input" required placeholder="Login username" value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input className="form-input" type="password" required placeholder="Set password" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="student@email.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="+91 9876543210" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-input form-select" value={form.department}
                  onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                  <option value="">Select department</option>
                  {DEPT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Class / Year</label>
                <select className="form-input form-select" value={form.className}
                  onChange={e => setForm(f => ({ ...f, className: e.target.value }))}>
                  <option value="">Select class</option>
                  {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer" style={{ padding: 0, marginTop: 8 }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function StudentDetailModal({ student, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Student Profile</div>
          <button className="btn btn-ghost" style={{ padding: 8 }} onClick={onClose}><Icons.X /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 24 }}>
            <div className="avatar avatar-xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              {student.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{student.name}</h3>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>{student.email}</div>
              <span className="badge badge-success" style={{ marginTop: 8 }}>Active Student</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              ['Registration No.', student.registrationNumber],
              ['Username', student.username],
              ['Department', student.department || '—'],
              ['Class', student.className || '—'],
              ['Phone', student.phone || '—'],
              ['Email', student.email || '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ padding: 14, background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminStudents() {
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(location.state?.action === 'add_student');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const fetchStudents = async () => {
    try {
      const data = await api.getStudents();
      setStudents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name?.toLowerCase().includes(q) || s.registrationNumber?.toLowerCase().includes(q) || s.username?.toLowerCase().includes(q);
    const matchDept = !deptFilter || s.department === deptFilter;
    return matchSearch && matchDept;
  });

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this student?')) return;
    try {
      await api.deleteUser(id);
      fetchStudents();
    } catch (err) { alert(err.message); }
  };

  return (
    <Layout title="Student Management">
      {showAdd && <AddStudentModal onClose={() => setShowAdd(false)} onSuccess={fetchStudents} />}
      {selectedStudent && <StudentDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />}

      {/* Header */}
      <div className="section-header mb-6">
        <div>
          <div className="section-title">Students</div>
          <div className="section-subtitle">{students.length} total enrolled students</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Icons.Plus /> Add Student
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="search-wrapper">
          <Icons.Search />
          <input className="search-input" placeholder="Search by name, reg. number..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input form-select" style={{ width: 200 }} value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}>
          <option value="">All Departments</option>
          {DEPT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        {(search || deptFilter) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setDeptFilter(''); }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Reg. Number</th>
                <th>Department</th>
                <th>Class</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 20, borderRadius: 4 }} /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="empty-icon"><Icons.GraduationCap /></div>
                      <div className="empty-title">{search ? 'No students found' : 'No students yet'}</div>
                      <div className="empty-desc">{search ? 'Try a different search term' : 'Click "Add Student" to get started'}</div>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(s => (
                <tr key={s.id || s._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        {s.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.username}</div>
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--bg-primary)', padding: '3px 8px', borderRadius: 4 }}>{s.registrationNumber || '—'}</span></td>
                  <td>{s.department || '—'}</td>
                  <td><span className="badge badge-accent">{s.className || '—'}</span></td>
                  <td style={{ fontSize: 12 }}>
                    <div>{s.email || '—'}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{s.phone || '—'}</div>
                  </td>
                  <td><span className="badge badge-success"><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} /> Active</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelectedStudent(s)} title="View">
                        <Icons.Eye />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id || s._id)} title="Delete">
                        <Icons.Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      {!loading && filtered.length > 0 && (
        <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
          Showing {filtered.length} of {students.length} students
        </div>
      )}
    </Layout>
  );
}
