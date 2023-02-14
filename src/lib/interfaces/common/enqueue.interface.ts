import { IQueueJob } from './queue-job.type';

export interface IEnqueue<TJob extends IQueueJob = Record<string, any>> {
  enqueue(job: TJob): void;
}
