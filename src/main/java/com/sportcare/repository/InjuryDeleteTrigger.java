package com.sportcare.repository;

import org.h2.api.Trigger;
import java.sql.*;

public class InjuryDeleteTrigger implements Trigger {
    @Override
    public void init(Connection conn, String schemaName, String triggerName, String tableName, boolean before, int type) throws SQLException {}

    @Override
    public void fire(Connection conn, Object[] oldRow, Object[] newRow) throws SQLException {
        // oldRow[1] is athlete_id (from injuries table schema)
        String athleteId = (String) oldRow[1];

        // When an injury record is deleted, set the athlete status back to 'active'
        try (PreparedStatement ps = conn.prepareStatement("UPDATE athletes SET status = 'active' WHERE id = ?")) {
            ps.setString(1, athleteId);
            ps.executeUpdate();
        }
    }

    @Override
    public void close() throws SQLException {}
    @Override
    public void remove() throws SQLException {}
}
