import { useState, useEffect, useRef } from "react";
import React from "react";
import StudyCard from "./card/studycard";
import SignupModal from "./SignUpModal/SignupModal";
import { db, ref, onValue, set, get,  push, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "./firebase";
import "./App.css";

function App() {
  const [words, setWords] = useState([]);
  const [newSwedish, setNewSwedish] = useState("");
  const [newFinnish, setNewFinnish] = useState("");
  const [isSwapped, setIsSwapped] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const passwordRef = useRef(null);
  const finnishRef = useRef(null);
  const swedishRef = useRef(null);

  const handleSignup = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter an email and password.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Store user info in the database
      const userRef = ref(db, `users/${userId}`);
      await set(userRef, { email, userId });

      setUser({ email, userId });
      setIsSignupOpen(false);
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed: " + error.message);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter an email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Fetch user info from Firebase
      const userRef = ref(db, `users/${userId}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        setUser({ email: userData.email, userId });
      } else {
        alert("User data not found.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setEmail("");
      setPassword("");
      setWords([]);
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  useEffect(() => {
    if (user && user.userId) {
      const wordsRef = ref(db, `users/${user.userId}/words`);

      const unsubscribe = onValue(wordsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const wordsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setWords(wordsArray);
        } else {
          setWords([]);
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleSwapAll = () => {
    setIsSwapped(!isSwapped);
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => swedishRef.current?.focus(), 0);
    }
  }, [user]);

  const addWord = () => {
    if (user && newSwedish.trim() && newFinnish.trim()) {
      const wordsRef = ref(db, `users/${user.userId}/words`);
      const newWordRef = push(wordsRef);

      set(newWordRef, { swedish: newSwedish, finnish: newFinnish })
        .then(() => {
          setNewSwedish("");
          setNewFinnish("");
        })
        .catch((error) => {
          console.error("Error adding word:", error);
        });
    } else {
      alert("Please log in first.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      addWord();
      setTimeout(() => swedishRef.current?.focus(), 0);
    }
  };

  const handleEmailKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      passwordRef.current?.focus();
    }
  };

  const handlePasswordKeyDown = async (event) => {
    if (event.key === "Enter") {
      await handleLogin();
    }
  };

  const handleSwedishKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      finnishRef.current?.focus();
    }
  };

  const handleDeleteWord = async (wordToDelete) => {
    if (!user) return;

    const wordsRef = ref(db, `users/${user.userId}/words`);

    try {
      const snapshot = await get(wordsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const wordKey = Object.keys(data).find(
          (key) => data[key].swedish === wordToDelete.swedish && data[key].finnish === wordToDelete.finnish
        );

        if (wordKey) {
          await set(ref(db, `users/${user.userId}/words/${wordKey}`), null);
          setWords((prevWords) => prevWords.filter((word) => word !== wordToDelete));
        }
      }
    } catch (error) {
      console.error("Error deleting word:", error);
    }
  };

  return (
    <div className="app">
      <div className="auth-input">
        {user ? (
          <div className="welcome">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
            <h1>Word List</h1>
            <p>Welcome, {user.email}</p>
          </div>
        ) : (
          <div className="auth-form">
            <h1>Word List</h1>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              ref={passwordRef}
              onKeyDown={handleEmailKeyDown}
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
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSignup={handleSignup}
      />

      {user && (
        <div className="word-input">
          <input type="text" placeholder="Swedish word" value={newSwedish} onChange={(e) => setNewSwedish(e.target.value)} ref={swedishRef} onKeyDown={handleSwedishKeyDown} />
          <input type="text" placeholder="Finnish word" value={newFinnish} onChange={(e) => setNewFinnish(e.target.value)} ref={finnishRef} onKeyDown={handleKeyDown} />
          <button onClick={handleSwapAll}>Swap all</button>
        </div>
      )}

      <div className="word-list">
        {words.map((word, index) => (
          <StudyCard key={index} swedishWord={word.swedish} finnishWord={word.finnish} isSwapped={isSwapped} handleDelete={() => handleDeleteWord(word)} />
        ))}
      </div>
    </div>
  );
}

export default App;
