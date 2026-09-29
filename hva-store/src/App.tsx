import "./App.css";

function App() {
  return (
    <div className="wrapper">
      <header className="header">
        <span className="header-logo">HvA Store</span>
      </header>

      <main className="page">
        <h1 className="page-title">Welcome to HvA Store</h1>
        <p className="page-subtitle">Your products will appear here soon.</p>
      </main>

      <footer className="footer">
        &copy; {new Date().getFullYear()} HvA Store
      </footer>
    </div>
  );
}

export default App;