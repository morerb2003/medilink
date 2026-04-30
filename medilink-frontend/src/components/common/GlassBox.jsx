import { motion } from 'framer-motion';

const GlassBox = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-card p-8 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassBox;
