'use client'

import Image from "next/image";
import { motion } from "framer-motion";

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 80, height: 12 },
  md: { width: 120, height: 18 },
  lg: { width: 140, height: 20 },
  xl: { width: 180, height: 26 },
};

export default function LogoVelox({
  size = 'lg',
  className = '',
}: {
  size?: LogoSize;
  className?: string;
}) {
  const { width, height } = sizeMap[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex justify-center ${className}`}
    >
      <Image 
        src="/svg/velox-logo.svg" 
        alt="Velox Logo"
        width={width}
        height={height}
        priority
        className="h-auto"
      />
    </motion.div>
  );
}
