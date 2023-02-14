export interface IObserver<Payload> {
  update(payload: Payload): void;
}
