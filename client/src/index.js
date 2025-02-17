import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Employee from './components/employee';
import Login from './components/login';
import Admin from './components/admin';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <Employee />
//   </React.StrictMode>
// );

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/employee" element={<Employee />} />
      <Route path='/admin' element={<Admin />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);