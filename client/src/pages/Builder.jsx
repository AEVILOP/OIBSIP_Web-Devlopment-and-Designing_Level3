import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Page from '../components/Page';
import Loading from '../components/Loading';
import PizzaPreview from '../components/PizzaPreview';
import api, { apiError } from '../utils/axios';
import { money } from '../utils/format';
import { useCheckout } from '../context/CheckoutContext';

const steps = [
  { key: 'base', label: 'Base', hint: 'Choose your foundation', icon: '◉' },
  { key: 'sauce', label: 'Sauce', hint: 'Set the flavor direction', icon: '🍅' },
  { key: 'cheese', label: 'Cheese', hint: 'Pick the melt', icon: '🧀' },
  { key: 'toppings', label: 'Veggies', hint: 'Layer on your favorites', icon: '🥬' },
  { key: 'review', label: 'Review', hint: 'Make sure it feels right', icon: '✨' },
];

function IngredientChoice({ ingredient, selected, onClick, multiple = false }) {
  const unavailable = !ingredient.isAvailable || ingredient.stock <= 0;
  return (
    <motion.button
      type="button"
      disabled={unavailable}
      onClick={onClick}
      layout
      whileTap={{ scale: 0.97 }}
      className={`relative flex min-h-24 w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 ${
        selected
          ? 'border-fire/60 bg-fire/8 shadow-glow'
          : 'border-line bg-card hover:border-white/15'
      } ${unavailable ? 'cursor-not-allowed grayscale opacity-40' : ''}`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xl">
        {ingredient.imageEmoji}
      </span>
      <span className="min-w-0">
        <span className="block font-semibold">{ingredient.name}</span>
        <span className="mt-1 block text-xs text-muted">
          {ingredient.price ? `+${money(ingredient.price)}` : 'Included'}
        </span>
      </span>
      <span className={`ml-auto flex h-5 w-5 shrink-0 items-center justify-center border-2 ${
        multiple ? 'rounded-md' : 'rounded-full'
      } transition-all ${selected ? 'border-fire bg-fire' : 'border-muted/50'}`}>
        {selected && <span className="text-[10px] text-white">✓</span>}
      </span>
      {unavailable && (
        <span className="absolute right-3 top-2 rounded-full bg-danger/20 px-2 py-1 text-[10px] font-bold text-danger">
          Out of stock
        </span>
      )}
    </motion.button>
  );
}

export default function Builder() {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [invalid, setInvalid] = useState(false);
  const [selection, setSelection] = useState({
    base: null,
    sauce: null,
    cheese: null,
    veggies: [],
    meats: [],
  });
  const { setDraft } = useCheckout();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/catalog/ingredients')
      .then(({ data }) => setGrouped(data.grouped))
      .catch((error) => toast.error(apiError(error, 'Unable to load ingredients')))
      .finally(() => setLoading(false));
  }, []);

  const selectedToppings = [...selection.veggies, ...selection.meats];
  const total = useMemo(() => {
    const all = [selection.base, selection.sauce, selection.cheese, ...selectedToppings].filter(Boolean);
    return 199 + all.reduce((sum, item) => sum + item.price, 0);
  }, [selection]);

  const chooseSingle = (key, item) => {
    setSelection((current) => ({ ...current, [key]: item }));
    setInvalid(false);
  };

  const toggleMany = (key, item) => {
    setSelection((current) => {
      const exists = current[key].some((selected) => selected._id === item._id);
      return {
        ...current,
        [key]: exists
          ? current[key].filter((selected) => selected._id !== item._id)
          : [...current[key], item],
      };
    });
  };

  const next = () => {
    const key = steps[step].key;
    if (['base', 'sauce', 'cheese'].includes(key) && !selection[key]) {
      setInvalid(true);
      toast.error(`Choose a ${key} before continuing`);
      return;
    }
    setInvalid(false);
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const checkout = () => {
    const selections = [
      selection.base,
      selection.sauce,
      selection.cheese,
      ...selection.veggies,
      ...selection.meats,
    ].filter(Boolean);
    setDraft({
      orderDetails: {
        orderType: 'custom',
        baseId: selection.base._id,
        sauceId: selection.sauce._id,
        cheeseId: selection.cheese._id,
        veggieIds: selection.veggies.map((item) => item._id),
        meatIds: selection.meats.map((item) => item._id),
      },
      total,
      title: 'Your custom pizza',
      description: 'Built layer by layer, exactly as selected.',
      selections,
    });
    navigate('/checkout');
  };

  if (loading) return <Loading label="Preparing the builder..." />;

  const currentKey = steps[step].key;
  return (
    <Page className="container-app py-10">
      {/* Progress Bar */}
      <div className="mb-10">
        <p className="eyebrow">Custom studio</p>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {steps.map((item, index) => (
            <button key={item.key} className="group text-left" onClick={() => index < step && setStep(index)}>
              <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-line">
                <motion.div
                  className="h-full rounded-full bg-fire"
                  initial={{ width: 0 }}
                  animate={{ width: index <= step ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className={`hidden items-center gap-1.5 text-xs font-semibold sm:flex ${index <= step ? 'text-cream' : 'text-muted'}`}>
                <span>{item.icon}</span> {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid items-start gap-9 lg:grid-cols-[.9fr_1.1fr]">
        {/* Pizza Preview */}
        <div className="sticky top-20">
          <PizzaPreview
            sauce={selection.sauce?.name}
            cheese={selection.cheese?.name}
            toppings={selectedToppings.map((item) => item.name)}
          />
          <div className="glass-card mx-auto mt-3 flex max-w-md items-center justify-between p-5">
            <div>
              <p className="text-xs text-muted">Current total</p>
              <p className="font-display text-2xl font-bold">{money(total)}</p>
            </div>
            <p className="max-w-44 text-right text-xs leading-5 text-muted">Base price {money(199)} plus your selected ingredients</p>
          </div>
        </div>

        {/* Selection Panel */}
        <AnimatePresence mode="wait">
          <motion.section
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className={`glass-card p-6 sm:p-8 ${invalid ? 'border-danger' : ''}`}
          >
            <p className="eyebrow">Step {step + 1} of {steps.length}</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">{steps[step].label}</h1>
            <p className="mt-2 text-muted">{steps[step].hint}</p>

            <div className="mt-7">
              {['base', 'sauce', 'cheese'].includes(currentKey) && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {(grouped[currentKey] || []).map((item) => (
                    <IngredientChoice
                      key={item._id}
                      ingredient={item}
                      selected={selection[currentKey]?._id === item._id}
                      onClick={() => chooseSingle(currentKey, item)}
                    />
                  ))}
                </div>
              )}

              {currentKey === 'toppings' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="mb-3 font-display text-lg font-bold">🥬 Veggies</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(grouped.veggie || []).map((item) => (
                        <IngredientChoice key={item._id} ingredient={item} multiple selected={selection.veggies.some((x) => x._id === item._id)} onClick={() => toggleMany('veggies', item)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="mb-3 font-display text-lg font-bold">🥩 Proteins <span className="font-body text-xs font-normal text-muted">optional</span></h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(grouped.meat || []).map((item) => (
                        <IngredientChoice key={item._id} ingredient={item} multiple selected={selection.meats.some((x) => x._id === item._id)} onClick={() => toggleMany('meats', item)} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentKey === 'review' && (
                <div className="space-y-3">
                  {[
                    ['Base', selection.base],
                    ['Sauce', selection.sauce],
                    ['Cheese', selection.cheese],
                  ].map(([label, item]) => (
                    <div key={label} className="flex justify-between rounded-xl border border-line bg-card p-4">
                      <span className="text-muted">{label}</span>
                      <span className="font-semibold">{item.name}</span>
                    </div>
                  ))}
                  <div className="rounded-xl border border-line bg-card p-4">
                    <span className="text-muted">Toppings</span>
                    <p className="mt-2 font-semibold">
                      {selectedToppings.length ? selectedToppings.map((item) => item.name).join(', ') : 'No extra toppings'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <span className="font-display text-lg font-bold">Order total</span>
                    <span className="font-display text-2xl font-bold text-amber">{money(total)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between gap-3 border-t border-line pt-6">
              <button className="btn-secondary" disabled={step === 0} onClick={() => setStep((current) => current - 1)}>← Back</button>
              {step < steps.length - 1
                ? <button className="btn-primary" onClick={next}>Continue →</button>
                : <button className="btn-primary" onClick={checkout}>🛒 Review checkout</button>}
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </Page>
  );
}
