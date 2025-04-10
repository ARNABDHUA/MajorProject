import { motion } from "framer-motion";

const ChatLoading = () => {
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1.5
      }
    }
  };

  return (
    <motion.div 
      className="flex flex-col gap-2"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {[...Array(12)].map((_, index) => (
        <motion.div 
          key={index}
          className="h-12 bg-gray-200 rounded"
          variants={itemVariants}
        />
      ))}
    </motion.div>
  );
};

export default ChatLoading;