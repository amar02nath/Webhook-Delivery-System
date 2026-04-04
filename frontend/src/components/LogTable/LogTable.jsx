import React from "react";
import { retryFailedDelivery } from "../../services/api";
import { RotateCcw } from "lucide-react";
import styles from "./LogTable.module.css";

const LogTable = ({ logs, onRefresh }) => {
  if (!logs || logs.length === 0) {
    return <div className={styles.empty}>No delivery logs found.</div>;
  }

  const handleRetry = async (logId) => {
    try {
      await retryFailedDelivery(logId);
      alert("Added back to the queue!");
      if (onRefresh) onRefresh(); // Refresh the table
    } catch (error) {
      alert("Failed to retry delivery.");
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Status</th>
            <th>Event</th>
            <th>HTTP Code</th>
            <th>Response Time</th>
            <th>Attempts</th>
            <th>Timestamp</th>
            <th>Action</th> {/* New Column */}
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>
                <span className={`${styles.status} ${styles[log.status]}`}>
                  {log.status}
                </span>
              </td>
              <td>
                <span className={styles.eventBadge}>{log.event}</span>
              </td>
              <td>{log.statusCode || "-"}</td>
              <td>{log.responseTime ? `${log.responseTime}ms` : "-"}</td>
              <td>{log.attemptCount}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
              <td>
                {/* Only show button if the delivery permanently failed */}
                {log.status === "failed" && (
                  <button
                    onClick={() => handleRetry(log._id)}
                    className={styles.retryBtn}
                    title="Retry Delivery"
                  >
                    <RotateCcw size={16} /> Retry
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;
