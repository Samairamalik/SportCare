package com.sportcare.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public class RecoveryRepository {
    private final JdbcTemplate jdbc;
    public RecoveryRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public List<Map<String, Object>> findAll() {
        return jdbc.queryForList("SELECT r.*, a.first_name, a.last_name FROM recovery r JOIN athletes a ON r.athlete_id = a.id ORDER BY r.recovery_date DESC");
    }

    public void save(Map<String, Object> rec) {
        jdbc.update("INSERT INTO recovery (id, athlete_id, recovery_type, recovery_date, duration, wellness_score, sleep_quality, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            rec.get("id"), rec.get("athlete_id"), rec.get("recovery_type"), rec.get("recovery_date"),
            rec.get("duration"), rec.get("wellness_score"), rec.get("sleep_quality"), rec.get("notes"));
    }

    public void delete(String id) {
        jdbc.update("DELETE FROM recovery WHERE id = ?", id);
    }
}
