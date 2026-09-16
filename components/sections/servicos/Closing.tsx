import { ScheduleBlock } from '@/components/ui/ScheduleBlock';
import { labels } from '@/lib/content';

/** O fecho da rota: o mesmo bloco de mostarda que `/sobre` também usa. */
export function Closing() {
  return <ScheduleBlock label={labels.servicosClosing} />;
}
