import { Link, Outlet } from 'react-router-dom';

import { signOut } from '@/features/auth/api/auth';

export default function PrivateLayout() {
  return (
    <main
      style={{
        width: 'clamp(375px, 95vw, 960px)',
        margin: '0 auto',
        padding: '0 1rem 1rem',
      }}>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/recipes">Recipes</Link>
            </li>
            <li>
              <Link to="/planner">Planner</Link>
            </li>
            <li>
              <Link to="/pantry">Pantry</Link>
            </li>
            <li>
              <Link to="/shopping">Shopping</Link>
            </li>
            <li>
              <button type="button" onClick={signOut}>
                Sign out
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <Outlet />

      <footer>
        <small>Private area</small>
      </footer>
    </main>
  );
}
