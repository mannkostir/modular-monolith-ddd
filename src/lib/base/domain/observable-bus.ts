import { Observable, Subject } from 'rxjs';

export class ObservableBus<T> extends Observable<T> {
  private readonly _subject;

  constructor() {
    super();
    this._subject = new Subject<T>();
  }

  protected get subject(): Subject<T> {
    return this._subject;
  }
}
