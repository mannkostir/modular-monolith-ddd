export enum PaymentStatus {
  fulfilled = 'FULFILLED',
  pending = 'PENDING',
  rejected = 'REJECTED',
}

export type Payment = {
  id: string;
  status: PaymentStatus;
  createdAt: Date;

  amount: number;
};
