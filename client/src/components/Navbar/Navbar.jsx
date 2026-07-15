import "./Navbar.css";
import { Search, Bell } from "lucide-react";

function Navbar({ search, setSearch }) {
  return (
    <header className="navbar">
      <div className="search">
        <Search size={18}/>
        <input
          className="form-input"
          style={{ paddingLeft: '40px', borderRadius: '24px' }}
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="Search PDFs..."
        />
        {/* Absolute position search icon inside via CSS or adjust padding */}
      </div>

      <div className="right">
        <Bell size={20}/>
        <img
          src="https://i.pravatar.cc/40"
          alt=""
        />
      </div>
    </header>
  )
}

export default Navbar;