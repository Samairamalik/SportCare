package com.sportcare.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.h2.api.Trigger;

public class InjuryDeleteTrigger implements Trigger {
    @Override
    public void init(Connection conn, String schemaName, String triggerName, String tableName, boolean before, int type) throws SQLException {}

    @Override
    public void fire(Connection conn, Object[] oldRow, Object[] newRow) throws SQLException {
        // oldRow[1] is athlete_id (from injuries table schema)
        String athleteId = (String) oldRow[1];

        int remainingInjuries = 0;
        int outInjuries = 0;

        try (PreparedStatement ps = conn.prepareStatement(
                "SELECT COUNT(*), SUM(CASE WHEN LOWER(COALESCE(status, '')) = 'out' THEN 1 ELSE 0 END) FROM injuries WHERE athlete_id = ?")) {
            ps.setString(1, athleteId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    remainingInjuries = rs.getInt(1);
                    outInjuries = rs.getInt(2);
                }
            }
        }

        String athleteStatus;
        if (remainingInjuries == 0) {
            athleteStatus = "active";
        } else if (outInjuries > 0) {
            athleteStatus = "out";
        } else {
            athleteStatus = "injured";
        }

        try (PreparedStatement ps = conn.prepareStatement("UPDATE athletes SET status = ? WHERE id = ?")) {
            ps.setString(1, athleteStatus);
            ps.setString(2, athleteId);
            ps.executeUpdate();
        }
    }

    @Override
    public void close() throws SQLException {}
    @Override
    public void remove() throws SQLException {}
}
