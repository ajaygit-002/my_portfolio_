import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../utils/animations';

export const SectionWrapper = ({ children, className = '', id }) => {
  return (
    <motion.section
      id={id}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-150px" }}
      variants={fadeUp}
      className={`py-20 md:py-32 px-6 max-w-7xl mx-auto w-full relative ${className}`}
    >
      {children}
    </motion.section>
  );
};
