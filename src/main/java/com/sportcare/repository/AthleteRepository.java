package com.sportcare.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public class AthleteRepository {
    private final JdbcTemplate jdbc;

    public AthleteRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<Map<String, Object>> findAll() {
        return jdbc.queryForList("SELECT * FROM athletes ORDER BY last_name, first_name");
    }

    public Map<String, Object> findById(String id) {
        return jdbc.queryForMap("SELECT * FROM athletes WHERE id = ?", id);
    }

    public void save(Map<String, Object> athlete) {
        jdbc.update("INSERT INTO athletes (id, first_name, last_name, sport, age, email, phone, medical_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            athlete.get("id"), athlete.get("first_name"), athlete.get("last_name"), athlete.get("sport"),
            athlete.get("age"), athlete.get("email"), athlete.get("phone"), athlete.get("medical_notes"));
    }

    public void update(String id, Map<String, Object> athlete) {
        jdbc.update("UPDATE athletes SET first_name=?, last_name=?, sport=?, age=?, email=?, phone=?, status=?, medical_notes=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
            athlete.get("first_name"), athlete.get("last_name"), athlete.get("sport"), athlete.get("age"),
            athlete.get("email"), athlete.get("phone"), athlete.get("status"), athlete.get("medical_notes"), id);
    }

    public void delete(String id) {
        jdbc.update("DELETE FROM athletes WHERE id = ?", id);
    }
}
