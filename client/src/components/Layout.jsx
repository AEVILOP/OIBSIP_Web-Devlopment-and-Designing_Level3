import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="border-t border-line/50 bg-surface/30">
        <div className="container-app flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
          <p className="font-display text-sm font-bold tracking-tight">
            PIZZA<span className="text-fire">APP</span>
          </p>
          <p className="text-xs text-muted">
            Built hot, served fast · © {new Date().getFullYear()}
          </p>
          <div className="flex gap-5">
            <span className="text-xs text-muted/60 transition-colors hover:text-cream cursor-default">React</span>
            <span className="text-xs text-muted/60">·</span>
            <span className="text-xs text-muted/60 transition-colors hover:text-cream cursor-default">MongoDB</span>
            <span className="text-xs text-muted/60">·</span>
            <span className="text-xs text-muted/60 transition-colors hover:text-cream cursor-default">Razorpay</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
