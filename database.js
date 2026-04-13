const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'sports.db');

let db = null;

async function initDatabase() {
    const SQL = await initSqlJs();

    // Load existing database or create new one
    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();

        // Create tables
        db.run(`
            -- Athletes table
            CREATE TABLE athletes (
                id TEXT PRIMARY KEY,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                sport TEXT NOT NULL,
                age INTEGER,
                email TEXT,
                phone TEXT,
                status TEXT DEFAULT 'active',
                medical_notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            -- Sessions table
            CREATE TABLE sessions (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                athlete_id TEXT NOT NULL,
                session_type TEXT NOT NULL,
                session_date DATE NOT NULL,
                session_time TIME,
                duration INTEGER,
                status TEXT DEFAULT 'scheduled',
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE
            );

            -- Training loads table
            CREATE TABLE training_loads (
                id TEXT PRIMARY KEY,
                athlete_id TEXT NOT NULL,
                microcycle TEXT NOT NULL,
                session_rpe INTEGER,
                duration INTEGER,
                load_au INTEGER,
                fatigue_score INTEGER,
                readiness_score INTEGER,
                wellness_score INTEGER,
                status TEXT DEFAULT 'optimal',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE
            );

            -- Injuries table
            CREATE TABLE injuries (
                id TEXT PRIMARY KEY,
                athlete_id TEXT NOT NULL,
                body_part TEXT NOT NULL,
                injury_type TEXT NOT NULL,
                severity TEXT NOT NULL,
                date_reported DATE NOT NULL,
                date_injured DATE,
                expected_return DATE,
                status TEXT DEFAULT 'active',
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE
            );

            -- Recovery table
            CREATE TABLE recovery (
                id TEXT PRIMARY KEY,
                athlete_id TEXT NOT NULL,
                recovery_type TEXT NOT NULL,
                recovery_date DATE NOT NULL,
                duration INTEGER,
                wellness_score INTEGER,
                sleep_quality REAL,
                status TEXT DEFAULT 'completed',
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE
            );
        `);

        // Insert sample data
        insertSampleData();
        saveDatabase();
    }

    return db;
}

function insertSampleData() {
    // Insert athletes
    const athletes = [
        ['ATH001', 'John', 'Miller', 'Basketball', 24, 'john.miller@email.com', '555-0101', 'active', 'No known allergies'],
        ['ATH002', 'Sarah', 'Smith', 'Soccer', 22, 'sarah.smith@email.com', '555-0102', 'active', 'Asthma - carries inhaler'],
        ['ATH003', 'Mike', 'Johnson', 'Tennis', 26, 'mike.johnson@email.com', '555-0103', 'injured', 'Previous knee surgery 2024'],
        ['ATH004', 'Emma', 'Wilson', 'Swimming', 21, 'emma.wilson@email.com', '555-0104', 'active', null],
        ['ATH005', 'David', 'Lee', 'Track', 25, 'david.lee@email.com', '555-0105', 'injured', null],
        ['ATH006', 'Lisa', 'Chen', 'Gymnastics', 20, 'lisa.chen@email.com', '555-0106', 'active', null]
    ];

    athletes.forEach(a => {
        db.run(`INSERT INTO athletes (id, first_name, last_name, sport, age, email, phone, status, medical_notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, a);
    });

    // Insert sessions
    const sessions = [
        ['SES001', 'Morning Strength', 'ATH001', 'Strength', '2026-04-13', '09:00', 60, 'completed', 'Focus on lower body'],
        ['SES002', 'Endurance Run', 'ATH002', 'Cardio', '2026-04-13', '10:30', 45, 'in_progress', '5K steady state'],
        ['SES003', 'Technique Drill', 'ATH003', 'Skills', '2026-04-13', '14:00', 90, 'scheduled', 'Serve practice'],
        ['SES004', 'Pool Training', 'ATH004', 'Swimming', '2026-04-14', '07:00', 75, 'scheduled', 'Sprint intervals'],
        ['SES005', 'Recovery Session', 'ATH005', 'Recovery', '2026-04-14', '11:00', 60, 'scheduled', 'Light stretching'],
        ['SES006', 'Vault Practice', 'ATH006', 'Skills', '2026-04-14', '15:00', 90, 'scheduled', null]
    ];

    sessions.forEach(s => {
        db.run(`INSERT INTO sessions (id, name, athlete_id, session_type, session_date, session_time, duration, status, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, s);
    });

    // Insert training loads
    const loads = [
        ['TL001', 'ATH001', 'Week 2', 7, 60, 3200, 65, 92, 8, 'optimal'],
        ['TL002', 'ATH002', 'Week 2', 8, 75, 4100, 78, 78, 7, 'moderate'],
        ['TL003', 'ATH003', 'Week 2', 9, 90, 5200, 92, 54, 5, 'high_risk'],
        ['TL004', 'ATH004', 'Week 2', 6, 50, 2800, 55, 95, 9, 'optimal'],
        ['TL005', 'ATH005', 'Week 2', 5, 40, 2100, 45, 88, 8, 'optimal'],
        ['TL006', 'ATH006', 'Week 2', 8, 80, 4500, 72, 82, 7, 'moderate']
    ];

    loads.forEach(l => {
        db.run(`INSERT INTO training_loads (id, athlete_id, microcycle, session_rpe, duration, load_au, fatigue_score, readiness_score, wellness_score, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, l);
    });

    // Insert injuries
    const injuries = [
        ['INJ001', 'ATH003', 'Right Ankle', 'Ankle Sprain', 'Grade II', '2026-04-10', '2026-04-10', '2026-04-24', 'rehabilitating', 'Lateral ankle sprain during match. RICE protocol initiated.'],
        ['INJ002', 'ATH005', 'Left Hamstring', 'Hamstring Strain', 'Grade III', '2026-04-05', '2026-04-05', '2026-05-10', 'out', 'Severe strain during sprint. 6-8 weeks recovery expected.'],
        ['INJ003', 'ATH006', 'Right Shoulder', 'Shoulder Impingement', 'Grade I', '2026-04-08', '2026-04-08', '2026-04-15', 'returning', 'Minor impingement from vault landings. Responding well to PT.']
    ];

    injuries.forEach(i => {
        db.run(`INSERT INTO injuries (id, athlete_id, body_part, injury_type, severity, date_reported, date_injured, expected_return, status, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, i);
    });

    // Insert recovery records
    const recoveries = [
        ['REC001', 'ATH001', 'Cryotherapy', '2026-04-13', 15, 9, 8.5, 'completed', 'Post-training recovery'],
        ['REC002', 'ATH002', 'Massage Therapy', '2026-04-13', 45, 7, 7.0, 'completed', 'Deep tissue - legs focus'],
        ['REC003', 'ATH003', 'Physical Therapy', '2026-04-12', 60, 6, 6.5, 'completed', 'Ankle rehab exercises'],
        ['REC004', 'ATH004', 'Active Recovery', '2026-04-12', 30, 9, 9.0, 'completed', 'Light swim and stretching'],
        ['REC005', 'ATH005', 'Physical Therapy', '2026-04-12', 60, 6, 7.0, 'completed', 'Hamstring rehab - progressing well'],
        ['REC006', 'ATH006', 'Stretching', '2026-04-11', 30, 8, 8.0, 'completed', 'Shoulder mobility work']
    ];

    recoveries.forEach(r => {
        db.run(`INSERT INTO recovery (id, athlete_id, recovery_type, recovery_date, duration, wellness_score, sleep_quality, status, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, r);
    });
}

function saveDatabase() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_PATH, buffer);
    }
}

function getDb() {
    return db;
}

// Helper to convert query results to array of objects
function queryAll(sql, params = []) {
    const stmt = db.prepare(sql);
    if (params.length > 0) {
        stmt.bind(params);
    }
    const results = [];
    while (stmt.step()) {
        results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
}

function queryOne(sql, params = []) {
    const results = queryAll(sql, params);
    return results[0] || null;
}

function run(sql, params = []) {
    db.run(sql, params);
    saveDatabase();
}

module.exports = {
    initDatabase,
    getDb,
    queryAll,
    queryOne,
    run,
    saveDatabase
};
