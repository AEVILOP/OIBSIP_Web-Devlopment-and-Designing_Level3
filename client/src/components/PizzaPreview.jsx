import { motion } from 'framer-motion';

const sauceColors = {
  'Classic Tomato': '#C93624',
  Pesto: '#527A3A',
  BBQ: '#6D3324',
  Alfredo: '#F1E0BD',
  'Spicy Arrabbiata': '#E43420',
};

const spots = [
  [102, 68], [145, 83], [76, 112], [126, 124], [166, 119],
  [96, 160], [145, 163], [64, 151], [177, 157], [118, 94],
  [154, 142], [86, 87], [130, 181], [188, 105], [52, 126],
];

const toppingColor = (name) => {
  if (/mushroom/i.test(name)) return '#D8C2A8';
  if (/pepper|jalape/i.test(name)) return '#65A844';
  if (/onion/i.test(name)) return '#B98BC6';
  if (/olive/i.test(name)) return '#252525';
  if (/corn/i.test(name)) return '#FFD34E';
  if (/spinach/i.test(name)) return '#367B42';
  if (/tomato|pepperoni/i.test(name)) return '#B9211A';
  if (/chicken|sausage|bacon/i.test(name)) return '#985239';
  return '#EF4444';
};

export default function PizzaPreview({ sauce, cheese, toppings = [], className = '' }) {
  const repeated = toppings.flatMap((name) => [name, name, name]).slice(0, spots.length);
  return (
    <motion.div
      className={`relative mx-auto aspect-square w-full max-w-[420px] ${className}`}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="absolute inset-[9%] rounded-full bg-fire/15 blur-3xl" />
      <svg viewBox="0 0 240 240" className="relative h-full w-full drop-shadow-2xl" aria-label="Live pizza preview">
        {/* Crust outer */}
        <circle cx="120" cy="120" r="105" fill="#B86A2C" />
        {/* Crust inner */}
        <circle cx="120" cy="120" r="94" fill="#E7A54B" />
        {/* Sauce */}
        <circle cx="120" cy="120" r="84" fill={sauceColors[sauce] || '#C93624'} />
        {/* Cheese */}
        {cheese && <circle cx="120" cy="120" r="79" fill="#F7D889" opacity=".88" />}
        {/* Shine line */}
        <path d="M43 75c35-31 107-43 154 3" fill="none" stroke="#fff" strokeOpacity=".1" strokeWidth="3" strokeLinecap="round" />
        {/* Toppings */}
        {repeated.map((name, index) => (
          <motion.g
            key={`${name}-${index}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
          >
            <circle cx={spots[index][0]} cy={spots[index][1]} r={index % 2 ? 6 : 8} fill={toppingColor(name)} />
            <circle cx={spots[index][0] - 2} cy={spots[index][1] - 2} r="1.6" fill="#fff" opacity=".18" />
          </motion.g>
        ))}
      </svg>
    </motion.div>
  );
}
