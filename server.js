const express = require('express');
const cors = require('cors');
const { initDatabase, queryAll, queryOne, run } = require('./database');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ============== ATHLETES ==============

app.get('/api/athletes', (req, res) => {
  try {
    const athletes = queryAll('SELECT * FROM athletes ORDER BY last_name, first_name');
    const athletesWithStatus = athletes.map(athlete => {
      const load = queryOne('SELECT status FROM training_loads WHERE athlete_id = ? ORDER BY created_at DESC LIMIT 1', [athlete.id]);
      return { ...athlete, load_status: load ? load.status : 'unknown' };
    });
    res.json(athletesWithStatus);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/athletes/:id', (req, res) => {
  try {
    const athlete = queryOne('SELECT * FROM athletes WHERE id = ?', [req.params.id]);
    if (!athlete) return res.status(404).json({ error: 'Athlete not found' });
    res.json(athlete);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/athletes', (req, res) => {
  try {
    const { first_name, last_name, sport, age, email, phone, medical_notes } = req.body;
    const id = `ATH${String(Date.now()).slice(-6)}`;
    run(`INSERT INTO athletes (id, first_name, last_name, sport, age, email, phone, medical_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, first_name, last_name, sport, age || null, email || null, phone || null, medical_notes || null]);
    res.status(201).json(queryOne('SELECT * FROM athletes WHERE id = ?', [id]));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/athletes/:id', (req, res) => {
  try {
    const { first_name, last_name, sport, age, email, phone, status, medical_notes } = req.body;
    run(`UPDATE athletes SET first_name=?, last_name=?, sport=?, age=?, email=?, phone=?, status=?, medical_notes=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      [first_name, last_name, sport, age, email, phone, status, medical_notes, req.params.id]);
    res.json(queryOne('SELECT * FROM athletes WHERE id = ?', [req.params.id]));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/athletes/:id', (req, res) => {
  try {
    run('DELETE FROM athletes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Athlete deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ============== SESSIONS ==============

app.get('/api/sessions', (req, res) => {
  try {
    res.json(queryAll(`SELECT s.*, a.first_name, a.last_name FROM sessions s JOIN athletes a ON s.athlete_id = a.id ORDER BY s.session_date DESC, s.session_time DESC`));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/sessions/:id', (req, res) => {
  try {
    const session = queryOne(`SELECT s.*, a.first_name, a.last_name FROM sessions s JOIN athletes a ON s.athlete_id = a.id WHERE s.id = ?`, [req.params.id]);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/sessions', (req, res) => {
  try {
    const { name, athlete_id, session_type, session_date, session_time, duration, notes } = req.body;
    const id = `SES${String(Date.now()).slice(-6)}`;
    run(`INSERT INTO sessions (id, name, athlete_id, session_type, session_date, session_time, duration, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, athlete_id, session_type, session_date, session_time, duration, notes || null]);
    res.status(201).json(queryOne('SELECT * FROM sessions WHERE id = ?', [id]));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/sessions/:id', (req, res) => {
  try {
    const { name, athlete_id, session_type, session_date, session_time, duration, status, notes } = req.body;
    run(`UPDATE sessions SET name=?, athlete_id=?, session_type=?, session_date=?, session_time=?, duration=?, status=?, notes=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      [name, athlete_id, session_type, session_date, session_time, duration, status, notes, req.params.id]);
    res.json(queryOne('SELECT * FROM sessions WHERE id = ?', [req.params.id]));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/sessions/:id', (req, res) => {
  try {
    run('DELETE FROM sessions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Session deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ============== TRAINING LOADS ==============

app.get('/api/training-loads', (req, res) => {
  try {
    res.json(queryAll(`SELECT t.*, a.first_name, a.last_name FROM training_loads t JOIN athletes a ON t.athlete_id = a.id ORDER BY t.created_at DESC`));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/training-loads/:id', (req, res) => {
  try {
    const load = queryOne(`SELECT t.*, a.first_name, a.last_name FROM training_loads t JOIN athletes a ON t.athlete_id = a.id WHERE t.id = ?`, [req.params.id]);
    if (!load) return res.status(404).json({ error: 'Training load not found' });
    res.json(load);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/training-loads', (req, res) => {
  try {
    const { athlete_id, microcycle, session_rpe, duration, load_au, wellness_score } = req.body;
    const id = `TL${String(Date.now()).slice(-6)}`;
    const calculatedLoad = load_au || (session_rpe * duration);
    const fatigueScore = session_rpe ? Math.min(100, session_rpe * 10) : 50;
    const readinessScore = wellness_score ? wellness_score * 10 : 75;
    let status = 'optimal';
    if (calculatedLoad > 4500) status = 'high_risk';
    else if (calculatedLoad > 3500) status = 'moderate';
    run(`INSERT INTO training_loads (id, athlete_id, microcycle, session_rpe, duration, load_au, fatigue_score, readiness_score, wellness_score, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, athlete_id, microcycle, session_rpe, duration, calculatedLoad, fatigueScore, readinessScore, wellness_score, status]);
    res.status(201).json(queryOne('SELECT * FROM training_loads WHERE id = ?', [id]));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/training-loads/:id', (req, res) => {
  try {
    const { athlete_id, microcycle, session_rpe, duration, load_au, fatigue_score, readiness_score, wellness_score, status } = req.body;
    run(`UPDATE training_loads SET athlete_id=?, microcycle=?, session_rpe=?, duration=?, load_au=?, fatigue_score=?, readiness_score=?, wellness_score=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      [athlete_id, microcycle, session_rpe, duration, load_au, fatigue_score, readiness_score, wellness_score, status, req.params.id]);
    res.json(queryOne('SELECT * FROM training_loads WHERE id = ?', [req.params.id]));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/training-loads/:id', (req, res) => {
  try {
    run('DELETE FROM training_loads WHERE id = ?', [req.params.id]);
    res.json({ message: 'Training load deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ============== INJURIES ==============

app.get('/api/injuries', (req, res) => {
  try {
    res.json(queryAll(`SELECT i.*, a.first_name, a.last_name FROM injuries i JOIN athletes a ON i.athlete_id = a.id ORDER BY i.date_reported DESC`));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/injuries/:id', (req, res) => {
  try {
    const injury = queryOne(`SELECT i.*, a.first_name, a.last_name FROM injuries i JOIN athletes a ON i.athlete_id = a.id WHERE i.id = ?`, [req.params.id]);
    if (!injury) return res.status(404).json({ error: 'Injury not found' });
    res.json(injury);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/injuries', (req, res) => {
  try {
    const { athlete_id, body_part, injury_type, severity, date_reported, date_injured, expected_return, notes } = req.body;
    const id = `INJ${String(Date.now()).slice(-6)}`;
    let status = severity === 'Grade I' ? 'returning' : severity === 'Grade III' ? 'out' : 'rehabilitating';
    run(`INSERT INTO injuries (id, athlete_id, body_part, injury_type, severity, date_reported, date_injured, expected_return, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, athlete_id, body_part, injury_type, severity, date_reported, date_injured, expected_return, status, notes || null]);
    if (severity === 'Grade III') run('UPDATE athletes SET status = ? WHERE id = ?', ['injured', athlete_id]);
    res.status(201).json(queryOne('SELECT * FROM injuries WHERE id = ?', [id]));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/injuries/:id', (req, res) => {
  try {
    const { athlete_id, body_part, injury_type, severity, date_reported, date_injured, expected_return, status, notes } = req.body;
    run(`UPDATE injuries SET athlete_id=?, body_part=?, injury_type=?, severity=?, date_reported=?, date_injured=?, expected_return=?, status=?, notes=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      [athlete_id, body_part, injury_type, severity, date_reported, date_injured, expected_return, status, notes, req.params.id]);
    if (status === 'recovered') run('UPDATE athletes SET status = ? WHERE id = ?', ['active', athlete_id]);
    res.json(queryOne('SELECT * FROM injuries WHERE id = ?', [req.params.id]));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/injuries/:id', (req, res) => {
  try {
    run('DELETE FROM injuries WHERE id = ?', [req.params.id]);
    res.json({ message: 'Injury deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ============== RECOVERY ==============

app.get('/api/recovery', (req, res) => {
  try {
    res.json(queryAll(`SELECT r.*, a.first_name, a.last_name FROM recovery r JOIN athletes a ON r.athlete_id = a.id ORDER BY r.recovery_date DESC`));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/recovery/:id', (req, res) => {
  try {
    const record = queryOne(`SELECT r.*, a.first_name, a.last_name FROM recovery r JOIN athletes a ON r.athlete_id = a.id WHERE r.id = ?`, [req.params.id]);
    if (!record) return res.status(404).json({ error: 'Recovery record not found' });
    res.json(record);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/recovery', (req, res) => {
  try {
    const { athlete_id, recovery_type, recovery_date, duration, wellness_score, sleep_quality, notes } = req.body;
    const id = `REC${String(Date.now()).slice(-6)}`;
    let status = wellness_score >= 8 ? 'excellent' : wellness_score >= 6 ? 'good' : 'fair';
    run(`INSERT INTO recovery (id, athlete_id, recovery_type, recovery_date, duration, wellness_score, sleep_quality, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, athlete_id, recovery_type, recovery_date, duration, wellness_score, sleep_quality, status, notes || null]);
    res.status(201).json(queryOne('SELECT * FROM recovery WHERE id = ?', [id]));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/recovery/:id', (req, res) => {
  try {
    const { athlete_id, recovery_type, recovery_date, duration, wellness_score, sleep_quality, status, notes } = req.body;
    run(`UPDATE recovery SET athlete_id=?, recovery_type=?, recovery_date=?, duration=?, wellness_score=?, sleep_quality=?, status=?, notes=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      [athlete_id, recovery_type, recovery_date, duration, wellness_score, sleep_quality, status, notes, req.params.id]);
    res.json(queryOne('SELECT * FROM recovery WHERE id = ?', [req.params.id]));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/recovery/:id', (req, res) => {
  try {
    run('DELETE FROM recovery WHERE id = ?', [req.params.id]);
    res.json({ message: 'Recovery record deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ============== DASHBOARD ==============

app.get('/api/dashboard/stats', (req, res) => {
  try {
    const totalAthletes = queryOne('SELECT COUNT(*) as count FROM athletes').count;
    const activeSessions = queryOne("SELECT COUNT(*) as count FROM sessions WHERE status = 'in_progress' OR status = 'scheduled'").count;
    const currentInjuries = queryOne("SELECT COUNT(*) as count FROM injuries WHERE status != 'recovered'").count;
    const avgRow = queryOne('SELECT AVG(wellness_score) as avg FROM recovery');
    const avgRecovery = avgRow ? (avgRow.avg || 0) : 0;
    res.json({
      total_athletes: totalAthletes,
      active_sessions: activeSessions,
      current_injuries: currentInjuries,
      avg_recovery_rate: Math.round((avgRecovery / 10) * 100)
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/dashboard/activity', (req, res) => {
  try {
    const activities = [];
    const sessions = queryAll(`SELECT s.*, a.first_name, a.last_name, a.sport FROM sessions s JOIN athletes a ON s.athlete_id = a.id ORDER BY s.session_date DESC, s.session_time DESC LIMIT 3`);
    sessions.forEach(s => {
      activities.push({
        athlete: { first_name: s.first_name, last_name: s.last_name, sport: s.sport },
        activity: `${s.status === 'completed' ? 'Completed' : s.status === 'in_progress' ? 'Started' : 'Scheduled'} ${s.session_type.toLowerCase()} session`,
        date: s.session_date, status: s.status
      });
    });
    const injuries = queryAll(`SELECT i.*, a.first_name, a.last_name, a.sport FROM injuries i JOIN athletes a ON i.athlete_id = a.id ORDER BY i.date_reported DESC LIMIT 2`);
    injuries.forEach(i => {
      activities.push({
        athlete: { first_name: i.first_name, last_name: i.last_name, sport: i.sport },
        activity: `${i.status === 'recovered' ? 'Recovered from' : 'Reported'} ${i.injury_type}`,
        date: i.date_reported, status: i.status
      });
    });
    res.json(activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ============== BOOT ==============

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`\n✅ Sports Management System running at http://localhost:${PORT}`);
    console.log('\nAPI endpoints:');
    console.log('  GET/POST  /api/athletes');
    console.log('  GET/POST  /api/sessions');
    console.log('  GET/POST  /api/training-loads');
    console.log('  GET/POST  /api/injuries');
    console.log('  GET/POST  /api/recovery');
    console.log('  GET       /api/dashboard/stats');
    console.log('  GET       /api/dashboard/activity');
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
