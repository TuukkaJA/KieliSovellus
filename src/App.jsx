import { useState, useEffect } from 'react';
import React from 'react';
import StudyCard from './card/studycard';
import SignupModal from './SignUpModal/SignupModal';
import { db, ref, onValue, set, push, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from './firebase';
import './App.css';

function App() {
  const [words, setWords] = useState([]);
  const [newSwedish, setNewSwedish] = useState('');
  const [newFinnish, setNewFinnish] = useState('');
  const [isSwapped, setIsSwapped] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // Fetch words from Firebase when the component loads
  useEffect(() => {
    if (user) {
      const wordsRef = ref(db, `users/${user.uid}/words`);
      onValue(wordsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setWords(Object.values(data));
        } else {
          setWords([]);
        }
      });
    }
  }, [user]);

  const handleSwapAll = () => {
    setIsSwapped(!isSwapped);
  };

  // Function to add a new words to firebase
 const addWord = () => {
    if (user && newSwedish.trim() && newFinnish.trim()) {
      const wordsRef = ref(db, `users/${user.uid}/words`); // Reference to 'words' collection
      const newWordRef = push(wordsRef); // Create a unique ID
      set(newWordRef, { swedish: newSwedish, finnish: newFinnish }) // Save data to Firebase
        .then(() => {
          setNewSwedish('');
          setNewFinnish('');
        })
        .catch(error => {
          console.error("Error adding word:", error);
        });
    } else {
      alert('Please log in first.');
    }
  };

  // Function to handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addWord();
    }
  };

  // Sign up function
  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        console.log("Signed up:", userCredential.user);
        setIsSignupOpen(false);
      })
      .catch((error) => {
        console.error("Error signing up:", error.code, error.message);
        alert(error.message);
      });
  };

  // Login function
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
      })
      .catch((error) => {
        console.error("Error logging in:", error.message);
        alert(error.message);
      });
  };

  // Logout function
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);   // Remove user
        setWords([]);    // Clear words list
        setEmail('');    // Clear email input
        setPassword(''); // Clear password input
      })
      .catch((error) => {
        console.error("Error logging out:", error.message);
        alert(error.message);
      });
  };

  return (
    <div className="app">

      {/* Authentication Form */}
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      <div className="auth-input">
        {user ? (
          <div className="welcome">
            <h1>Word List</h1>
            <p>Welcome, to your personal word list {user.email}</p>
          </div>
        ) : (
          <div className="auth-form">
            <h1>Word List</h1>
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

            
            <div className="controls">
              <button onClick={handleLogin}>Login</button>
              <button onClick={() => setIsSignupOpen(true)}>Sign Up</button>
            </div>
          </div>
        )}
      </div>
      
        <SignupModal
          isOpen={isSignupOpen}
          onClose={() => setIsSignupOpen(false)}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSignup={handleSignup}
        />

      {/* Form to add new words */}
      {user && (
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
            <div className="swap">
              <button onClick={handleSwapAll}>Swap all</button>
            </div>
        </div>
      )}

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

