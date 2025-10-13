'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { Bike, Mountain, Zap, Info, Settings, ArrowRight } from 'lucide-react'
import clsx from 'clsx'
import { useTexts } from '@/helpers/use-texts'

type Props = {
  onSelect: (choice: Modality, speed: number) => void
  speeds: {
    general: number
    road: number
    mtb: number
  }
}

export default function SpeedOptions({ onSelect, speeds }: Props) {
  const [selected, setSelected] = useState<Modality>('general')
  const router = useRouter()
  const { t } = useTexts('speedModal')

  const options = [
    { 
      label: t('options.general.label'), 
      value: 'general', 
      speed: speeds.general,
      icon: Bike,
      color: '#92a848',
      description: t('options.general.description')
    },
    { 
      label: t('options.road.label'), 
      value: 'road', 
      speed: speeds.road,
      icon: Zap,
      color: '#4a9eff',
      description: t('options.road.description')
    },
    { 
      label: t('options.mtb.label'), 
      value: 'mtb', 
      speed: speeds.mtb,
      icon: Mountain,
      color: '#ff8c42',
      description: t('options.mtb.description')
    },
  ]

  const handleOptionClick = (option: typeof options[0]) => {
    const isDisabled = !option.speed || option.speed <= 0
    
    if (isDisabled) {
      router.push('/profile')
      return
    }
    
    setSelected(option.value as Modality)
    if (option.speed && option.speed > 0) {
      onSelect(option.value as Modality, option.speed)
    }
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2 px-1">
        <h3 className="text-sm font-semibold text-white">{t('title')}</h3>
        <div 
          className="text-copy/60 hover:text-white transition-colors cursor-help"
          data-tooltip-id="modality-info"
          data-tooltip-content={t('tooltip')}
        >
          <Info size={14} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {options.map((option) => {
          const isDisabled = !option.speed || option.speed <= 0
          const isSelected = selected === option.value
          const Icon = option.icon
          
          return (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option)}
              style={{
                borderColor: isDisabled 
                  ? 'rgba(251, 252, 251, 0.1)' 
                  : isSelected 
                    ? option.color 
                    : 'rgba(251, 252, 251, 0.1)',
                backgroundColor: isDisabled
                  ? 'rgba(0, 0, 0, 0.3)'
                  : isSelected 
                    ? `${option.color}15` 
                    : 'rgba(0, 0, 0, 0.2)',
              }}
              className={clsx(
                'relative p-4 rounded-xl border-2 transition-all duration-300 ease-out text-left backdrop-blur-sm',
                'hover:scale-[1.02] active:scale-[0.98]',
                isDisabled 
                  ? 'cursor-pointer hover:border-amber-500/50' 
                  : 'cursor-pointer hover:shadow-lg',
                isSelected && 'shadow-xl'
              )}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ 
                    backgroundColor: isDisabled ? 'rgba(251, 252, 251, 0.05)' : `${option.color}20`
                  }}
                >
                  <Icon size={20} style={{ color: isDisabled ? 'rgba(251, 252, 251, 0.3)' : option.color }} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={clsx(
                      "font-semibold capitalize",
                      isDisabled ? "text-gray-400" : "text-white"
                    )}>
                      {option.label}
                    </span>
                    {isSelected && !isDisabled && (
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    {isDisabled && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 flex items-center gap-1 font-medium">
                        <Settings size={10} />
                        {t('configure')}
                      </span>
                    )}
                  </div>
                  <div className={clsx(
                    "text-xs",
                    isDisabled ? "text-gray-400" : "text-gray-300"
                  )}>
                    {isDisabled ? t('configureMessage') : option.description}
                  </div>
                </div>

                {isDisabled ? (
                  <ArrowRight size={20} className="text-amber-400" />
                ) : (
                  <div className="text-right">
                    <div 
                      className="text-lg font-bold"
                      style={{ color: isSelected ? option.color : 'rgba(251, 252, 251, 0.9)' }}
                    >
                      {option.speed?.toFixed(1)}
                    </div>
                    <div className="text-xs text-copy">{t('speedUnit')}</div>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <Tooltip id="modality-info" />
    </div>
  )
}
