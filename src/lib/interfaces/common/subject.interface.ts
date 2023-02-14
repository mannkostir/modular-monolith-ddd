import { IObserver } from './observer.interface';

export interface ISubject<Payload> {
  attach(observer: IObserver<Payload>): void;
  detach(observer: IObserver<Payload>): void;
  notify(payload: Payload): void;
}
