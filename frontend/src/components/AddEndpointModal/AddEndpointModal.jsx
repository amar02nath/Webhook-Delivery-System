import React, { useState } from "react";
import { X } from "lucide-react";
import { createEndpoint } from "../../services/api";
import styles from "./AddEndpointModal.module.css";

const AddEndpointModal = ({ isOpen, onClose, onRefresh }) => {
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableEvents = [
    "user.created",
    "user.updated",
    "order.placed",
    "payment.failed",
  ];

  const handleEventToggle = (event) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== event));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedEvents.length === 0) return alert("Select at least one event");

    setIsSubmitting(true);
    try {
      await createEndpoint({ url, events: selectedEvents });
      onRefresh(); // Reload dashboard list
      onClose(); // Close modal
      setUrl("");
      setSelectedEvents([]);
    } catch (error) {
      alert("Failed to register endpoint");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Register New Webhook</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Endpoint URL</label>
            <input
              type="url"
              placeholder="https://your-api.com/webhook"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Select Event Subscriptions</label>
            <div className={styles.eventGrid}>
              {availableEvents.map((event) => (
                <label key={event} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event)}
                    onChange={() => handleEventToggle(event)}
                  />
                  <span>{event}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitBtn}
            >
              {isSubmitting ? "Registering..." : "Register Endpoint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEndpointModal;
