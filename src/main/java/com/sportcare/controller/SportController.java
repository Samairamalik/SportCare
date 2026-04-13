package com.sportcare.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sportcare.repository.AthleteRepository;
import com.sportcare.repository.InjuryRepository;
import com.sportcare.repository.RecoveryRepository;
import com.sportcare.repository.SessionRepository;
import com.sportcare.repository.TrainingLoadRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SportController {
    private final AthleteRepository athletes;
    private final SessionRepository sessions;
    private final InjuryRepository injuries;
    private final RecoveryRepository recoveries;
    private final TrainingLoadRepository loads;

    public SportController(AthleteRepository a, SessionRepository s, InjuryRepository i, RecoveryRepository r, TrainingLoadRepository l) {
        this.athletes = a; this.sessions = s; this.injuries = i; this.recoveries = r; this.loads = l;
    }

    // Athletes
    @GetMapping("/athletes") public List<Map<String, Object>> getAthletes() { return athletes.findAll(); }
    @PostMapping("/athletes") public Map<String, Object> addAthlete(@RequestBody Map<String, Object> a) {
        if (!a.containsKey("id")) a.put("id", "ATH" + System.currentTimeMillis() % 1000000);
        if (!a.containsKey("status")) a.put("status", "active");
        athletes.save(a);
        return a;
    }
    @PutMapping("/athletes/{id}") public Map<String, Object> updateAthlete(@PathVariable String id, @RequestBody Map<String, Object> a) {
        athletes.update(id, a);
        return a;
    }
    @DeleteMapping("/athletes/{id}") public void deleteAthlete(@PathVariable String id) { athletes.delete(id); }

    // Sessions
    @GetMapping("/sessions") public List<Map<String, Object>> getSessions() { return sessions.findAll(); }
    @PostMapping("/sessions") public Map<String, Object> addSession(@RequestBody Map<String, Object> s) {
        if (!s.containsKey("id")) s.put("id", "SES" + System.currentTimeMillis() % 1000000);
        sessions.save(s);
        // Returns the object with joined athlete name
        return sessions.findAll().stream().filter(m -> m.get("id").equals(s.get("id"))).findFirst().orElse(s);
    }
    @DeleteMapping("/sessions/{id}") public void deleteSession(@PathVariable String id) { sessions.delete(id); }

    // Training Loads
    @GetMapping("/training-loads") public List<Map<String, Object>> getLoads() { return loads.findAll(); }
    @PostMapping("/training-loads") public Map<String, Object> addLoad(@RequestBody Map<String, Object> l) {
        if (!l.containsKey("id")) l.put("id", "TL" + System.currentTimeMillis() % 1000000);
        loads.save(l);
        // Returns the object with joined athlete name
        return loads.findAll().stream().filter(m -> m.get("id").equals(l.get("id"))).findFirst().orElse(l);
    }

    // Injuries
    @GetMapping("/injuries") public List<Map<String, Object>> getInjuries() { return injuries.findAll(); }
    @PostMapping("/injuries") public Map<String, Object> addInjury(@RequestBody Map<String, Object> i) {
        if (!i.containsKey("id")) i.put("id", "INJ" + System.currentTimeMillis() % 1000000);
        if (!i.containsKey("status")) i.put("status", "out");
        injuries.save(i);
        return injuries.findAll().stream().filter(m -> m.get("id").equals(i.get("id"))).findFirst().orElse(i);
    }
    @PutMapping("/injuries/{id}") public Map<String, Object> updateInjury(@PathVariable String id, @RequestBody Map<String, Object> i) {
        if (!i.containsKey("status")) i.put("status", "out");
        injuries.update(id, i);
        return injuries.findAll().stream().filter(m -> m.get("id").equals(id)).findFirst().orElse(i);
    }
    @DeleteMapping("/injuries/{id}") public void deleteInjury(@PathVariable String id) { injuries.delete(id); }

    // Recovery
    @GetMapping("/recovery") public List<Map<String, Object>> getRecoveries() { return recoveries.findAll(); }
    @PostMapping("/recovery") public Map<String, Object> addRecovery(@RequestBody Map<String, Object> r) {
        if (!r.containsKey("id")) r.put("id", "REC" + System.currentTimeMillis() % 1000000);
        recoveries.save(r);
        return recoveries.findAll().stream().filter(m -> m.get("id").equals(r.get("id"))).findFirst().orElse(r);
    }

    // Dashboard
    @GetMapping("/dashboard/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total_athletes", athletes.findAll().size());
        stats.put("active_sessions", sessions.findAll().size());
        stats.put("current_injuries", injuries.findAll().size());
        stats.put("avg_recovery_rate", 89);
        return stats;
    }

    @GetMapping("/dashboard/activity")
    public List<Map<String, Object>> getActivity() {
        List<Map<String, Object>> activities = new ArrayList<>();
        sessions.findAll().stream().limit(5).forEach(s -> {
            Map<String, Object> act = new HashMap<>();
            
            Map<String, Object> athlete = new HashMap<>();
            athlete.put("first_name", s.get("first_name"));
            athlete.put("last_name", s.get("last_name"));
            athlete.put("sport", "Basketball");
            
            act.put("athlete", athlete);
            act.put("activity", "Training session: " + s.get("name"));
            act.put("date", s.get("session_date"));
            act.put("status", s.get("status"));
            activities.add(act);
        });
        return activities;
    }
}
