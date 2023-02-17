import Redis from 'ioredis';
import { Job, Processor, Queue, Worker } from 'bullmq';
import { IEnqueue } from '@lib/interfaces/common/enqueue.interface';

export type QueueJob<DataType> = Job<DataType>;

export class QueueGateway<DataType> implements IEnqueue {
  private readonly queue: Queue;

  constructor(
    private readonly redisConnection: Redis,
    private readonly id: string,
  ) {
    this.queue = new Queue(this.id, {
      connection: this.redisConnection,
    });
  }

  private _worker: Worker | undefined;

  private get worker(): Worker {
    if (!this._worker) throw new Error('Worker not specified');
    return this._worker;
  }

  private set worker(worker: Worker) {
    this._worker = worker;
  }

  public addProcessor(processor: Processor): void {
    this.worker = new Worker(this.queue.name, processor, {
      connection: this.redisConnection,
      autorun: false,
    });
  }

  public async run(): Promise<void> {
    this.worker.run();
  }

  public async enqueue(
    jobs: Pick<QueueJob<DataType>, 'name' | 'data'>[],
  ): Promise<void> {
    await this.queue.addBulk(
      jobs.map((job) => ({
        ...job,
        opts: { removeOnComplete: true, removeOnFail: 100 },
      })),
    );
  }
}
