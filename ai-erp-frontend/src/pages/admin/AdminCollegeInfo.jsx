import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('erp_token') || localStorage.getItem('token') || ''}`,
});

// ── Reusable Section wrapper ──────────────────────────────────────────────────
function Section({ title, emoji, children }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '24px',
      marginBottom: 20,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
        paddingBottom: 16,
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: 22 }}>{emoji}</span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 16,
          color: 'var(--text-primary)',
        }}>{title}</span>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Single text input field ───────────────────────────────────────────────────
function Field({ label, name, value, onChange, placeholder, full, hint }) {
  return (
    <div style={{ gridColumn: full ? 'span 2' : 'span 1' }}>
      <label style={{
        display: 'block',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: 6,
      }}>
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder || ''}
        style={{
          width: '100%',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 14,
          color: 'var(--text-primary)',
          outline: 'none',
          fontFamily: 'var(--font-body)',
          boxSizing: 'border-box',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e  => e.target.style.borderColor  = 'var(--border)'}
      />
      {hint && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{hint}</div>
      )}
    </div>
  );
}

// ── Textarea field ────────────────────────────────────────────────────────────
function TextareaField({ label, name, value, onChange, placeholder, hint, rows = 4 }) {
  return (
    <div style={{ gridColumn: 'span 2' }}>
      <label style={{
        display: 'block',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: 6,
      }}>
        {label}
      </label>
      <textarea
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder || ''}
        rows={rows}
        style={{
          width: '100%',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 14,
          color: 'var(--text-primary)',
          outline: 'none',
          fontFamily: 'var(--font-body)',
          resize: 'vertical',
          boxSizing: 'border-box',
          lineHeight: 1.6,
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e  => e.target.style.borderColor  = 'var(--border)'}
      />
      {hint && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{hint}</div>
      )}
    </div>
  );
}

// ── Tag (list) input ──────────────────────────────────────────────────────────
function TagField({ label, name, value = [], onTagChange, placeholder }) {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const v = draft.trim();
    if (v && !value.includes(v)) {
      onTagChange(name, [...value, v]);
    }
    setDraft('');
  };

  const removeTag = (tag) => {
    onTagChange(name, value.filter(t => t !== tag));
  };

  return (
    <div style={{ gridColumn: 'span 2' }}>
      <label style={{
        display: 'block',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: 6,
      }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          type="text"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
          placeholder={placeholder || 'Type and press Enter or click Add'}
          style={{
            flex: 1,
            background: 'var(--bg-primary)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '9px 14px',
            fontSize: 14,
            color: 'var(--text-primary)',
            outline: 'none',
            fontFamily: 'var(--font-body)',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e  => e.target.style.borderColor  = 'var(--border)'}
        />
        <button
          type="button"
          onClick={addTag}
          style={{
            padding: '9px 18px',
            background: 'var(--bg-card-hover)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            color: 'var(--text-primary)',
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
          }}
        >
          + Add
        </button>
      </div>
      {value.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {value.map(tag => (
            <span key={tag} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 20,
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              fontSize: 12,
              fontWeight: 500,
            }}>
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--accent)',
                  fontSize: 15,
                  lineHeight: 1,
                  padding: 0,
                  fontFamily: 'var(--font-body)',
                }}
              >×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminCollegeInfo() {
  const [info, setInfo] = useState({
    collegeName: '',
    shortName: '',
    established: '',
    affiliation: '',
    accreditation: '',
    type: '',
    location: '',
    city: '',
    state: '',
    pincode: '',
    website: '',
    email: '',
    phone: '',
    academicYear: '',
    semester: '',
    collegeTimings: '',
    attendanceRequired: '',
    examinationPattern: '',
    gradingSystem: '',
    principal: '',
    vicePrincipal: '',
    dean: '',
    examController: '',
    upcomingEvents: '',
    additionalInfo: '',
    departments: [],
    courses: [],
    facilities: [],
  });

  const [pageState, setPageState] = useState('loading'); // loading | ready | saving | saved | error
  const [message, setMessage] = useState('');

  // Load existing data
  useEffect(() => {
    fetch(`${BASE_URL}/college`, { headers: getHeaders() })
      .then(r => {
        if (!r.ok) throw new Error('Failed to load');
        return r.json();
      })
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setInfo(prev => ({
            ...prev,
            ...data,
            departments: Array.isArray(data.departments) ? data.departments : [],
            courses:     Array.isArray(data.courses)     ? data.courses     : [],
            facilities:  Array.isArray(data.facilities)  ? data.facilities  : [],
          }));
        }
        setPageState('ready');
      })
      .catch(err => {
        console.error('Load error:', err);
        setPageState('ready'); // still show the form even if load fails
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (name, newValue) => {
    setInfo(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setPageState('saving');
    setMessage('');

    try {
      const res = await fetch(`${BASE_URL}/college`, {
        method:  'POST',
        headers: getHeaders(),
        body:    JSON.stringify(info),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Save failed');
      }
      setPageState('saved');
      setMessage('College information saved! The AI will now use this data for all queries.');
      setTimeout(() => setPageState('ready'), 4000);
    } catch (err) {
      setPageState('error');
      setMessage(err.message || 'Failed to save. Please try again.');
      setTimeout(() => setPageState('ready'), 4000);
    }
  };

  if (pageState === 'loading') {
    return (
      <Layout title="College Information">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: '60vh', color: 'var(--text-muted)', fontSize: 14,
        }}>
          Loading college information…
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="College Information">

      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(34,211,238,0.06))',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 16,
        padding: '22px 28px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
      }}>
        <span style={{ fontSize: 44 }}>🏛️</span>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 20,
            color: 'var(--text-primary)',
            marginBottom: 6,
          }}>
            College Knowledge Base for AI
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13.5, lineHeight: 1.6 }}>
            Everything you enter here is injected into the AI assistant every time it answers a question.
            Fill in as much detail as possible — the AI will use it all to answer student and faculty queries accurately.
          </div>
        </div>
      </div>

      {/* Status message */}
      {(pageState === 'saved' || pageState === 'error') && (
        <div style={{
          padding: '13px 18px',
          borderRadius: 10,
          marginBottom: 20,
          fontSize: 14,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: pageState === 'saved' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${pageState === 'saved' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          color: pageState === 'saved' ? 'var(--success)' : 'var(--danger)',
        }}>
          {pageState === 'saved' ? '✅' : '❌'} {message}
        </div>
      )}

      <form onSubmit={handleSave}>

        {/* ── Basic Identity ── */}
        <Section title="Basic Identity" emoji="🏫">
          <Field label="College Full Name *" name="collegeName" value={info.collegeName} onChange={handleChange} placeholder="e.g. Sardar Patel College of Engineering" full />
          <Field label="Short Name / Abbreviation" name="shortName" value={info.shortName} onChange={handleChange} placeholder="e.g. SPCE" />
          <Field label="Year Established" name="established" value={info.established} onChange={handleChange} placeholder="e.g. 1962" />
          <Field label="Affiliated University" name="affiliation" value={info.affiliation} onChange={handleChange} placeholder="e.g. Mumbai University" />
          <Field label="Accreditation" name="accreditation" value={info.accreditation} onChange={handleChange} placeholder="e.g. NAAC A+, NBA Accredited" />
          <Field label="College Type" name="type" value={info.type} onChange={handleChange} placeholder="e.g. Government / Private / Autonomous" />
        </Section>

        {/* ── Contact & Location ── */}
        <Section title="Contact & Location" emoji="📍">
          <Field label="Full Address" name="location" value={info.location} onChange={handleChange} placeholder="Building, Street, Area" full />
          <Field label="City" name="city" value={info.city} onChange={handleChange} placeholder="e.g. Mumbai" />
          <Field label="State" name="state" value={info.state} onChange={handleChange} placeholder="e.g. Maharashtra" />
          <Field label="PIN Code" name="pincode" value={info.pincode} onChange={handleChange} placeholder="e.g. 400058" />
          <Field label="Website" name="website" value={info.website} onChange={handleChange} placeholder="e.g. www.spce.ac.in" />
          <Field label="Official Email" name="email" value={info.email} onChange={handleChange} placeholder="e.g. info@spce.ac.in" />
          <Field label="Phone Number" name="phone" value={info.phone} onChange={handleChange} placeholder="e.g. +91-22-26700519" />
        </Section>

        {/* ── Academic Info ── */}
        <Section title="Academic Information" emoji="📚">
          <Field label="Current Academic Year" name="academicYear" value={info.academicYear} onChange={handleChange} placeholder="e.g. 2025-2026" />
          <Field label="Current Semester" name="semester" value={info.semester} onChange={handleChange} placeholder="e.g. Semester IV (Even 2026)" />
          <Field label="College Timings" name="collegeTimings" value={info.collegeTimings} onChange={handleChange} placeholder="e.g. Mon–Fri: 8:00 AM – 5:00 PM" full />
          <Field label="Minimum Attendance Required" name="attendanceRequired" value={info.attendanceRequired} onChange={handleChange} placeholder="e.g. 75% (mandatory to appear for exams)" full />
          <Field label="Examination Pattern" name="examinationPattern" value={info.examinationPattern} onChange={handleChange} placeholder="e.g. Internal 40 marks + External 60 marks = 100" full />
          <Field label="Grading / CGPA System" name="gradingSystem" value={info.gradingSystem} onChange={handleChange} placeholder="e.g. 10-point CGPA scale — O/A+/A/B+/B/C/P/F" full />
          <TagField label="Departments" name="departments" value={info.departments} onTagChange={handleTagChange} placeholder="Type department name and press Enter" />
          <TagField label="Courses / Programs Offered" name="courses" value={info.courses} onTagChange={handleTagChange} placeholder="e.g. B.E. Computer Engineering, M.E. Mechanical…" />
          <TagField label="Campus Facilities" name="facilities" value={info.facilities} onTagChange={handleTagChange} placeholder="e.g. Library, Canteen, Sports Ground, WiFi, Labs…" />
        </Section>

        {/* ── Key Personnel ── */}
        <Section title="Key Personnel" emoji="👥">
          <Field label="Principal / Director" name="principal" value={info.principal} onChange={handleChange} placeholder="e.g. Dr. Rajesh Kumar" />
          <Field label="Vice Principal" name="vicePrincipal" value={info.vicePrincipal} onChange={handleChange} placeholder="e.g. Dr. Meera Patel" />
          <Field label="Dean of Academics" name="dean" value={info.dean} onChange={handleChange} placeholder="e.g. Prof. Suresh Nair" />
          <Field label="Exam Controller / COE" name="examController" value={info.examController} onChange={handleChange} placeholder="e.g. Dr. Anand Joshi" />
        </Section>

        {/* ── Events & Additional ── */}
        <Section title="Events & Additional Information for AI" emoji="🤖">
          <TextareaField
            label="Upcoming Events / Important Dates"
            name="upcomingEvents"
            value={info.upcomingEvents}
            onChange={handleChange}
            placeholder={'End Semester Exams: 15 May – 5 June 2026\nAnnual Day: 20 March 2026\nHackathon 2026: 28 April 2026\nAdmissions open: June 2026'}
            rows={4}
          />
          <TextareaField
            label="Additional Info (AI uses everything written here)"
            name="additionalInfo"
            value={info.additionalInfo}
            onChange={handleChange}
            placeholder={'Write ANYTHING you want the AI to know about your college:\n\n• College history, achievements, national rankings\n• Dress code, disciplinary rules, code of conduct\n• Library hours, lab access policy, hostel/mess timings\n• Placement statistics, companies that visited, average packages\n• Sports teams, cultural clubs, technical festivals\n• Scholarship schemes, fee concessions\n• Anti-ragging policy, grievance redressal contact\n• COVID or special protocols\n• Any other institutional information'}
            rows={10}
            hint="The more you write here, the smarter the AI gets about your college. Students and faculty can then ask anything and get accurate answers."
          />
        </Section>

        {/* ── Save button ── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8, paddingBottom: 32 }}>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '11px 22px',
              background: 'var(--bg-card-hover)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--text-secondary)',
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
            }}
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={pageState === 'saving'}
            style={{
              padding: '11px 32px',
              background: pageState === 'saving' ? 'var(--bg-card-hover)' : 'var(--accent)',
              border: 'none',
              borderRadius: 8,
              color: pageState === 'saving' ? 'var(--text-muted)' : 'white',
              fontSize: 14,
              cursor: pageState === 'saving' ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              minWidth: 200,
              justifyContent: 'center',
            }}
          >
            {pageState === 'saving' ? (
              <>
                <span style={{
                  width: 14, height: 14,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'var(--text-muted)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  display: 'inline-block',
                }} />
                Saving…
              </>
            ) : '💾 Save College Information'}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: var(--text-muted); }
      `}</style>
    </Layout>
  );
}
