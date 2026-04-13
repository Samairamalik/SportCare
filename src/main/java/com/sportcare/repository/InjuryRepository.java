package com.sportcare.repository;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class InjuryRepository {
    private final JdbcTemplate jdbc;
    public InjuryRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public List<Map<String, Object>> findAll() {
        return jdbc.queryForList("SELECT i.*, a.first_name, a.last_name FROM injuries i JOIN athletes a ON i.athlete_id = a.id ORDER BY i.date_reported DESC");
    }

    public void save(Map<String, Object> injury) {
        jdbc.update("INSERT INTO injuries (id, athlete_id, body_part, injury_type, severity, date_reported, date_injured, expected_return, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            injury.get("id"), injury.get("athlete_id"), injury.get("body_part"), injury.get("injury_type"),
            injury.get("severity"), injury.get("date_reported"), injury.get("date_injured"), injury.get("expected_return"), injury.get("status"), injury.get("notes"));
    }

    public void update(String id, Map<String, Object> injury) {
        jdbc.update("UPDATE injuries SET athlete_id=?, body_part=?, injury_type=?, severity=?, date_reported=?, date_injured=?, expected_return=?, status=?, notes=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
            injury.get("athlete_id"), injury.get("body_part"), injury.get("injury_type"), injury.get("severity"),
            injury.get("date_reported"), injury.get("date_injured"), injury.get("expected_return"), injury.get("status"), injury.get("notes"), id);
    }

    public void delete(String id) {
        jdbc.update("DELETE FROM injuries WHERE id = ?", id);
    }
}
