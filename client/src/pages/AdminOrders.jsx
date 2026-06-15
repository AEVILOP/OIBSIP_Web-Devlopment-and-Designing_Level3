import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Page from '../components/Page';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';
import api, { apiError } from '../utils/axios';
import { money, orderLabel, shortId } from '../utils/format';

const statuses = ['all', 'pending', 'order_received', 'in_kitchen', 'sent_to_delivery', 'delivered', 'cancelled'];
const transitions = {
  pending: ['order_received', 'cancelled'],
  order_received: ['in_kitchen', 'cancelled'],
  in_kitchen: ['sent_to_delivery', 'cancelled'],
  sent_to_delivery: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

const itemName = (order) => order.pizzaVariety?.name || 'Custom pizza';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const loadOrders = useCallback(() => {
    setLoading(true);
    const query = filter === 'all' ? '' : `?status=${filter}`;
    api.get(`/admin/orders${query}`)
      .then(({ data }) => setOrders(data.orders))
      .catch((error) => toast.error(apiError(error, 'Unable to load orders')))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(loadOrders, [loadOrders]);

  const updateStatus = async (order, newStatus) => {
    if (!newStatus) return;
    setUpdating(order._id);
    try {
      const { data } = await api.patch(`/admin/orders/${order._id}/status`, { newStatus });
      setOrders((current) => current.map((item) => item._id === order._id ? { ...item, status: data.order.status } : item));
      toast.success(`Order moved to ${orderLabel(newStatus)}`);
    } catch (error) {
      toast.error(apiError(error, 'Unable to update status'));
    } finally {
      setUpdating(null);
    }
  };

  return (
    <Page className="container-app py-12">
      <p className="eyebrow">Fulfilment board</p>
      <h1 className="section-heading">All orders.</h1>

      {/* Filter Pills */}
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
              filter === status
                ? 'bg-fire text-white shadow-fire'
                : 'border border-line bg-card text-muted hover:text-cream hover:border-white/20'
            }`}
          >
            {status === 'all' ? 'All' : orderLabel(status)}
          </button>
        ))}
      </div>

      {loading ? <Loading label="Refreshing orders..." /> : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 overflow-x-auto rounded-2xl border border-line"
        >
          <table className="w-full min-w-[950px] border-collapse bg-card text-left text-sm">
            <thead className="bg-ink/80 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-line transition-colors hover:bg-white/[.02]">
                  <td className="p-4 font-mono text-xs text-fire">#{shortId(order._id)}</td>
                  <td className="p-4">
                    <strong className="block">{order.user?.name || 'Deleted user'}</strong>
                    <span className="text-xs text-muted">{order.user?.email}</span>
                  </td>
                  <td className="p-4">{itemName(order)}</td>
                  <td className="p-4 font-semibold">{money(order.totalPrice)}</td>
                  <td className="p-4"><StatusBadge status={order.status} /></td>
                  <td className="p-4 text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    {transitions[order.status].length ? (
                      <select
                        className="rounded-lg border border-line bg-ink px-3 py-2 text-xs transition-colors focus:border-fire focus:outline-none"
                        value=""
                        disabled={updating === order._id}
                        onChange={(event) => updateStatus(order, event.target.value)}
                      >
                        <option value="">{updating === order._id ? 'Updating...' : 'Next status'}</option>
                        {transitions[order.status].map((next) => <option value={next} key={next}>{orderLabel(next)}</option>)}
                      </select>
                    ) : <span className="text-xs text-muted">Final state</span>}
                  </td>
                </tr>
              ))}
              {!orders.length && (
                <tr><td colSpan="7" className="p-10 text-center text-muted">No orders match this filter.</td></tr>
              )}
            </tbody>
          </table>
        </motion.div>
      )}
    </Page>
  );
}
