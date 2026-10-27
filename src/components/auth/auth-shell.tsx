'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, MotionConfig } from 'framer-motion';
import { archivo } from '@/app/fonts';
import LanguageSelector from '@/components/language-selector/language-selector';
import SpeedField from '@/components/landing/speed-field';
import { EASE } from '@/components/landing/reveal';
import { MODES } from '@/components/landing/modes';

type Props = {
  title: [string, string];
  lead: string;
  children: React.ReactNode;
};

// login e registro como o pôster do hero: a foto manda, o título gigante embaixo à esquerda, o formulário solto à direita
export default function AuthShell({ title, lead, children }: Props) {
  return (
    <MotionConfig reducedMotion="user">
      <div className={`landing auth grain ${archivo.variable}`}>
        <figure className="auth__photo">
          <Image src="/images/hero-bike.jpg" alt="" fill priority sizes="100vw" />
        </figure>
        <SpeedField speed={MODES[0].speed} />
        <div className="hero__lines" aria-hidden="true" />

        <motion.header
          className="container auth__nav"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        >
          <Link href="/" className="auth__brand" aria-label="Velox">
            <Image src="/svg/velox-logo.svg" alt="" width={56} height={39} priority />
          </Link>
          <div className="lang">
            <LanguageSelector />
          </div>
        </motion.header>

        <main className="container auth__grid">
          <div className="auth__type">
            <h1>
              {title.map((line, i) => (
                <span key={i} className="hero__line">
                  <motion.span
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.35 + i * 0.12, ease: EASE }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              className="lead"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
            >
              {lead}
            </motion.p>
          </div>

          <motion.div
            className="auth__panel"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </MotionConfig>
  );
}
