'use client'

import { useTexts } from '@/helpers/use-texts'
import { WeatherData, WeatherCondition } from '@/interfaces/routes.interface'

type Props = {
  weatherData: WeatherData
}

export default function WeatherDisplay({ weatherData }: Props) {
  const { t } = useTexts('calculate.weather')

  const getConditionLabel = () => {
    const conditionKey = weatherData.condition
    if (conditionKey === WeatherCondition.SUNNY) return t('condition.sunny')
    if (conditionKey === WeatherCondition.CLOUDY) return t('condition.cloudy')
    if (conditionKey === WeatherCondition.RAINY) return t('condition.rainy')
    if (conditionKey === WeatherCondition.STORMY) return t('condition.stormy')
    return t('condition.snowy')
  }

  const getAlertMessage = (alert: typeof weatherData.alerts[0]) => {
    switch (alert.type) {
      case 'high_rain': {
        const probability = weatherData.rainProbability
        return t('alerts.high_rain.message').replace('{{probability}}', probability.toString())
      }
      case 'extreme_temp': {
        const isHot = weatherData.temperature > 30
        const tempMessage = isHot ? t('alerts.extreme_temp.hot') : t('alerts.extreme_temp.cold')
        return tempMessage.replace('{{temp}}', weatherData.temperature.toString())
      }
      case 'strong_wind': {
        return t('alerts.strong_wind.message').replace('{{speed}}', weatherData.windSpeed.toString())
      }
      default:
        return alert.message
    }
  }

  const getAlertTitle = (alert: typeof weatherData.alerts[0]) => {
    switch (alert.type) {
      case 'high_rain':
        return t('alerts.high_rain.title')
      case 'extreme_temp':
        return t('alerts.extreme_temp.title')
      case 'strong_wind':
        return t('alerts.strong_wind.title')
      default:
        return ''
    }
  }

  const getDefaultMessage = () => {
    switch (weatherData.condition) {
      case WeatherCondition.SUNNY:
        return t('messages.sunny')
      case WeatherCondition.CLOUDY:
        return t('messages.cloudy')
      case WeatherCondition.RAINY:
        return t('messages.rainy')
      case WeatherCondition.STORMY:
        return t('messages.stormy')
      case WeatherCondition.SNOWY:
        return t('messages.snowy')
    }
  }

  const hasAlerts = weatherData.alerts.length > 0

  // chuva, tempestade ou neve contam como alerta mesmo sem aviso da api
  const isRough = [WeatherCondition.RAINY, WeatherCondition.STORMY, WeatherCondition.SNOWY].includes(weatherData.condition)

  return (
    <div className="plan-cond" data-alert={hasAlerts || isRough || undefined}>
      <dt>{t('label')}</dt>
      <dd>
        <b>
          {getConditionLabel()} · {weatherData.temperature}°C
        </b>
        <span className="plan-cond__meta num">
          {t('humidity')} {weatherData.rainProbability}% · {t('wind')} {weatherData.windSpeed} km/h
        </span>
        {hasAlerts ? (
          weatherData.alerts.map((alert, index) => (
            <span key={index} className="plan-cond__note">
              {getAlertTitle(alert)}. {getAlertMessage(alert)}
            </span>
          ))
        ) : (
          <span className="plan-cond__note">{getDefaultMessage()}</span>
        )}
      </dd>
    </div>
  )
}
