import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <main
      style={{
        width: 'clamp(375px, 95vw, 960px)',
        margin: '0 auto',
        padding: '0 1rem 1rem',
      }}>
      <Outlet />

      <footer>
        <small>Public area</small>
      </footer>
    </main>
  );
}
