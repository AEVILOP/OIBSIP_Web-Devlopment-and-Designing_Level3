import { motion } from 'framer-motion';

export default function Loading({ label = 'Heating things up...' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-[45vh] flex-col items-center justify-center gap-5 text-muted"
    >
      <div className="relative">
        <motion.div
          className="text-5xl"
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
        >
          🍕
        </motion.div>
        <motion.div
          className="absolute -inset-3 rounded-full bg-fire/10 blur-xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </motion.div>
  );
}
