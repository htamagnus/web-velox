'use client';

import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { SPRING } from './motion';

type Option<T> = {
  value: T;
  label: ReactNode;
  meta?: ReactNode;
  // opção com link não se escolhe aqui: leva pra onde ela se resolve (bike sem média vai pro perfil)
  href?: string;
  color?: string;
};

type Props<T> = {
  id: string;
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

// o controle segmentado: a pílula desliza até a opção escolhida
export default function Segmented<T extends string | number>({ id, label, options, value, onChange, className }: Props<T>) {
  return (
    <div className={`seg ${className ?? ''}`} role="group" aria-label={label}>
      {options.map((option) => {
        const style = option.color ? ({ '--seg': option.color } as CSSProperties) : undefined;
        const body = (
          <>
            {option.value === value && !option.href && (
              <motion.span layoutId={`${id}-pill`} className="seg__pill" transition={SPRING} />
            )}
            <span className="seg__label">{option.label}</span>
            {option.meta && <span className="seg__meta">{option.meta}</span>}
          </>
        );
        return option.href ? (
          <Link key={option.value} href={option.href} className="seg__item seg__item--link" style={style}>
            {body}
          </Link>
        ) : (
          <motion.button
            key={option.value}
            type="button"
            className="seg__item"
            style={style}
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
            whileTap={{ scale: 0.95 }}
            transition={SPRING}
          >
            {body}
          </motion.button>
        );
      })}
    </div>
  );
}
