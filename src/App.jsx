import { useState, useEffect, useRef } from 'react';
import React from 'react';
import StudyCard from './card/studycard';
import SignupModal from './SignUpModal/SignupModal';
import { db, ref, onValue, set, push, auth, signInAnonymously, signOut } from './firebase';
import { child, get } from 'firebase/database';
import './App.css';

function App() {
  const [words, setWords] = useState([]);
  const [newSwedish, setNewSwedish] = useState('');
  const [newFinnish, setNewFinnish] = useState('');
  const [isSwapped, setIsSwapped] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const passwordRef = useRef(null);
  const finnishRef = useRef(null);
  const swedishRef = useRef(null);

  // Fetch words from Firebase when the component loads
  const handleSignup = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Please enter a username and password.");
      return;
    }

    try {
      const snapshot = await get(child(ref(db), `users/${username}`));
      if (snapshot.exists()) {
        alert("Username already exists. Choose another one.");
        return;
      }

    const userCredential  = await signInAnonymously(auth);
    const userId = userCredential.user.uid;

    await set(ref(db, `users/${username}`), {
      userId,
      password,
    });

    setUser({ username, userId });

    setIsSignupOpen(false);
    

  } catch (error) {
    console.error("Signup error:", error);
  }
};

const handleLogin = async () => {
  if (!username.trim() || !password.trim()) {
    alert("Please enter a username and password.");
    return;
  }

  try {
    const snapshot = await get(child(ref(db), `users/${username}`));
    if (!snapshot.exists()) {
      alert("Username not found.");
      return;
    }

    const userData = snapshot.val();
    if (userData.password !== password) {
      alert("Incorrect password.");
      return;
    }

    // Authenticate anonymously (Firebase)
    await signInAnonymously(auth);

    setUser({ username, userId: userData.userId });

  } catch (error) {
    console.error("Login error:", error);
  }
};

const handleLogout = async () => {
  try {
    await signOut(auth);
    setUser(null);
    setUsername("");
    setPassword("");
    setWords([]);
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
};

  useEffect(() => {
    if (user && user.userId) {
      const wordsRef = ref(db, `users/${user.userId}/words`);
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

  useEffect(() => {
    if (user) {
      setTimeout(() => swedishRef.current?.focus(), 0);
    }
  }, [user]); // Runs whenever 'user' changes

  // Function to add a new words to firebase
 const addWord = () => {
    if (user && newSwedish.trim() && newFinnish.trim()) {
      const wordsRef = ref(db, `users/${user.userId}/words`); // Reference to 'words' collection
      const newWordRef = push(wordsRef); // Create a unique ID
      set(newWordRef, { swedish: newSwedish, finnish: newFinnish }) // Save data to Firebase
        .then(() => {
          setNewSwedish('');
          setNewFinnish('');

          setTimeout(() => swedishRef.current?.focus(), 0);
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
      setTimeout(() => swedishRef.current?.focus(), 0);  // Use setTimeout to ensure focus
    }
  };


  const handleUsernameKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();  // Prevent form submission (if inside a form)
      passwordRef.current?.focus();  // Move focus to the password input
    }
  };

  const handlePasswordKeyDown = async (event) => {
    if (event.key === 'Enter') {
      await handleLogin();
    }
  };

  const handleSwedishKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();  // Prevent form submission (if inside a form)
      finnishRef.current?.focus();  // Move focus to the password input
    }
  };

  const handleDeleteWord = async (wordToDelete) => {
    if (!user) return;
  
    const wordsRef = ref(db, `users/${user.userId}/words`);
  
    try {
      const snapshot = await get(wordsRef); // Get data once
      if (snapshot.exists()) {
        const data = snapshot.val();
        const wordKey = Object.keys(data).find(
          (key) => data[key].swedish === wordToDelete.swedish && data[key].finnish === wordToDelete.finnish
        );
  
        if (wordKey) {
          await set(ref(db, `users/${user.userId}/words/${wordKey}`), null); // Delete from Firebase
          setWords((prevWords) => prevWords.filter((word) => word !== wordToDelete)); // Update state
        }
      }
    } catch (error) {
      console.error("Error deleting word:", error);
    }
  };

  return (
    <div className="app">
      {/* Authentication Form */}
      <div className="auth-input">
        {user ? (
          <div className="welcome">
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            <h1>Word List</h1>
            <p>Welcome, to your personal word list {user.username}</p>
          </div>
        ) : (
          <div className="auth-form">
            <h1>Word List</h1>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              ref={passwordRef}
              onKeyDown={handleUsernameKeyDown}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              ref={passwordRef}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handlePasswordKeyDown}
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
          username={username}
          setUsername={setUsername}
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
            ref={swedishRef}
            onKeyDown={handleSwedishKeyDown}
          />
          <input
            type="text"
            placeholder="Finnish word"
            value={newFinnish}
            onChange={(e) => setNewFinnish(e.target.value)}
            ref={finnishRef}
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
          <StudyCard 
          key={index} 
          swedishWord={word.swedish} 
          finnishWord={word.finnish} 
          isSwapped={isSwapped} 
          handleDelete={() => handleDeleteWord(word)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;

