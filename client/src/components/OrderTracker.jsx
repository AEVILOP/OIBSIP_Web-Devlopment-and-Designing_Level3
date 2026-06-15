import { motion } from 'framer-motion';
import { orderLabel } from '../utils/format';

const steps = ['pending', 'order_received', 'in_kitchen', 'sent_to_delivery', 'delivered'];

const icons = {
  pending: '⏳',
  order_received: '✅',
  in_kitchen: '👨‍🍳',
  sent_to_delivery: '🚗',
  delivered: '🎉',
};

export default function OrderTracker({ status }) {
  if (status === 'cancelled') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-danger/30 bg-danger/10 p-6 text-center"
      >
        <span className="text-3xl">❌</span>
        <p className="mt-3 font-semibold text-danger">This order was cancelled.</p>
      </motion.div>
    );
  }

  const activeIndex = steps.indexOf(status);
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-[680px] items-start">
        {steps.map((step, index) => {
          const complete = index < activeIndex;
          const active = index === activeIndex;
          return (
            <div className="relative flex flex-1 flex-col items-center text-center" key={step}>
              {index > 0 && (
                <motion.div
                  className={`absolute right-1/2 top-[18px] h-[2px] w-full origin-left ${
                    index <= activeIndex ? 'bg-fire' : 'bg-line'
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                />
              )}
              <motion.div
                className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-ink text-sm ${
                  complete || active ? 'bg-fire shadow-fire' : 'bg-line'
                } ${active ? 'animate-glow' : ''}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: index * 0.1 }}
              >
                {(complete || active) && <span>{icons[step]}</span>}
              </motion.div>
              <span className={`mt-3 text-xs font-semibold ${complete || active ? 'text-cream' : 'text-muted'}`}>
                {orderLabel(step)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
