import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Page from '../components/Page';

export default function NotFound() {
  return (
    <Page className="container-app flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <motion.div
        animate={{ rotate: [0, 15, -15, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="text-7xl"
      >
        🍕
      </motion.div>
      <p className="eyebrow mt-6">404</p>
      <h1 className="mt-3 font-display text-5xl font-bold tracking-tight">This slice is missing.</h1>
      <p className="mt-4 text-muted">The page you requested is not on the menu.</p>
      <Link className="btn-primary mt-7" to="/">Return home</Link>
    </Page>
  );
}
