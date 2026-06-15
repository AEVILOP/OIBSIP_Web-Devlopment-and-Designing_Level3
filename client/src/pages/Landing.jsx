import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Page from '../components/Page';
import PizzaPreview from '../components/PizzaPreview';
import api from '../utils/axios';
import { money } from '../utils/format';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

const features = [
  { icon: '🎨', title: 'Build it live', copy: 'Watch every sauce, cheese, and topping land on your pizza as you choose.' },
  { icon: '🔒', title: 'Pay securely', copy: 'Razorpay test checkout keeps the flow realistic without charging real money.' },
  { icon: '📡', title: 'Track the heat', copy: 'Follow your order from confirmation to the delivery handoff in real time.' },
];

const stats = [
  { value: '30+', label: 'menu items' },
  { value: '5 min', label: 'avg delivery' },
  { value: '100%', label: 'your call' },
];

function AutoScrollCarousel() {
  const [pizzas, setPizzas] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    api.get('/catalog/pizzas')
      .then(({ data }) => {
        const onlyPizzas = data.pizzas.filter((p) => ['veg', 'non-veg', 'vegan'].includes(p.category));
        setPizzas(onlyPizzas);
      })
      .catch(() => {});
  }, []);

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || pizzas.length === 0) return;
    let animId;
    let speed = 0.5;
    const scroll = () => {
      el.scrollLeft += speed;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
        el.scrollLeft = 0;
      }
      animId = requestAnimationFrame(scroll);
    };
    animId = requestAnimationFrame(scroll);

    const pause = () => { speed = 0; };
    const resume = () => { speed = 0.5; };
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause);
    el.addEventListener('touchend', resume);

    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
    };
  }, [pizzas]);

  if (pizzas.length === 0) return null;

  return (
    <div className="relative mt-16 overflow-hidden">
      {/* Gradient masks */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-ink to-transparent" />
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-hidden pb-4"
        style={{ scrollBehavior: 'auto' }}
      >
        {/* Duplicate items for seamless looping */}
        {[...pizzas, ...pizzas].map((pizza, i) => (
          <Link
            to="/menu"
            key={`${pizza._id}-${i}`}
            className="group flex-shrink-0 w-64 overflow-hidden rounded-2xl border border-line bg-card transition-all duration-300 hover:border-fire/30 hover:shadow-card"
          >
            <div className="relative h-36 overflow-hidden">
              <img
                src={pizza.image}
                alt={pizza.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
              <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md ${
                pizza.category === 'non-veg' ? 'bg-danger/80 text-white' :
                pizza.category === 'vegan' ? 'bg-emerald-600/80 text-white' :
                'bg-success/80 text-white'
              }`}>
                {pizza.category.toUpperCase()}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-sm font-bold leading-tight">{pizza.name}</h3>
                <span className="shrink-0 text-sm font-bold text-amber">{money(pizza.basePrice)}</span>
              </div>
              <p className="mt-1.5 text-[11px] leading-4 text-muted line-clamp-2">{pizza.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <Page>
      {/* Hero */}
      <section className="container-app grid min-h-[calc(100vh-64px)] items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <motion.p className="eyebrow" {...fade(0)}>Fire-baked. Fully yours.</motion.p>
          <motion.h1
            className="mt-5 max-w-3xl font-display text-5xl font-extrabold leading-[.93] tracking-tight sm:text-7xl"
            {...fade(0.1)}
          >
            Pizza with a{' '}
            <span className="bg-gradient-to-r from-fire to-amber bg-clip-text text-transparent">
              point of view.
            </span>
          </motion.h1>
          <motion.p className="mt-7 max-w-xl text-lg leading-8 text-muted" {...fade(0.2)}>
            Start with one of our house signatures or build every layer yourself. Real ingredients,
            live tracking, no generic delivery experience.
          </motion.p>
          <motion.div className="mt-9 flex flex-wrap gap-3" {...fade(0.3)}>
            <Link to="/register" className="btn-primary">Start your order</Link>
            <Link to="/menu" className="btn-secondary">Browse menu</Link>
          </motion.div>
          <motion.div className="mt-12 flex gap-10 border-t border-line pt-6" {...fade(0.4)}>
            {stats.map(({ value, label }) => (
              <div key={label}>
                <strong className="font-display text-2xl">{value}</strong>
                <p className="text-xs text-muted">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div className="relative" {...fade(0.3)}>
          <div className="glass-card absolute right-0 top-4 z-10 px-4 py-3 shadow-fire">
            <p className="text-xs text-muted">Current build</p>
            <p className="font-display font-bold">The Firegarden</p>
          </div>
          <PizzaPreview
            sauce="Spicy Arrabbiata"
            cheese="Vegan Cheese"
            toppings={['Bell Peppers', 'Olives', 'Jalapeños', 'Corn', 'Spinach']}
          />
          <div className="glass-card absolute bottom-5 left-0 px-4 py-3">
            <p className="text-xs font-semibold text-success">● Kitchen online</p>
            <p className="mt-1 text-sm text-muted">Ready when you are</p>
          </div>
        </motion.div>
      </section>

      {/* Auto-Scroll Pizza Menu */}
      <section className="border-y border-line/50 bg-surface/30 py-16">
        <div className="container-app">
          <motion.p className="eyebrow" {...fade()}>Fresh from the oven</motion.p>
          <motion.h2 className="section-heading" {...fade(0.1)}>Popular Picks.</motion.h2>
          <motion.p className="mt-3 text-muted" {...fade(0.15)}>
            Swipe through our best-selling pizzas — click any to order.
          </motion.p>
        </div>
        <div className="container-app">
          <AutoScrollCarousel />
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container-app">
          <motion.p className="eyebrow" {...fade()}>How it works</motion.p>
          <motion.h2 className="section-heading" {...fade(0.1)}>From idea to door.</motion.h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map(({ icon, title, copy }, index) => (
              <motion.article
                key={title}
                className="glass-card group p-7 transition-all duration-300 hover:-translate-y-1 hover:border-fire/20 hover:shadow-glow"
                {...fade(0.15 + index * 0.1)}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-fire/10 text-xl">
                  {icon}
                </span>
                <h3 className="mt-6 font-display text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-muted">{copy}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line/50 bg-surface/30 py-24">
        <div className="container-app text-center">
          <motion.h2
            className="mx-auto max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl"
            {...fade()}
          >
            Ready to build your{' '}
            <span className="bg-gradient-to-r from-fire to-amber bg-clip-text text-transparent">perfect pizza</span>?
          </motion.h2>
          <motion.p className="mx-auto mt-5 max-w-lg text-muted" {...fade(0.1)}>
            Sign up in 30 seconds, pick your ingredients, and watch your creation come to life.
          </motion.p>
          <motion.div className="mt-8 flex justify-center gap-3" {...fade(0.2)}>
            <Link to="/register" className="btn-primary">Get started free</Link>
          </motion.div>
        </div>
      </section>
    </Page>
  );
}
