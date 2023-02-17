import { ISubject } from '@lib/interfaces/common/subject.interface';
import { IObserver } from '@lib/interfaces/common/observer.interface';

export abstract class ObserverSubject<T> implements ISubject<T> {
  private observers: IObserver<T>[] = [];

  public attach(observer: IObserver<T>): void {
    if (this.doesObserverExists(observer)) {
      throw new Error('Such observer already exists');
    }
    this.observers.push(observer);
  }

  public detach(observer: IObserver<T>): void {
    const targetIndex = this.observers.indexOf(observer);
    if (targetIndex === -1) {
      throw new Error('Observer not found');
    }
    this.observers.splice(targetIndex, 1);
  }

  public notify(event: T): void {
    this.observers.forEach((observer) => observer.update(event));
  }

  private doesObserverExists(observer: IObserver<T>): boolean {
    return this.observers.includes(observer);
  }
}
