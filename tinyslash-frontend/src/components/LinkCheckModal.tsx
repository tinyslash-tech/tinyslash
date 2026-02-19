import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LinkCheckerCard from './LinkCheckerCard';

interface LinkCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LinkCheckModal: React.FC<LinkCheckModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-lg"
          >
            <LinkCheckerCard onClose={onClose} isModal={true} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LinkCheckModal;
