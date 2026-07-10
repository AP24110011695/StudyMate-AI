import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <div className="content">
        <Navbar />

        <main className="main-content">
          <h1>Dashboard</h1>
        </main>
      </div>
    </div>
  );
}

export default App;