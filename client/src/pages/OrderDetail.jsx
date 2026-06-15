import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Page from '../components/Page';
import Loading from '../components/Loading';
import OrderTracker from '../components/OrderTracker';
import StatusBadge from '../components/StatusBadge';
import api, { apiError } from '../utils/axios';
import { money, shortId } from '../utils/format';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async (silent = false) => {
    try {
      const { data } = await api.get(`/orders/${id}`, { _silent: silent });
      setOrder(data.order);
      return data.order;
    } catch (error) {
      if (!silent) toast.error(apiError(error, 'Unable to load this order'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let interval;
    let active = true;
    fetchOrder().then((initial) => {
      if (!active || !initial || ['delivered', 'cancelled'].includes(initial.status)) return;
      interval = setInterval(async () => {
        const fresh = await fetchOrder(true);
        if (fresh && ['delivered', 'cancelled'].includes(fresh.status)) clearInterval(interval);
      }, 8000);
    });
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [fetchOrder]);

  if (loading) return <Loading label="Checking the kitchen..." />;
  if (!order) return (
    <Page className="container-app py-20 text-center">
      <span className="text-5xl">🔍</span>
      <h1 className="mt-4 font-display text-3xl font-bold">Order not found.</h1>
      <Link className="btn-primary mt-6" to="/orders">Back to orders</Link>
    </Page>
  );

  const customItems = order.customization
    ? [
      order.customization.base,
      order.customization.sauce,
      order.customization.cheese,
      ...(order.customization.veggies || []),
      ...(order.customization.meats || []),
    ].filter(Boolean)
    : [];

  return (
    <Page className="container-app py-12">
      <Link className="text-sm text-muted hover:text-cream transition-colors" to="/orders">← All orders</Link>
      <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Order #{shortId(order._id)}</p>
          <h1 className="section-heading">{order.pizzaVariety?.name || 'Your custom pizza'}</h1>
          <p className="mt-2 text-muted">Placed {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <motion.section className="glass-card mt-10 p-6 sm:p-9" {...fade(0.1)}>
        <h2 className="font-display text-xl font-bold">Live order status</h2>
        <p className="mt-2 text-sm text-muted">
          This page checks for kitchen updates every 8 seconds until the order is complete.
        </p>
        <div className="mt-9"><OrderTracker status={order.status} /></div>
      </motion.section>

      <div className="mt-7 grid gap-7 md:grid-cols-2">
        <motion.section className="rounded-2xl border border-line bg-card p-7" {...fade(0.2)}>
          <h2 className="font-display text-xl font-bold">🍕 Inside the box</h2>
          {order.pizzaVariety ? (
            <p className="mt-4 text-muted">{order.pizzaVariety.name}</p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {customItems.map((item) => (
                <span className="rounded-full border border-line bg-ink px-3 py-1.5 text-xs text-muted" key={item.ingredientId}>
                  {item.name}
                </span>
              ))}
            </div>
          )}
        </motion.section>
        <motion.section className="rounded-2xl border border-line bg-card p-7" {...fade(0.3)}>
          <h2 className="font-display text-xl font-bold">💳 Payment</h2>
          <div className="mt-5 flex justify-between text-muted">
            <span>Status</span>
            <span className="flex items-center gap-2 font-semibold text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Paid
            </span>
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-4">
            <span>Total</span>
            <span className="font-display text-xl font-bold text-amber">{money(order.totalPrice)}</span>
          </div>
        </motion.section>
      </div>
    </Page>
  );
}
