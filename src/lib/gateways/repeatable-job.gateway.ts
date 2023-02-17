import Redis from 'ioredis';
import { Processor, Queue, Worker } from 'bullmq';

export abstract class RepeatableJobGateway {
  protected queue: Queue;
  protected queueId: string;

  protected constructor(private redisConnection: Redis, id: string) {
    this.queueId = id;

    this.queue = new Queue(this.queueId, { connection: this.redisConnection });
  }

  private _worker: Worker | undefined;

  protected get worker(): Worker {
    if (!this._worker) throw new Error('Worker not specified');
    return this._worker;
  }

  protected set worker(worker: Worker) {
    this._worker = worker;
  }

  public addProcessor(processor: Processor): void {
    this.worker = new Worker(this.queueId, processor, {
      connection: this.redisConnection,
      autorun: false,
    });
  }

  public async run(): Promise<void> {
    await this.eraseRepeatableJobs();

    this.worker.on('error', (err) => {
      console.error(err);
    });

    this.worker.run();
  }

  protected async eraseRepeatableJobs() {
    const jobs = await this.queue.getRepeatableJobs();
    await Promise.all(
      jobs.map((job) => this.queue.removeRepeatableByKey(job.key)),
    );
  }
}
