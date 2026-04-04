import React from "react";

export default function EndpointCard({ endpoint, onRefresh, onViewLogs }) {
  // Function to handle URL update
  const handleUpdate = async (e, id, currentUrl) => {
    e.stopPropagation(); // Prevents the card from opening the logs page
    const newUrl = window.prompt("Enter new URL:", currentUrl);

    if (!newUrl || newUrl === currentUrl) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/endpoints/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: newUrl }),
        },
      );

      if (response.ok) {
        onRefresh(); // Tells the parent list to reload
      } else {
        alert("Failed to update endpoint.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating endpoint.");
    }
  };

  // Function to handle Deletion
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevents the card from opening the logs page
    if (!window.confirm("Are you sure you want to delete this endpoint?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/endpoints/${id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        onRefresh(); // Tells the parent list to reload
      } else {
        alert("Failed to delete endpoint.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting endpoint.");
    }
  };

  return (
    <div
      onClick={() => onViewLogs(endpoint)}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
        backgroundColor: "#fff",
        cursor: "pointer",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        transition: "all 0.2s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "18px",
            color: "#111827",
            wordBreak: "break-all",
          }}
        >
          {endpoint.url}
        </h3>
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: "bold",
            backgroundColor:
              endpoint.status === "failing" ? "#fee2e2" : "#dcfce7",
            color: endpoint.status === "failing" ? "#991b1b" : "#166534",
          }}
        >
          {endpoint.status || "healthy"}
        </span>
      </div>

      <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
        <strong>Events:</strong> {endpoint.events?.join(", ")}
      </p>

      {/* Buttons Row */}
      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button
          onClick={(e) => handleUpdate(e, endpoint._id, endpoint.url)}
          style={{
            padding: "6px 12px",
            backgroundColor: "#f3f4f6",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            color: "#374151",
          }}
        >
          ✏️ Edit URL
        </button>
        <button
          onClick={(e) => handleDelete(e, endpoint._id)}
          style={{
            padding: "6px 12px",
            backgroundColor: "#fee2e2",
            border: "1px solid #fca5a5",
            color: "#991b1b",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
