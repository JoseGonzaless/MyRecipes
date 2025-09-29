import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <main>
      <Outlet />

      <footer>
        <small>Public area</small>
      </footer>
    </main>
  );
}
