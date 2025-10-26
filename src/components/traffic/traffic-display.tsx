'use client'

import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react'
import { useTexts } from '@/helpers/use-texts'
import { TrafficData, TrafficSeverity } from '@/interfaces/routes.interface'
import styles from './traffic-display.module.css'

type Props = {
  trafficData: TrafficData
}

export default function TrafficDisplay({ trafficData }: Props) {
  const { t } = useTexts('calculate.traffic')

  const getSeverityIcon = () => {
    switch (trafficData.overallSeverity) {
      case TrafficSeverity.NORMAL:
        return <CheckCircle size={16} />
      case TrafficSeverity.INTENSE:
        return <AlertCircle size={16} />
      case TrafficSeverity.CONGESTED:
        return <AlertTriangle size={16} />
    }
  }

  const getSeverityLabel = () => {
    const severityKey = trafficData.overallSeverity
    if (severityKey === TrafficSeverity.NORMAL) return t('severity.normal')
    if (severityKey === TrafficSeverity.INTENSE) return t('severity.intense')
    return t('severity.congested')
  }

  const getSeverityMessage = () => {
    const severityKey = trafficData.overallSeverity
    if (severityKey === TrafficSeverity.NORMAL) return t('messages.normal')
    if (severityKey === TrafficSeverity.INTENSE) return t('messages.intense')
    return t('messages.congested')
  }

  const getSeverityClassName = () => {
    switch (trafficData.overallSeverity) {
      case TrafficSeverity.NORMAL:
        return styles.severityNormal
      case TrafficSeverity.INTENSE:
        return styles.severityIntense
      case TrafficSeverity.CONGESTED:
        return styles.severityCongested
    }
  }

  const getSeverityAlertClassName = () => {
    switch (trafficData.overallSeverity) {
      case TrafficSeverity.NORMAL:
        return styles.alertNormal
      case TrafficSeverity.INTENSE:
        return styles.alertIntense
      case TrafficSeverity.CONGESTED:
        return styles.alertCongested
    }
  }

  return (
    <div className={styles.trafficContainer}>
      <div className={styles.header}>
        <div className="w-1.5 h-1.5 rounded-full bg-[#92a848] animate-pulse" />
        <span className={styles.title}>{t('title')}</span>
        <div className={`${styles.severityBadge} ${getSeverityClassName()}`}>
          {getSeverityIcon()}
          {getSeverityLabel()}
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>{t('delay')}</span>
          <span className={styles.statValue}>{trafficData.delayMinutes} {t('minutes')}</span>
        </div>
      </div>

      <div className={`${styles.alert} ${getSeverityAlertClassName()}`}>
        <AlertCircle size={14} />
        <div className="flex flex-col gap-1">
          <span className="text-xs">{getSeverityMessage()}</span>
        </div>
      </div>
    </div>
  )
}
