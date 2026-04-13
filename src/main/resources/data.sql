-- Sample Athletes
INSERT INTO athletes (id, first_name, last_name, sport, age, email, phone, status, medical_notes) VALUES
('ATH001', 'John', 'Miller', 'Basketball', 24, 'john.miller@email.com', '555-0101', 'active', 'No known allergies'),
('ATH002', 'Sarah', 'Smith', 'Soccer', 22, 'sarah.smith@email.com', '555-0102', 'active', 'Asthma - carries inhaler'),
('ATH003', 'Mike', 'Johnson', 'Tennis', 26, 'mike.johnson@email.com', '555-0103', 'injured', 'Previous knee surgery 2024'),
('ATH004', 'Emma', 'Wilson', 'Swimming', 21, 'emma.wilson@email.com', '555-0104', 'active', NULL),
('ATH005', 'David', 'Lee', 'Track', 25, 'david.lee@email.com', '555-0105', 'injured', NULL),
('ATH006', 'Lisa', 'Chen', 'Gymnastics', 20, 'lisa.chen@email.com', '555-0106', 'active', NULL);

-- Sample Sessions
INSERT INTO sessions (id, name, athlete_id, session_type, session_date, session_time, duration, status, notes) VALUES
('SES001', 'Morning Strength', 'ATH001', 'Strength', '2026-04-13', '09:00', 60, 'completed', 'Focus on lower body'),
('SES002', 'Endurance Run', 'ATH002', 'Cardio', '2026-04-13', '10:30', 45, 'in_progress', '5K steady state'),
('SES003', 'Technique Drill', 'ATH003', 'Skills', '2026-04-13', '14:00', 90, 'scheduled', 'Serve practice'),
('SES004', 'Pool Training', 'ATH004', 'Swimming', '2026-04-14', '07:00', 75, 'scheduled', 'Sprint intervals'),
('SES005', 'Recovery Session', 'ATH005', 'Recovery', '2026-04-14', '11:00', 60, 'scheduled', 'Light stretching'),
('SES006', 'Vault Practice', 'ATH006', 'Skills', '2026-04-14', '15:00', 90, 'scheduled', NULL);

-- Sample Training Loads
INSERT INTO training_loads (id, athlete_id, microcycle, session_rpe, duration, load_au, fatigue_score, readiness_score, wellness_score, status) VALUES
('TL001', 'ATH001', 'Week 2', 7, 60, 3200, 65, 92, 8, 'optimal'),
('TL002', 'ATH002', 'Week 2', 8, 75, 4100, 78, 78, 7, 'moderate'),
('TL003', 'ATH003', 'Week 2', 9, 90, 5200, 92, 54, 5, 'high_risk');

-- Sample Injuries
INSERT INTO injuries (id, athlete_id, body_part, injury_type, severity, date_reported, date_injured, expected_return, status, notes) VALUES
('INJ001', 'ATH003', 'Right Ankle', 'Ankle Sprain', 'Grade II', '2026-04-10', '2026-04-10', '2026-04-24', 'rehabilitating', 'Lateral ankle sprain during match.'),
('INJ002', 'ATH005', 'Left Hamstring', 'Hamstring Strain', 'Grade III', '2026-04-05', '2026-04-05', '2026-05-10', 'out', 'Severe strain during sprint.');
