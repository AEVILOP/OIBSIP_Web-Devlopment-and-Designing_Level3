export const money = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(value || 0);

export const orderLabel = (status) => ({
  pending: 'Pending',
  order_received: 'Order received',
  in_kitchen: 'In kitchen',
  sent_to_delivery: 'Sent to delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}[status] || status);

export const shortId = (id = '') => id.slice(-8).toUpperCase();
