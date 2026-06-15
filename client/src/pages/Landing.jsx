import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Page from '../components/Page';
import PizzaPreview from '../components/PizzaPreview';

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
  { value: '26', label: 'fresh ingredients' },
  { value: '8 sec', label: 'status refresh' },
  { value: '100%', label: 'your call' },
];

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
            <Link to="/login" className="btn-secondary">I have an account</Link>
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

      {/* Features */}
      <section className="border-y border-line/50 bg-surface/30 py-24">
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
      <section className="py-24">
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
