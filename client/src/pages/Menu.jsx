import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Page from '../components/Page';
import Loading from '../components/Loading';
import api, { apiError } from '../utils/axios';
import { money } from '../utils/format';
import { useCheckout } from '../context/CheckoutContext';
import { useAuth } from '../context/AuthContext';

const ITEMS_PER_PAGE = 8;

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.04, ease: 'easeOut' },
  }),
};

const categories = [
  { id: 'all', label: 'All Items', icon: '🍽️' },
  { id: 'pizza', label: 'Pizzas', icon: '🍕' },
  { id: 'combo', label: 'Combos', icon: '🎉' },
  { id: 'drink', label: 'Drinks', icon: '🥤' },
];

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  
  const { setDraft } = useCheckout();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/catalog/pizzas')
      .then(({ data }) => setItems(data.pizzas))
      .catch((error) => toast.error(apiError(error, 'Unable to load the menu')))
      .finally(() => setLoading(false));
  }, []);

  // Reset page when filter changes
  useEffect(() => { setPage(1); }, [filter]);

  const orderItem = (item) => {
    if (!isAuthenticated) {
      toast.error('Please log in to start your order');
      navigate('/login');
      return;
    }
    
    setDraft({
      orderDetails: { orderType: 'menu', pizzaVarietyId: item._id },
      total: item.basePrice,
      title: item.name,
      description: item.description,
      image: item.image,
      selections: [],
    });
    navigate('/checkout');
  };

  const handleCustomize = (item) => {
    if (!isAuthenticated) {
      toast.error('Please log in to customize your order');
      navigate('/login');
      return;
    }
    navigate('/build');
  };

  if (loading) return <Loading label="Loading the menu..." />;

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'pizza') return ['veg', 'non-veg', 'vegan'].includes(item.category);
    return item.category === filter;
  });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <Page className="container-app py-12">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">{isAuthenticated ? `Hello, ${user.name.split(' ')[0]}` : 'Welcome'}</p>
          <h1 className="section-heading">Our Menu.</h1>
          <p className="mt-3 text-muted">House signatures, special combos, and refreshing drinks.</p>
        </div>
        {isAuthenticated && (
          <button className="btn-primary shrink-0" onClick={() => navigate('/build')}>
            🎨 Build a custom pizza
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
              filter === cat.id
                ? 'bg-fire text-white shadow-fire'
                : 'border border-line bg-card text-muted hover:text-cream hover:border-white/20'
            }`}
          >
            <span>{cat.icon}</span> {cat.label}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-muted">{filteredItems.length} items</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${filter}-${page}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {paginatedItems.map((item, index) => {
            const isPizza = ['veg', 'non-veg', 'vegan'].includes(item.category);
            
            return (
              <motion.article
                key={item._id}
                className="group overflow-hidden rounded-2xl border border-line bg-card transition-all duration-300 hover:border-fire/30 hover:shadow-card flex flex-col"
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <div className="relative h-48 overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                  <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md ${
                    item.category === 'non-veg' ? 'bg-danger/80 text-white' : 
                    item.category === 'vegan' ? 'bg-emerald-600/80 text-white' : 
                    item.category === 'drink' ? 'bg-blue-500/80 text-white' :
                    item.category === 'combo' ? 'bg-amber/80 text-ink' :
                    'bg-success/80 text-white'
                  }`}
                  >
                    {item.category.toUpperCase()}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-display text-lg font-bold leading-tight">{item.name}</h2>
                    <span className="shrink-0 rounded-lg bg-fire/10 px-2.5 py-1 font-display font-bold text-amber">
                      {money(item.basePrice)}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-muted flex-1">{item.description}</p>
                  <div className={`mt-5 grid ${isPizza ? 'grid-cols-2' : 'grid-cols-1'} gap-2 shrink-0`}>
                    <button className="btn-primary py-2 text-xs" onClick={() => orderItem(item)}>Add to cart</button>
                    {isPizza && (
                      <button className="btn-secondary py-2 text-xs" onClick={() => handleCustomize(item)}>Customize</button>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-line bg-card px-3 py-2 text-sm font-semibold transition-all hover:border-fire/30 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`h-9 w-9 rounded-lg text-sm font-bold transition-all duration-200 ${
                page === num
                  ? 'bg-fire text-white shadow-fire'
                  : 'border border-line bg-card text-muted hover:text-cream hover:border-white/20'
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-line bg-card px-3 py-2 text-sm font-semibold transition-all hover:border-fire/30 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </Page>
  );
}
