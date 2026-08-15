import './globals.css';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'Zenbu',
  description: 'A personal catalog for anime, manga, light novels, and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
