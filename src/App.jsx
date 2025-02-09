import { useState } from 'react';
import React from 'react';
import StudyCard from './card/studycard';
import './App.css';

function App() {
  const [words, setWords] = useState([
    { swedish: 'Hej', finnish: 'Hei' },
    { swedish: 'Tack', finnish: 'Kiitos' },
  ]);
  
  const [newSwedish, setNewSwedish] = useState('');
  const [newFinnish, setNewFinnish] = useState('');
  const [isSwapped, setIsSwapped] = useState(false);

  const handleSwapAll = () => {
    setIsSwapped(!isSwapped);
  };

  // Function to add a new word
  const addWord = () => {
    if (newSwedish.trim() && newFinnish.trim()) {
      setWords([...words, { swedish: newSwedish, finnish: newFinnish }]);
      setNewSwedish('');
      setNewFinnish('');
    }
  };

  // Function to handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addWord();
    }
  };

  return (
    <div className="app">
      <h1>Word List</h1>
      <div className="controls">
        <button onClick={handleSwapAll}>Swap all</button>
      </div>
      {/* Form to add new words */}
      <div className="word-input">
        <input 
          type="text" 
          placeholder="Swedish word" 
          value={newSwedish} 
          onChange={(e) => setNewSwedish(e.target.value)} 
          onKeyDown={handleKeyDown} // Listen for Enter key
        />
        <input 
          type="text" 
          placeholder="Finnish word" 
          value={newFinnish} 
          onChange={(e) => setNewFinnish(e.target.value)} 
          onKeyDown={handleKeyDown} // Listen for Enter key
        />
      </div>

      {/* Render StudyCard for each word */}
      <div className="word-list">
        {words.map((word, index) => (
          <StudyCard key={index} swedishWord={word.swedish} finnishWord={word.finnish} isSwapped={isSwapped} />
        ))}
      </div>
    </div>
  );
}

export default App;

