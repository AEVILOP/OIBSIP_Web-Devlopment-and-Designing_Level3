import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Page from '../components/Page';
import Loading from '../components/Loading';
import api, { apiError } from '../utils/axios';
import { money } from '../utils/format';

const cards = [
  { key: 'totalOrdersToday', label: 'Orders today', hint: 'Live count', icon: '📦', gradient: 'from-fire/10 to-transparent' },
  { key: 'revenueToday', label: 'Revenue today', hint: 'Paid orders', icon: '💰', gradient: 'from-amber/10 to-transparent' },
  { key: 'pendingOrders', label: 'Active orders', hint: 'Needs progress', icon: '🔥', gradient: 'from-blue-500/10 to-transparent' },
  { key: 'lowStockItems', label: 'Low stock', hint: 'Needs attention', icon: '⚠️', gradient: 'from-danger/10 to-transparent' },
];

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data.stats))
      .catch((error) => toast.error(apiError(error, 'Unable to load dashboard stats')));
  }, []);

  if (!stats) return <Loading label="Building the overview..." />;

  return (
    <Page className="container-app py-12">
      <p className="eyebrow">Operations</p>
      <h1 className="section-heading">Kitchen control.</h1>
      <p className="mt-3 text-muted">Today at a glance, with the important numbers first.</p>

      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ key, label, hint, icon, gradient }, index) => (
          <motion.article
            className={`glass-card relative overflow-hidden p-6 bg-gradient-to-br ${gradient}`}
            key={key}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariant}
          >
            <span className="text-2xl">{icon}</span>
            <p className="mt-3 text-sm text-muted">{label}</p>
            <p className={`mt-2 font-display text-4xl font-bold ${key === 'lowStockItems' && stats[key] ? 'text-danger' : ''}`}>
              {key === 'revenueToday' ? money(stats[key]) : stats[key]}
            </p>
            <p className="mt-2 text-xs text-muted">{hint}</p>
          </motion.article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Link to="/admin/orders" className="group rounded-2xl border border-line bg-card p-8 transition-all duration-300 hover:border-fire/40 hover:shadow-glow">
          <p className="eyebrow">Fulfilment</p>
          <h2 className="mt-3 font-display text-2xl font-bold">
            Manage orders <span className="inline-block text-fire transition-transform duration-200 group-hover:translate-x-1">→</span>
          </h2>
          <p className="mt-3 text-muted">Move paid orders through the kitchen and delivery workflow.</p>
        </Link>
        <Link to="/admin/inventory" className="group rounded-2xl border border-line bg-card p-8 transition-all duration-300 hover:border-fire/40 hover:shadow-glow">
          <p className="eyebrow">Stock room</p>
          <h2 className="mt-3 font-display text-2xl font-bold">
            Review inventory <span className="inline-block text-fire transition-transform duration-200 group-hover:translate-x-1">→</span>
          </h2>
          <p className="mt-3 text-muted">Adjust stock counts and catch low ingredients before service.</p>
        </Link>
      </div>
    </Page>
  );
}
