export const fadeUp = {
  initial: { opacity: 0, y: 40, filter: "blur(5px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const wordReveal = (text, delayOffset = 0) => {
  const words = text.split(" ");
  return {
    words,
    containerVariants: {
      animate: {
        transition: {
          staggerChildren: 0.05,
          delayChildren: delayOffset
        }
      }
    },
    childVariants: {
      initial: { opacity: 0, y: 15, filter: "blur(4px)" },
      animate: { 
        opacity: 1, 
        y: 0, 
        filter: "blur(0px)",
        transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }
      }
    }
  };
};
