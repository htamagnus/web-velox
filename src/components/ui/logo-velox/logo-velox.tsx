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
        height={50}
        priority
        className="w-32 sm:w-36 md:w-40 lg:w-48 h-auto"
      />
    </motion.div>
  )
}
