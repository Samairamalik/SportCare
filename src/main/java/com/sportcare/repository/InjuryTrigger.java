package com.sportcare.repository;

import org.h2.api.Trigger;
import java.sql.*;

public class InjuryTrigger implements Trigger {
    @Override
    public void init(Connection conn, String schemaName, String triggerName, String tableName, boolean before, int type) throws SQLException {}

    @Override
    public void fire(Connection conn, Object[] oldRow, Object[] newRow) throws SQLException {
        // newRow[1] is athlete_id (from injuries table schema)
        String athleteId = (String) newRow[1];

        // Any injury record makes the athlete 'injured'
        try (PreparedStatement ps = conn.prepareStatement("UPDATE athletes SET status = 'injured' WHERE id = ?")) {
            ps.setString(1, athleteId);
            ps.executeUpdate();
        }
    }

    @Override
    public void close() throws SQLException {}
    @Override
    public void remove() throws SQLException {}
}
