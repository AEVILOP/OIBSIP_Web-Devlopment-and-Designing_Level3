import { useState } from 'react';
import toast from 'react-hot-toast';
import api, { apiError } from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { money } from '../utils/format';

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

export default function RazorpayCheckout({ orderDetails, total, onSuccess }) {
  const [isPaying, setIsPaying] = useState(false);
  const { user } = useAuth();

  const beginPayment = async () => {
    setIsPaying(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('SCRIPT_UNAVAILABLE');

      const { data } = await api.post('/orders/create-razorpay-order', orderDetails);
      const checkout = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'PizzaApp',
        description: orderDetails.orderType === 'custom' ? 'Custom pizza' : 'Menu pizza',
        order_id: data.razorpayOrderId,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: '#FF4500' },
        handler: async (payment) => {
          try {
            const response = await api.post('/orders/confirm', {
              ...orderDetails,
              razorpayOrderId: payment.razorpay_order_id,
              razorpayPaymentId: payment.razorpay_payment_id,
              razorpaySignature: payment.razorpay_signature,
            });
            toast.success('Payment confirmed. Your pizza is on its way.');
            onSuccess(response.data.order);
          } catch (error) {
            toast.error(apiError(error, 'Payment succeeded, but order confirmation needs attention'));
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
            toast.error('Payment was cancelled. You can retry when ready.');
          },
        },
      });
      checkout.on('payment.failed', () => {
        setIsPaying(false);
        toast.error('Payment failed. Please try again.');
      });
      checkout.open();
    } catch (error) {
      setIsPaying(false);
      if (error.message === 'SCRIPT_UNAVAILABLE') {
        toast.error('Payment service unavailable. Try again.');
      } else {
        toast.error(apiError(error, 'Unable to start payment'));
      }
    }
  };

  return (
    <button className="btn-primary w-full" disabled={isPaying} onClick={beginPayment}>
      {isPaying ? 'Opening secure payment...' : `Pay ${money(total)}`}
    </button>
  );
}
