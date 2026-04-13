package com.sportcare.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public class SessionRepository {
    private final JdbcTemplate jdbc;
    public SessionRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public List<Map<String, Object>> findAll() {
        return jdbc.queryForList("SELECT s.*, a.first_name, a.last_name FROM sessions s JOIN athletes a ON s.athlete_id = a.id ORDER BY s.session_date DESC, s.session_time DESC");
    }

    public void save(Map<String, Object> session) {
        jdbc.update("INSERT INTO sessions (id, name, athlete_id, session_type, session_date, session_time, duration, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            session.get("id"), session.get("name"), session.get("athlete_id"), session.get("session_type"),
            session.get("session_date"), session.get("session_time"), session.get("duration"), session.get("notes"));
    }

    public void update(String id, Map<String, Object> session) {
        jdbc.update("UPDATE sessions SET name=?, athlete_id=?, session_type=?, session_date=?, session_time=?, duration=?, status=?, notes=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
            session.get("name"), session.get("athlete_id"), session.get("session_type"), session.get("session_date"),
            session.get("session_time"), session.get("duration"), session.get("status"), session.get("notes"), id);
    }

    public void delete(String id) {
        jdbc.update("DELETE FROM sessions WHERE id = ?", id);
    }
}
