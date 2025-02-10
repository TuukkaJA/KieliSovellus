import React from "react";
import "./SignupModal.css";

const SignupModal = ({ isOpen, onClose, email, setEmail, password, setPassword, handleSignup }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignup}>Register</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SignupModal;
