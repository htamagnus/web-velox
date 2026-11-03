// as molas do app: o toque responde rápido e assenta sem quicar demais
export const SPRING = { type: 'spring', stiffness: 520, damping: 40 } as const;

export const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

export const ITEM = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 26 } },
} as const;

// "Speed (estrada)" vira "Speed" onde o espaço é de botão
export const shortLabel = (label: string) => label.split(' (')[0];

// o endereço do google vem inteiro ("Praça X - Av. Y - Centro, Cidade - SC, Brasil"); no app basta o lugar
export const shortPlace = (place: string) => place.split(/\s[-–]\s|,/)[0].trim();

export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
