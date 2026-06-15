import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const navClass = ({ isActive }) => `relative text-sm font-semibold transition-colors duration-200 ${
  isActive ? 'text-fire' : 'text-muted hover:text-cream'
}`;

const underline = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  exit: { scaleX: 0 },
  transition: { duration: 0.2 },
};

function NavItem({ to, children }) {
  return (
    <NavLink className={navClass} to={to}>
      {({ isActive }) => (
        <>
          {children}
          {isActive && (
            <motion.span
              className="absolute -bottom-1 left-0 h-[2px] w-full origin-left rounded-full bg-fire"
              layoutId="nav-underline"
              {...underline}
            />
          )}
        </>
      )}
    </NavLink>
  );
}

function UserAvatar({ name }) {
  const initial = (name || '?')[0].toUpperCase();
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-fire/15 text-xs font-bold text-fire">
      {initial}
    </span>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const signOut = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  const userLinks = (
    <>
      <NavItem to="/menu">Menu</NavItem>
      <NavItem to="/build">Build</NavItem>
      <NavItem to="/orders">Orders</NavItem>
    </>
  );

  const adminLinks = (
    <>
      <NavItem to="/admin">Overview</NavItem>
      <NavItem to="/admin/orders">Orders</NavItem>
      <NavItem to="/admin/inventory">Inventory</NavItem>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/[.04] bg-ink/90 backdrop-blur-2xl">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link
          to={user?.role === 'admin' ? '/admin' : '/'}
          className="font-display text-xl font-extrabold tracking-tight"
        >
          PIZZA<span className="text-fire">APP</span>
        </Link>

        {/* Desktop Nav */}
        {isAuthenticated ? (
          <div className="hidden items-center gap-7 sm:flex">
            {user.role === 'admin' ? adminLinks : userLinks}
            <div className="flex items-center gap-3">
              <UserAvatar name={user.name} />
              <button
                className="text-sm font-semibold text-muted transition-colors hover:text-cream"
                onClick={signOut}
                aria-label="Log out"
              >
                Log out
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden items-center gap-5 sm:flex">
            <NavItem to="/menu">Menu</NavItem>
            <div className="h-4 w-px bg-white/10" />
            <Link className="text-sm font-semibold text-muted hover:text-cream" to="/login">Log in</Link>
            <Link className="btn-primary px-4 py-2 text-sm" to="/register">Get started</Link>
          </div>
        )}

        {/* Mobile Hamburger */}
        <button
          className="relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-1.5 sm:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <motion.span
            className="block h-[2px] w-5 rounded-full bg-cream"
            animate={mobileOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block h-[2px] w-5 rounded-full bg-cream"
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="block h-[2px] w-5 rounded-full bg-cream"
            animate={mobileOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-line bg-surface sm:hidden"
          >
            <nav className="container-app flex flex-col gap-4 py-5" onClick={closeMobile}>
              {isAuthenticated ? (
                <>
                  {user.role === 'admin' ? (
                    <>
                      <NavLink className={navClass} to="/admin">Overview</NavLink>
                      <NavLink className={navClass} to="/admin/orders">Orders</NavLink>
                      <NavLink className={navClass} to="/admin/inventory">Inventory</NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink className={navClass} to="/menu">Menu</NavLink>
                      <NavLink className={navClass} to="/build">Build</NavLink>
                      <NavLink className={navClass} to="/orders">Orders</NavLink>
                    </>
                  )}
                  <hr className="border-line" />
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user.name} />
                    <span className="text-sm text-muted">{user.name}</span>
                  </div>
                  <button
                    className="w-fit text-sm font-semibold text-muted hover:text-cream"
                    onClick={signOut}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <NavLink className={navClass} to="/menu">Menu</NavLink>
                  <hr className="border-line" />
                  <Link className="text-sm font-semibold text-muted hover:text-cream" to="/login">Log in</Link>
                  <Link className="btn-primary w-fit px-4 py-2 text-sm" to="/register">Get started</Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
