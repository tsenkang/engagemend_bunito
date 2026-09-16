import { ScheduleBlock } from '@/components/ui/ScheduleBlock';
import { labels } from '@/lib/content';

/**
 * O fecho que faltava nesta rota. Ela termina no ponto mais alto da
 * confiança — "Vem de Pompeia." — e até aqui não oferecia nada para
 * fazer com essa confiança.
 */
export function Schedule() {
  return <ScheduleBlock label={labels.sobreSchedule} />;
}
