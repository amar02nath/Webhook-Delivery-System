import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEndpoints, triggerEvent } from "../../services/api";
import EndpointCard from "../../components/EndpointCard/EndpointCard";
import AddEndpointModal from "../../components/AddEndpointModal/AddEndpointModal";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize the navigation hook
  const navigate = useNavigate();

  const fetchEndpoints = async () => {
    try {
      const { data } = await getEndpoints();
      setEndpoints(data);
    } catch (error) {
      console.error("Failed to fetch endpoints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const handleTriggerTest = async () => {
    try {
      await triggerEvent({
        event: "user.created",
        payload: { user_id: 123, email: "test@example.com" },
      });
      alert("Event Triggered! Workers are processing it in the background.");
      // Refresh to see if health status changed
      setTimeout(fetchEndpoints, 1000);
    } catch (error) {
      alert("Error triggering event");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Webhook Dashboard</h1>
          <p>Monitor your active endpoints and delivery health.</p>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.secondaryBtn}
            onClick={() => setIsModalOpen(true)}
          >
            Add Endpoint
          </button>
          <button className={styles.primaryBtn} onClick={handleTriggerTest}>
            Trigger Test Event
          </button>
        </div>
      </header>

      <main>
        {loading ? (
          <p>Loading endpoints...</p>
        ) : endpoints.length === 0 ? (
          <div className={styles.empty}>No endpoints registered yet.</div>
        ) : (
          <div className={styles.grid}>
            {/* THIS IS THE UPDATED MAPPING */}
            {endpoints.map((ep) => (
              <EndpointCard
                key={ep._id}
                endpoint={ep}
                onViewLogs={(endpoint) => navigate(`/endpoint/${endpoint._id}`)}
                onRefresh={fetchEndpoints}
              />
            ))}
          </div>
        )}
      </main>

      <AddEndpointModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchEndpoints}
      />
    </div>
  );
};

export default Dashboard;
