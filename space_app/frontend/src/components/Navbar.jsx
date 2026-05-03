export default function Navbar({ onAdd }) {
  return (
    <nav className="navbar">
        <span className="logo">Space Dashboard</span>

        <button className="add-button" onClick={onAdd}>
          Add Data
        </button>
    </nav>
  );
}