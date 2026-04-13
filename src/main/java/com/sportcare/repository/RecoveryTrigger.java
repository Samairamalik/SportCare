package com.sportcare.repository;

import org.h2.api.Trigger;
import java.sql.*;

public class RecoveryTrigger implements Trigger {
    @Override
    public void init(Connection conn, String schemaName, String triggerName, String tableName, boolean before, int type) throws SQLException {}

    @Override
    public void fire(Connection conn, Object[] oldRow, Object[] newRow) throws SQLException {
        // newRow[5] is wellness_score, newRow[1] is athlete_id
        Integer wellness = (Integer) newRow[5];
        String athleteId = (String) newRow[1];

        if (wellness != null && wellness >= 8) {
            try (PreparedStatement ps = conn.prepareStatement("UPDATE athletes SET status = 'active' WHERE id = ?")) {
                ps.setString(1, athleteId);
                ps.executeUpdate();
            }
        }
    }

    @Override
    public void close() throws SQLException {}
    @Override
    public void remove() throws SQLException {}
}
