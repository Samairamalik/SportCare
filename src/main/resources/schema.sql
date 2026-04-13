DROP TRIGGER IF EXISTS TRG_ATHLETE_INJURED;
DROP TRIGGER IF EXISTS TRG_ATHLETE_INJURY_REMOVE;
DROP TRIGGER IF EXISTS TRG_ATHLETE_RECOVERY;

-- Drop existing tables
DROP TABLE IF EXISTS recovery;
DROP TABLE IF EXISTS injuries;
DROP TABLE IF EXISTS training_loads;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS athletes;

-- Athletes table
CREATE TABLE athletes (
    id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    sport VARCHAR(100) NOT NULL,
    age INT,
    email VARCHAR(255),
    phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    medical_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE sessions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    athlete_id VARCHAR(50) NOT NULL,
    session_type VARCHAR(50) NOT NULL,
    session_date DATE NOT NULL,
    session_time TIME,
    duration INT,
    status VARCHAR(50) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE
);

-- Training loads table
CREATE TABLE training_loads (
    id VARCHAR(50) PRIMARY KEY,
    athlete_id VARCHAR(50) NOT NULL,
    microcycle VARCHAR(100) NOT NULL,
    session_rpe INT,
    duration INT,
    load_au INT,
    fatigue_score INT,
    readiness_score INT,
    wellness_score INT,
    status VARCHAR(50) DEFAULT 'optimal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE
);

-- Injuries table
CREATE TABLE injuries (
    id VARCHAR(50) PRIMARY KEY,
    athlete_id VARCHAR(50) NOT NULL,
    body_part VARCHAR(100) NOT NULL,
    injury_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    date_reported DATE NOT NULL,
    date_injured DATE,
    expected_return DATE,
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE
);

-- Recovery table
CREATE TABLE recovery (
    id VARCHAR(50) PRIMARY KEY,
    athlete_id VARCHAR(50) NOT NULL,
    recovery_type VARCHAR(100) NOT NULL,
    recovery_date DATE NOT NULL,
    duration INT,
    wellness_score INT,
    sleep_quality DOUBLE,
    status VARCHAR(50) DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE
);

-- ==========================================
-- PL/SQL EQUIVALENTS (Triggers and Procedures)
-- ==========================================

-- Trigger: Update Athlete Status to 'injured' when a Grade III injury is added
CREATE TRIGGER TRG_ATHLETE_INJURED
AFTER INSERT ON injuries
FOR EACH ROW
CALL "com.sportcare.repository.InjuryTrigger";

CREATE TRIGGER TRG_ATHLETE_INJURY_REMOVE
AFTER DELETE ON injuries
FOR EACH ROW
CALL "com.sportcare.repository.InjuryDeleteTrigger";

-- Trigger: Update Athlete Status back to 'active' when a recovery is excellent
CREATE TRIGGER TRG_ATHLETE_RECOVERY
AFTER INSERT ON recovery
FOR EACH ROW
CALL "com.sportcare.repository.RecoveryTrigger";
