import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="search-box">
        <input type="text" placeholder="Search your PDFs..." />
      </div>

      <div className="profile">
        <span>👤 Ayush</span>
      </div>
    </header>
  );
}

export default Navbar;