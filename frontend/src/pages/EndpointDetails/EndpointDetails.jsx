import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEndpointLogs } from "../../services/api";
import LogTable from "../../components/LogTable/LogTable";
import { ArrowLeft, RefreshCw } from "lucide-react";
import styles from "./EndpointDetails.module.css";

const EndpointDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await getEndpointLogs(id);
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [id]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Endpoint Deliveries</h1>
            <p className={styles.subtitle}>ID: {id}</p>
          </div>
        </div>
        <button
          className={styles.refreshBtn}
          onClick={fetchLogs}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? styles.spinning : ""} />
          Refresh Logs
        </button>
      </header>

      <main>
        {loading && logs.length === 0 ? (
          <p>Loading delivery history...</p>
        ) : (
          <LogTable logs={logs} />
        )}
      </main>
    </div>
  );
};

export default EndpointDetails;
