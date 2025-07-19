import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <motion.div
      className={`w-8 h-8 border-4 border-t-4 border-blue-500 border-t-transparent rounded-full ${className}`}
      variants={{
        animate: {
          rotate: 360,
          transition: {
            ease: "linear",
            duration: 1,
            repeat: Infinity,
          },
        },
      }}
      animate="animate"
    />
  );
};

export default LoadingSpinner;
