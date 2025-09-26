import { Outlet, Link } from "react-router-dom";
import "../styles/global.css";

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Planner</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/pantry">Pantry</Link>
        <Link to="/shopping">Shopping</Link>
      </nav>

      <Outlet />
    </>
  );
}
