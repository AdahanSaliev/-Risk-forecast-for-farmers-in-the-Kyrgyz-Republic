import { AgroData, RiskResult } from '../types';

export function calculateRisk(data: AgroData): RiskResult {
  const { temperature: temp, humidity: hum, rainfall: rain, windSpeed: wind } = data;

  if (temp > 30 && rain < 10) {
    return {
      level: 'Высокий',
      type: 'Засуха',
      recommendation: 'Увеличить частоту полива и контролировать влажность почвы.',
      color: 'red'
    };
  }

  if (hum > 80 && rain > 80) {
    return {
      level: 'Высокий',
      type: 'Заболевания растений',
      recommendation: 'Обработать посевы фунгицидами и обеспечить дренаж.',
      color: 'red'
    };
  }

  if (wind > 15) {
    return {
      level: 'Высокий',
      type: 'Повреждение посевов',
      recommendation: 'Укрепить опоры, установить ветрозащитные барьеры.',
      color: 'red'
    };
  }

  // Medium risk rules to make colors interesting based on "желтый = средний"
  if (temp > 28 || rain > 70 || wind > 10 || hum > 75) {
    return {
      level: 'Средний',
      type: 'Смешанные факторы',
      recommendation: 'Внимательно наблюдать за погодными условиями и состоянием посевов, провести превентивные мероприятия.',
      color: 'yellow'
    };
  }

  return {
    level: 'Низкий',
    type: 'Нет угрозы',
    recommendation: 'Продолжать стандартный уход. Риски минимальны.',
    color: 'green'
  };
}
