// Paste toàn bộ file này vào JDoodle ReactJS (https://www.jdoodle.com/reactjs)
// Thay API_BASE = 'http://localhost:5000' (hoặc URL deploy của bạn)

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

function App(){
  // CONFIG - CHANGE THIS to your backend URL
  const API_BASE = "http://localhost:5000"; // <-- Thay URL backend ở đây

  // General users
  const [books, setBooks] = useState(null);
  const [isbnQuery, setIsbnQuery] = useState("");
  const [isbnResult, setIsbnResult] = useState(null);
  const [authorQuery, setAuthorQuery] = useState("");
  const [authorResult, setAuthorResult] = useState(null);
  const [titleQuery, setTitleQuery] = useState("");
  const [titleResult, setTitleResult] = useState(null);
  const [reviewIsbnQuery, setReviewIsbnQuery] = useState("");
  const [reviewResult, setReviewResult] = useState(null);

  // Registered users
  const [regUser, setRegUser] = useState({username:"", password:""});
  const [loginUser, setLoginUser] = useState({username:"", password:""});
  const [tokenUser, setTokenUser] = useState(null); // here tokenUser is simply username (backend here uses simple username checks)
  const [reviewText, setReviewText] = useState("");

  const [message, setMessage] = useState("");

  useEffect(()=>{
    fetchAllBooks();
  }, []);

  async function fetchAllBooks(){
    try {
      const res = await fetch(`${API_BASE}/books`);
      const data = await res.json();
      setBooks(data);
    } catch(err){
      console.error(err);
      setBooks({ error: "Could not fetch — check API_BASE and CORS" });
    }
  }

  async function fetchByIsbn(){
    try {
      const res = await fetch(`${API_BASE}/books/isbn/${encodeURIComponent(isbnQuery)}`);
      const data = await res.json();
      setIsbnResult(data);
    } catch(err){
      console.error(err);
    }
  }

  async function fetchByAuthor(){
    try {
      const res = await fetch(`${API_BASE}/books/author/${encodeURIComponent(authorQuery)}`);
      const data = await res.json();
      setAuthorResult(data);
    } catch(err){
      console.error(err);
    }
  }

  async function fetchByTitle(){
    try {
      const res = await fetch(`${API_BASE}/books/title/${encodeURIComponent(titleQuery)}`);
      const data = await res.json();
      setTitleResult(data);
    } catch(err){
      console.error(err);
    }
  }

  async function fetchReview(){
    try {
      const res = await fetch(`${API_BASE}/books/review/${encodeURIComponent(reviewIsbnQuery)}`);
      const data = await res.json();
      setReviewResult(data);
    } catch(err){
      console.error(err);
    }
  }

  // Task 6: Register
  async function handleRegister(){
    try {
      const res = await fetch(`${API_BASE}/register`,{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(regUser)
      });
      const data = await res.json();
      setMessage(JSON.stringify(data));
    } catch(err){
      console.error(err);
    }
  }

  // Task 7: Login
  async function handleLogin(){
    try {
      const res = await fetch(`${API_BASE}/login`,{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(loginUser)
      });
      const data = await res.json();
      if(res.ok){
        // backend in lab expects just username; we store username as "token"
        setTokenUser(loginUser.username);
        setMessage("Login successful");
      } else {
        setMessage(JSON.stringify(data));
      }
    } catch(err){
      console.error(err);
    }
  }

  // Task 8: Add/Modify review (logged in user)
  async function handleAddModifyReview(){
    if(!tokenUser){
      setMessage("Please login first");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/review/${encodeURIComponent(reviewIsbnQuery)}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ username: tokenUser, review: reviewText })
      });
      const data = await res.json();
      setMessage(JSON.stringify(data));
      setReviewResult(data.reviews || null);
    } catch(err){
      console.error(err);
    }
  }

  // Task 9: Delete review (logged in user)
  async function handleDeleteReview(){
    if(!tokenUser){
      setMessage("Please login first");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/review/${encodeURIComponent(reviewIsbnQuery)}`, {
        method: "DELETE",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ username: tokenUser })
      });
      const data = await res.json();
      setMessage(JSON.stringify(data));
      setReviewResult(data.reviews || null);
    } catch(err){
      console.error(err);
    }
  }

  return (
    <div style={{ padding:20, fontFamily:"system-ui, Arial, sans-serif" }}>
      <h1>Book Review Lab — Frontend (Tasks 1–9)</h1>
      <p style={{color:"#555"}}>API base: <code>{API_BASE}</code></p>

      <section style={{marginBottom:18, padding:12, border:"1px solid #eee", borderRadius:8}}>
        <h2> Get all books</h2>
        <button onClick={fetchAllBooks}>Refresh Book List</button>
        <div style={{marginTop:8}}>
          <pre style={{whiteSpace:"pre-wrap"}}>{books ? JSON.stringify(books, null, 2) : "Loading..."}</pre>
        </div>
      </section>

      <section style={{marginBottom:18, padding:12, border:"1px solid #eee", borderRadius:8}}>
        <h2> Get book by ISBN</h2>
        <input value={isbnQuery} onChange={e=>setIsbnQuery(e.target.value)} placeholder="Enter ISBN (e.g. 9780140449136)" />
        <button onClick={fetchByIsbn} style={{marginLeft:8}}>Fetch ISBN</button>
        <pre>{isbnResult ? JSON.stringify(isbnResult, null, 2) : ""}</pre>
      </section>

      <section style={{marginBottom:18, padding:12, border:"1px solid #eee", borderRadius:8}}>
        <h2> Get books by author</h2>
        <input value={authorQuery} onChange={e=>setAuthorQuery(e.target.value)} placeholder="Enter author (case-insensitive)" />
        <button onClick={fetchByAuthor} style={{marginLeft:8}}>Fetch by Author</button>
        <pre>{authorResult ? JSON.stringify(authorResult, null, 2) : ""}</pre>
      </section>

      <section style={{marginBottom:18, padding:12, border:"1px solid #eee", borderRadius:8}}>
        <h2> Get books by title</h2>
        <input value={titleQuery} onChange={e=>setTitleQuery(e.target.value)} placeholder="Enter title (case-insensitive)" />
        <button onClick={fetchByTitle} style={{marginLeft:8}}>Fetch by Title</button>
        <pre>{titleResult ? JSON.stringify(titleResult, null, 2) : ""}</pre>
      </section>

      <section style={{marginBottom:18, padding:12, border:"1px solid #eee", borderRadius:8}}>
        <h2> Get book review</h2>
        <input value={reviewIsbnQuery} onChange={e=>setReviewIsbnQuery(e.target.value)} placeholder="Enter ISBN for review" />
        <button onClick={fetchReview} style={{marginLeft:8}}>Fetch Review</button>
        <pre>{reviewResult ? JSON.stringify(reviewResult, null, 2) : ""}</pre>
      </section>

      <hr />

      <section style={{marginBottom:18, padding:12, border:"1px solid #eee", borderRadius:8}}>
        <h2> Register (create new user)</h2>
        <input placeholder="username" value={regUser.username} onChange={e=>setRegUser({...regUser, username:e.target.value})} />
        <input placeholder="password" type="password" value={regUser.password} onChange={e=>setRegUser({...regUser, password:e.target.value})} style={{marginLeft:8}} />
        <button onClick={handleRegister} style={{marginLeft:8}}>Register</button>
      </section>

      <section style={{marginBottom:18, padding:12, border:"1px solid #eee", borderRadius:8}}>
        <h2> Login as Registered user</h2>
        <input placeholder="username" value={loginUser.username} onChange={e=>setLoginUser({...loginUser, username:e.target.value})} />
        <input placeholder="password" type="password" value={loginUser.password} onChange={e=>setLoginUser({...loginUser, password:e.target.value})} style={{marginLeft:8}} />
        <button onClick={handleLogin} style={{marginLeft:8}}>Login</button>
        <div style={{marginTop:8}}>Logged in as: <strong>{tokenUser || "None"}</strong></div>
      </section>

      <section style={{marginBottom:18, padding:12, border:"1px solid #eee", borderRadius:8}}>
        <h2> Add/Modify / Delete review (must be logged in)</h2>
        <div style={{marginBottom:8}}>
          <input placeholder="ISBN for review" value={reviewIsbnQuery} onChange={e=>setReviewIsbnQuery(e.target.value)} />
        </div>
        <div style={{marginBottom:8}}>
          <textarea placeholder="Write review text here" value={reviewText} onChange={e=>setReviewText(e.target.value)} style={{width:"100%",height:80}} />
        </div>
        <button onClick={handleAddModifyReview}>Add / Modify Review</button>
        <button onClick={handleDeleteReview} style={{marginLeft:8}}>Delete My Review</button>
        <div style={{marginTop:8}}><strong>Latest message:</strong> {message}</div>
      </section>

      <div style={{ marginTop: 16, color:"#444" }}>
        <strong>How to use:</strong> 1) set <code>API_BASE</code> to your backend URL. 2) Use panels above and take screenshots for each Task.
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
