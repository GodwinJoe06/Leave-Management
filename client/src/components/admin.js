import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css";

function Admin() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:5001/admin");
      setLeaves(response.data);
    } catch (error) {
      setError("Error fetching data. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:5001/admin/${id}`, {
        status,
      });
      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) => (leave._id === id ? response.data : leave))
      );
    } catch (error) {
      console.error("Error updating leave status:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const Accept = (id) => {
    updateLeaveStatus(id, "Accepted");
    setLeaves((prevLeaves) => prevLeaves.filter((leave) => leave._id !== id));
  };

  const Reject = (id) => {
    updateLeaveStatus(id, "Rejected");
    setLeaves((prevLeaves) => prevLeaves.filter((leave) => leave._id !== id));
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

    // Filter to show only pending leaves
    const pendingLeaves = leaves.filter((leave) => leave.status === "Pending");

  return (
    <div>
      <h2>Leave Applications</h2>
      {pendingLeaves.length === 0 ? (
        <p>No pending leave applications.</p>
      ) : (
        <ul>
          {pendingLeaves.map((leave) => (
            <li key={leave._id}>
              <h2>{leave.reason}</h2>
              <button onClick={() => Reject(leave._id)}>Reject</button>
              <button onClick={() => Accept(leave._id)}>Accept</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Admin;
