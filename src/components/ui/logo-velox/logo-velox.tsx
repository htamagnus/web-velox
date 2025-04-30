'use client'

import Image from "next/image";
import { motion } from "framer-motion";

export default function LogoVelox({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex justify-center ${className}`}
    >
      <Image 
        src="/velox-logo.svg" 
        alt="Velox Logo"
        width={140}
        height={20}
        priority
        className="h-auto"
      />
    </motion.div>
  )
}
