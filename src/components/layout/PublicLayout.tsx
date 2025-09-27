import { Link, Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <main>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/auth">Sign in</Link>
            </li>
          </ul>
        </nav>
      </header>

      <Outlet />

      <footer>
        <small>Public area</small>
      </footer>
    </main>
  );
}
