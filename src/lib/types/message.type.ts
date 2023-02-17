export interface IMessage<
  Payload extends Record<string, any> = Record<string, any>,
> {
  token: string;
  payload: Payload;
  correlationId: string;
  dateOccurred: Date;
  context: string;
}
