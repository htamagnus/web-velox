'use client'

import { Cloud, CloudRain, Sun, Wind, Droplets, AlertCircle, Zap } from 'lucide-react'
import { useTexts } from '@/helpers/use-texts'
import { WeatherData, WeatherCondition } from '@/interfaces/routes.interface'
import styles from './weather-display.module.css'

type Props = {
  weatherData: WeatherData
}

export default function WeatherDisplay({ weatherData }: Props) {
  const { t } = useTexts('calculate.weather')

  const getConditionIcon = () => {
    switch (weatherData.condition) {
      case WeatherCondition.SUNNY:
        return <Sun size={20} />
      case WeatherCondition.CLOUDY:
        return <Cloud size={20} />
      case WeatherCondition.RAINY:
        return <CloudRain size={20} />
      case WeatherCondition.STORMY:
        return <Zap size={20} />
      case WeatherCondition.SNOWY:
        return <Cloud size={20} />
    }
  }

  const getConditionLabel = () => {
    const conditionKey = weatherData.condition
    if (conditionKey === WeatherCondition.SUNNY) return t('condition.sunny')
    if (conditionKey === WeatherCondition.CLOUDY) return t('condition.cloudy')
    if (conditionKey === WeatherCondition.RAINY) return t('condition.rainy')
    if (conditionKey === WeatherCondition.STORMY) return t('condition.stormy')
    return t('condition.snowy')
  }

  const getConditionMessage = () => {
    const conditionKey = weatherData.condition
    if (conditionKey === WeatherCondition.SUNNY) return t('messages.sunny')
    if (conditionKey === WeatherCondition.CLOUDY) return t('messages.cloudy')
    if (conditionKey === WeatherCondition.RAINY) return t('messages.rainy')
    if (conditionKey === WeatherCondition.STORMY) return t('messages.stormy')
    return t('messages.snowy')
  }

  const getConditionClassName = () => {
    switch (weatherData.condition) {
      case WeatherCondition.SUNNY:
        return styles.conditionSunny
      case WeatherCondition.CLOUDY:
        return styles.conditionCloudy
      case WeatherCondition.RAINY:
        return styles.conditionRainy
      case WeatherCondition.STORMY:
        return styles.conditionStormy
      case WeatherCondition.SNOWY:
        return styles.conditionSnowy
    }
  }


  const hasAlerts = weatherData.alerts.length > 0
  const highSeverityAlerts = weatherData.alerts.filter(a => a.severity === 'high')

  return (
    <div className={styles.weatherContainer}>
      <div className={styles.header}>
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        <span className={styles.title}>{t('title')}</span>
        <div className={`${styles.conditionBadge} ${getConditionClassName()}`}>
          {getConditionIcon()}
          {getConditionLabel()}
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>{t('temperature')}</span>
          <span className={styles.statValue}>{weatherData.temperature}°c</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>{t('humidity')}</span>
          <div className={styles.statValueWithIcon}>
            <Droplets size={14} />
            <span>{weatherData.rainProbability}%</span>
          </div>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>{t('wind')}</span>
          <div className={styles.statValueWithIcon}>
            <Wind size={14} />
            <span>{weatherData.windSpeed}km/h</span>
          </div>
        </div>
      </div>

      <div className={styles.message}>
        {getConditionMessage()}
      </div>

      {hasAlerts && (
        <div className={styles.alertsContainer}>
          {weatherData.alerts.map((alert, index) => (
            <div
              key={index}
              className={`${styles.alert} ${
                alert.severity === 'high' ? styles.alertHigh : alert.severity === 'medium' ? styles.alertMedium : styles.alertLow
              }`}
            >
              <AlertCircle size={14} />
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {highSeverityAlerts.length > 0 && (
        <div className={styles.criticalAlert}>
          <Zap size={16} />
          <span>{t('criticalWarning')}</span>
        </div>
      )}
    </div>
  )
}
