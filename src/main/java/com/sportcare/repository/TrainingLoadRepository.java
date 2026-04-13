package com.sportcare.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public class TrainingLoadRepository {
    private final JdbcTemplate jdbc;
    public TrainingLoadRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public List<Map<String, Object>> findAll() {
        return jdbc.queryForList("SELECT t.*, a.first_name, a.last_name FROM training_loads t JOIN athletes a ON t.athlete_id = a.id ORDER BY t.created_at DESC");
    }

    public void save(Map<String, Object> load) {
        jdbc.update("INSERT INTO training_loads (id, athlete_id, microcycle, session_rpe, duration, load_au, wellness_score) VALUES (?, ?, ?, ?, ?, ?, ?)",
            load.get("id"), load.get("athlete_id"), load.get("microcycle"), load.get("session_rpe"),
            load.get("duration"), load.get("load_au"), load.get("wellness_score"));
    }
}
