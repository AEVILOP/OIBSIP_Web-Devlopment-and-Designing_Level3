import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Page from '../components/Page';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';
import api, { apiError } from '../utils/axios';
import { money, shortId } from '../utils/format';

const titleFor = (order) => order.pizzaVariety?.name || 'Custom pizza';

const listItem = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.35, delay: i * 0.06 },
  }),
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders')
      .then(({ data }) => setOrders(data.orders))
      .catch((error) => toast.error(apiError(error, 'Unable to load orders')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading label="Finding your orders..." />;

  return (
    <Page className="container-app py-12">
      <p className="eyebrow">Order history</p>
      <h1 className="section-heading">Your pizza timeline.</h1>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card mt-10 p-12 text-center"
        >
          <span className="text-5xl">🍕</span>
          <h2 className="mt-4 font-display text-2xl font-bold">No orders yet.</h2>
          <p className="mt-2 text-muted">Your first excellent decision can start here.</p>
          <Link className="btn-primary mt-6" to="/dashboard">Explore the menu</Link>
        </motion.div>
      ) : (
        <div className="mt-9 space-y-4">
          {orders.map((order, index) => (
            <motion.div key={order._id} custom={index} initial="hidden" animate="visible" variants={listItem}>
              <Link
                to={`/orders/${order._id}`}
                className="flex flex-col justify-between gap-5 rounded-2xl border border-line bg-card p-6 transition-all duration-300 hover:border-fire/40 hover:shadow-glow sm:flex-row sm:items-center"
              >
                <div>
                  <p className="text-xs font-bold text-fire">#{shortId(order._id)}</p>
                  <h2 className="mt-2 font-display text-xl font-bold">{titleFor(order)}</h2>
                  <p className="mt-1 text-sm text-muted">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between gap-7 sm:justify-end">
                  <StatusBadge status={order.status} />
                  <span className="font-display text-lg font-bold">{money(order.totalPrice)}</span>
                  <span className="text-fire transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </Page>
  );
}
