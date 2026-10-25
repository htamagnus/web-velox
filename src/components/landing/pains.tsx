'use client';

import Image from 'next/image';
import { useTexts } from '@/helpers/use-texts';
import Reveal from './reveal';
import SplitWords from './split-words';
import CountUp from './count-up';

// as figuras saem do exemplo da página: 2h10 contra 1h20 em 30 km
const PAINS = [
  { key: 'prediction', value: 50, prefix: '+' },
  { key: 'time', value: 14 },
  { key: 'bike', value: 3 },
];

export default function Pains() {
  const { t } = useTexts('landing');
  return (
    <section className="pains">
      <div className="container">
        <div className="pains__copy">
          <Reveal>
            <p className="eyebrow">{t('index.pains')}</p>
          </Reveal>
          <SplitWords text={`${t('problem.title')} ${t('problem.titleHighlight')}`} />
          <ul className="pains__list">
            {PAINS.map((pain, i) => (
              <li key={pain.key}>
                <Reveal className="pains__item" delay={0.1 + i * 0.1}>
                  <p className="pains__figure">
                    <CountUp to={pain.value} prefix={pain.prefix} />
                    <span>{t(`problem.cards.${pain.key}.unit`)}</span>
                  </p>
                  <div>
                    <h3>{t(`problem.cards.${pain.key}.title`)}</h3>
                    <p>{t(`problem.cards.${pain.key}.desc`)}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figure className="pains__photo">
        <Image src="/images/studio-bike.jpg" alt="" fill sizes="(max-width: 60rem) 100vw, 56vw" />
      </figure>
    </section>
  );
}
