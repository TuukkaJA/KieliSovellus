import React, { useState } from 'react';
import './studycard.css'; // Import the CSS file

function StudyCard({ swedishWord, finnishWord, isSwapped, handleDelete }) {
  const [isHidden, setIsHidden] = useState(true); // Initially hidden

  // Function to toggle hidden text
  const handleClick = () => {
    setIsHidden(!isHidden);
  };

    return (
      <div className="card">
      {/* Left side: Always visible word */}
      <div className={`left-side ${isSwapped ? 'blue-text' : 'yellow-text'}`}>
        {isSwapped ? finnishWord : swedishWord}
      </div>

      {/* Right side: Click to reveal the hidden word */}
      <div 
        className="right-side" 
        onClick={handleClick} // Click event to show the word
      >
        <div className={`hidden-text ${isSwapped ? 'yellow-text' : 'blue-text'}`}>
          {isHidden ? 'Click to reveal' : (isSwapped ? swedishWord : finnishWord)}
        </div>
      </div>
      <button onClick={handleDelete}> X </button>
    </div>
  );
}

export default StudyCard;
