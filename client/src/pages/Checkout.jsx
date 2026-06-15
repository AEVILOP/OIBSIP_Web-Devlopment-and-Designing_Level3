import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Page from '../components/Page';
import RazorpayCheckout from '../components/RazorpayCheckout';
import { useCheckout } from '../context/CheckoutContext';
import { money } from '../utils/format';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function Checkout() {
  const { draft, clearDraft } = useCheckout();
  const navigate = useNavigate();

  if (!draft) return <Navigate to="/dashboard" replace />;

  const complete = (order) => {
    clearDraft();
    navigate(`/orders/${order._id}`, { replace: true });
  };

  return (
    <Page className="container-app py-12">
      <div className="mx-auto grid max-w-5xl gap-7 lg:grid-cols-[1.2fr_.8fr]">
        <motion.section {...fade(0)}>
          <p className="eyebrow">Checkout</p>
          <h1 className="section-heading">One last look.</h1>
          <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-card">
            {draft.image && (
              <div className="relative h-64 overflow-hidden">
                <img src={draft.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>
            )}
            <div className="p-7">
              <h2 className="font-display text-2xl font-bold">{draft.title}</h2>
              <p className="mt-2 text-muted">{draft.description}</p>
              {draft.selections?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {draft.selections.map((item) => (
                    <span key={item._id} className="rounded-full border border-line bg-ink px-3 py-1.5 text-xs text-muted">
                      {item.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.section>

        <motion.aside className="glass-card h-fit p-7 lg:sticky lg:top-20" {...fade(0.15)}>
          <h2 className="font-display text-xl font-bold">Order summary</h2>
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between text-muted"><span>Pizza</span><span>{money(draft.total)}</span></div>
            <div className="flex justify-between text-muted"><span>Delivery</span><span className="font-semibold text-success">Free</span></div>
            <div className="flex justify-between border-t border-line pt-4 font-display text-xl font-bold">
              <span>Total</span><span className="text-amber">{money(draft.total)}</span>
            </div>
          </div>
          <div className="mt-7">
            <RazorpayCheckout orderDetails={draft.orderDetails} total={draft.total} onSuccess={complete} />
          </div>
          <p className="mt-4 text-center text-xs leading-5 text-muted">
            🔒 Razorpay test mode · No real payment charged
          </p>
        </motion.aside>
      </div>
    </Page>
  );
}
