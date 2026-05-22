'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

const variantClasses = {
  default: 'bg-white',
  bordered: 'bg-white border border-gray-200',
  elevated: 'bg-white shadow-md',
} as const;

interface CardProps {
  variant?: keyof typeof variantClasses;
  animate?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Card({ variant = 'default', animate = false, className, children }: CardProps) {
  const classes = cn('rounded-xl p-6', variantClasses[variant], className);

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className={classes}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={classes}>{children}</div>;
}
