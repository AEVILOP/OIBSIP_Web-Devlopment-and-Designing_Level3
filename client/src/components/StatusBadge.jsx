import { orderLabel } from '../utils/format';

const config = {
  pending: { dot: 'bg-amber', bg: 'bg-amber/10 text-amber border-amber/20' },
  order_received: { dot: 'bg-orange-400', bg: 'bg-orange-400/10 text-orange-300 border-orange-400/20' },
  in_kitchen: { dot: 'bg-blue-400 animate-pulse-soft', bg: 'bg-blue-400/10 text-blue-300 border-blue-400/20' },
  sent_to_delivery: { dot: 'bg-purple-400 animate-pulse-soft', bg: 'bg-purple-400/10 text-purple-300 border-purple-400/20' },
  delivered: { dot: 'bg-success', bg: 'bg-success/10 text-success border-success/20' },
  cancelled: { dot: 'bg-danger', bg: 'bg-danger/10 text-danger border-danger/20' },
};

export default function StatusBadge({ status }) {
  const { dot, bg } = config[status] || { dot: 'bg-muted', bg: 'bg-line text-cream border-line' };
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {orderLabel(status)}
    </span>
  );
}
