import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { CiEdit, CiTextAlignRight } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";

function Employee() {
  const [leaves, setLeaves] = useState([]);
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');
  const [editId, setEditId] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [balance , setBalance] = useState(null);

  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory]);

  const addLeave = async () => {
    if (!reason || !date) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const formattedDate = new Date(date);
      const newLeave = { reason, status: 'Pending', required_date: formattedDate };
      let response;
      if (editId) {
        response = await axios.put(`http://localhost:5001/leave/${editId}`, newLeave);
        setLeaves(prevLeaves => prevLeaves.map(leave => (leave._id === editId ? response.data : leave)));
      } else {
        response = await axios.post('http://localhost:5001/leave', newLeave);
        setLeaves(prevLeaves => [...prevLeaves, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error('Error submitting leave:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const editLeave = (id, leaveReason) => {
    setEditId(id);
    setReason(leaveReason);
  };

  const deleteLeave = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/leave/${id}`);
      setLeaves(prevLeaves => prevLeaves.filter(leave => leave._id !== id));
    } catch (error) {
      console.error('Error deleting leave:', error);
      alert('An error occurred while deleting. Please try again.');
    }
  };

  const resetForm = () => {
    setEditId(null);
    setReason('');
    setDate('');
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5001/leave');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
      alert('An error occurred while fetching your leave history. Please try again.');
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="App">
      <h1>Leave Management Application</h1>
      <a href="#" onClick={toggleHistory}>
        {showHistory ? "Back" : "History"}
      </a>
      {!showHistory ? (
        <>
          <h2>Request Leave</h2>
          <h2> Balance : {balance}</h2>
          Enter Your Reason:
          <input
            placeholder="Reason"
            value={reason}
            onChange={e => setReason(e.target.value)}
          /><br />
          Required Date: 
          <input 
            type='date'
            value={date}
            onChange={e => setDate(e.target.value)}
          /><br />
          <button onClick={addLeave}>
            {editId ? 'Update Leave' : 'Add Leave'}
          </button>
          <ul>
            {leaves.map(leave => (
              <li key={leave._id}>
                <h2>{leave.reason}</h2>
                <p>Status: {leave.status}</p> 
                <button onClick={() => editLeave(leave._id, leave.reason)}><CiEdit /></button>
                <button onClick={() => deleteLeave(leave._id)}><MdOutlineDelete /></button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h2>Leave History</h2>
          <ul>
            {history.map(leave => (
              <li key={leave._id}>
                <h2>{leave.reason}</h2>
                <p>Date of the Leave: {new Date(leave.required_date).toLocaleDateString()}</p>
                <p>Status: {leave.status}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Employee;
