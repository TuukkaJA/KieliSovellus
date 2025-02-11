import React, { useRef } from "react";
import "./SignupModal.css";

const SignupModal = ({ isOpen, onClose, email, setEmail, password, setPassword, handleSignup }) => {
  const passwordRef = useRef(null);

  if (!isOpen) return null;

  const handleEmailKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();  // Prevent form submission (if inside a form)
      passwordRef.current?.focus();  // Move focus to the password input
    }
  };

  const handlePasswordKeyDown = async (event) => {
    if (event.key === 'Enter') {
      await handleSignup();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleEmailKeyDown}
        />
        <input
          ref={passwordRef}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handlePasswordKeyDown}
        />
        <button onClick={handleSignup}>Register</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SignupModal;

