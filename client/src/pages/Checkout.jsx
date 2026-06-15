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

const GST_RATE = 0.05;
const PLATFORM_FEE = 10;
const DELIVERY_THRESHOLD = 499;
const DELIVERY_CHARGE = 40;

export default function Checkout() {
  const { draft, clearDraft } = useCheckout();
  const navigate = useNavigate();

  if (!draft) return <Navigate to="/menu" replace />;

  const subtotal = draft.total;
  const gstAmount = Math.round(subtotal * GST_RATE * 100) / 100;
  const delivery = subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const grandTotal = Math.round((subtotal + gstAmount + PLATFORM_FEE + delivery) * 100) / 100;

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
          {/* Invoice Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Bill Summary</h2>
            <span className="rounded-full bg-fire/10 px-3 py-1 text-xs font-bold text-amber">TAX INVOICE</span>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            {/* Item Price */}
            <div className="flex justify-between text-muted">
              <span>Item Total</span>
              <span>{money(subtotal)}</span>
            </div>

            {/* GST */}
            <div className="flex justify-between text-muted">
              <span>GST (5%)</span>
              <span>{money(gstAmount)}</span>
            </div>

            {/* Platform Fee */}
            <div className="flex justify-between text-muted">
              <span>Platform Fee</span>
              <span>{money(PLATFORM_FEE)}</span>
            </div>

            {/* Delivery */}
            <div className="flex justify-between text-muted">
              <span>Delivery</span>
              {delivery === 0 ? (
                <span className="font-semibold text-success">FREE</span>
              ) : (
                <span>{money(delivery)}</span>
              )}
            </div>

            {/* Free delivery hint */}
            {delivery > 0 && (
              <p className="rounded-lg bg-fire/5 px-3 py-2 text-xs text-amber">
                {`\u{1F4A1} Add ${money(DELIVERY_THRESHOLD - subtotal)} more for free delivery`}
              </p>
            )}

            {/* Divider */}
            <div className="border-t border-line" />

            {/* Grand Total */}
            <div className="flex justify-between pt-1 font-display text-xl font-bold">
              <span>To Pay</span>
              <span className="text-amber">{money(grandTotal)}</span>
            </div>

            {/* Tax Note */}
            <p className="text-[11px] text-muted/60">
              Inclusive of all taxes. GSTIN: 27AXXXX1234X1Z5
            </p>
          </div>

          <div className="mt-7">
            <RazorpayCheckout orderDetails={draft.orderDetails} total={grandTotal} onSuccess={complete} />
          </div>

          <p className="mt-4 text-center text-xs leading-5 text-muted">
            🔒 Secured by Razorpay · Test mode — no real charges
          </p>
        </motion.aside>
      </div>
    </Page>
  );
}
