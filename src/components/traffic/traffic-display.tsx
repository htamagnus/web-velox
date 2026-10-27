'use client'

import { useTexts } from '@/helpers/use-texts'
import { TrafficData, TrafficSeverity } from '@/interfaces/routes.interface'

type Props = {
  trafficData: TrafficData
}

export default function TrafficDisplay({ trafficData }: Props) {
  const { t } = useTexts('calculate.traffic')

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

  return (
    <div className="plan-cond" data-alert={trafficData.overallSeverity !== TrafficSeverity.NORMAL || undefined}>
      <dt>{t('label')}</dt>
      <dd>
        <b>{getSeverityLabel()}</b>
        <span className="plan-cond__meta num">
          {t('delay')} {trafficData.delayMinutes} {t('minutes')}
        </span>
        <span className="plan-cond__note">{getSeverityMessage()}</span>
      </dd>
    </div>
  )
}
