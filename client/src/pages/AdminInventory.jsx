import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Page from '../components/Page';
import Loading from '../components/Loading';
import api, { apiError } from '../utils/axios';

export default function AdminInventory() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [stock, setStock] = useState('');

  useEffect(() => {
    api.get('/admin/inventory')
      .then(({ data }) => setIngredients(data.ingredients))
      .catch((error) => toast.error(apiError(error, 'Unable to load inventory')))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (item) => {
    setEditing(item._id);
    setStock(String(item.stock));
  };

  const save = async (item) => {
    try {
      const value = Number(stock);
      if (!Number.isInteger(value) || value < 0) {
        toast.error('Stock must be a non-negative whole number');
        return;
      }
      const { data } = await api.patch(`/admin/inventory/${item._id}`, { stock: value });
      setIngredients((current) => current.map((entry) => entry._id === item._id ? data.ingredient : entry));
      setEditing(null);
      toast.success(`${item.name} stock updated`);
    } catch (error) {
      toast.error(apiError(error, 'Unable to update stock'));
    }
  };

  if (loading) return <Loading label="Counting ingredients..." />;

  const lowCount = ingredients.filter((item) => item.stock <= item.threshold).length;
  const stockPercent = (item) => Math.min(100, Math.round((item.stock / Math.max(item.threshold * 5, 100)) * 100));

  return (
    <Page className="container-app py-12">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Stock room</p>
          <h1 className="section-heading">Ingredient inventory.</h1>
        </div>
        <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${lowCount ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-success/10 text-success border border-success/20'}`}>
          <span className={`h-2 w-2 rounded-full ${lowCount ? 'bg-danger animate-pulse-soft' : 'bg-success'}`} />
          {lowCount ? `${lowCount} low stock item${lowCount === 1 ? '' : 's'}` : 'Stock levels healthy'}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 overflow-x-auto rounded-2xl border border-line"
      >
        <table className="w-full min-w-[820px] border-collapse bg-card text-left text-sm">
          <thead className="bg-ink/80 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="p-4">Ingredient</th>
              <th className="p-4">Category</th>
              <th className="p-4">Stock</th>
              <th className="p-4 w-36">Level</th>
              <th className="p-4">Status</th>
              <th className="p-4">Edit</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((item) => {
              const low = item.stock <= item.threshold;
              const pct = stockPercent(item);
              return (
                <tr key={item._id} className={`border-t border-line transition-colors hover:bg-white/[.02] ${low ? 'border-l-[3px] border-l-danger' : ''}`}>
                  <td className="p-4 font-semibold">
                    <span className="mr-3 text-lg">{item.imageEmoji}</span>{item.name}
                  </td>
                  <td className="p-4 capitalize text-muted">{item.category}</td>
                  <td className="p-4">
                    {editing === item._id
                      ? <input className="w-24 rounded-lg border border-fire bg-ink px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fire/40" type="number" min="0" step="1" value={stock} onChange={(event) => setStock(event.target.value)} autoFocus />
                      : <strong className={low ? 'text-danger' : ''}>{item.stock}</strong>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                        <motion.div
                          className={`h-full rounded-full ${
                            item.stock === 0 ? 'bg-muted' : low ? 'bg-danger' : 'bg-success'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs text-muted">{item.threshold}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                      item.stock === 0 ? 'border-line bg-line/50 text-muted' : low ? 'border-danger/20 bg-danger/10 text-danger' : 'border-success/20 bg-success/10 text-success'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        item.stock === 0 ? 'bg-muted' : low ? 'bg-danger animate-pulse-soft' : 'bg-success'
                      }`} />
                      {item.stock === 0 ? 'Out of stock' : low ? 'Low stock' : 'Available'}
                    </span>
                  </td>
                  <td className="p-4">
                    {editing === item._id ? (
                      <div className="flex gap-2">
                        <button className="rounded-lg bg-fire px-3 py-2 text-xs font-bold text-white transition-colors hover:brightness-110" onClick={() => save(item)}>Save</button>
                        <button className="rounded-lg border border-line px-3 py-2 text-xs transition-colors hover:border-white/20" onClick={() => setEditing(null)}>Cancel</button>
                      </div>
                    ) : (
                      <button className="rounded-lg border border-line px-3 py-2 text-xs font-semibold transition-all hover:border-fire/50 hover:shadow-glow" onClick={() => startEdit(item)}>
                        Edit stock
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </Page>
  );
}
