import {
  add,
  differenceInMilliseconds,
  format as formatDate,
  isAfter,
  isBefore,
  isEqual,
  isFuture,
  isPast,
  isToday,
  sub,
  subYears,
} from 'date-fns';
import { isDateString } from 'class-validator';
import { ValueObject } from '@lib/base/domain/value-object';

type Duration = {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

export abstract class DateVO extends ValueObject<Date> {
  public abstract get isNull(): boolean;

  public abstract get date(): Date | null;

  public abstract get ISOString(): string | null;

  public abstract get ISOStringWithoutMs(): string | null;

  public abstract get UTCString(): string | null;

  public abstract get isFuture(): boolean;

  public abstract get isPast(): boolean;

  public abstract get isPastOrNow(): boolean;

  public abstract get isFutureOrNow(): boolean;

  public abstract get isNow(): boolean;

  public abstract getFormattedString(format: string): string | null;

  public abstract isAfter(date: DateVO): boolean;

  public abstract isBefore(date: DateVO): boolean;

  public abstract add(date: Duration): DateVO;

  public abstract subtract(date: Duration): DateVO;

  public abstract getMsDifference(date: DateVO): number;
}

class NotNullDateVO extends DateVO {
  public isNull = false as const;

  constructor(value: Date | string | number) {
    if (typeof value === 'string') {
      if (!isDateString(value))
        throw new Error(`Значение ${value} не является валидным для даты`);
    }
    const date = new Date(value);
    super({ value: date });
  }

  public get date(): Date {
    return new Date(this.props.value);
  }

  public get ISOString(): string {
    return new Date(this.props.value).toISOString();
  }

  public get ISOStringWithoutMs(): string {
    return this.ISOString.slice(0, -5) + 'Z';
  }

  public get UTCString(): string {
    return new Date(this.props.value).toUTCString();
  }

  public get isFuture(): boolean {
    return isFuture(this.date);
  }

  public get isPast(): boolean {
    return isPast(this.date);
  }

  public get isToday(): boolean {
    return isToday(this.date);
  }

  public get isNow(): boolean {
    return isEqual(this.date, new Date());
  }

  public get isPastOrNow(): boolean {
    return this.isPast || this.isNow;
  }

  public get isFutureOrNow(): boolean {
    return this.isFuture || this.isNow;
  }

  get isNotNull(): boolean {
    return true;
  }

  public getFormattedString(format: string): string {
    return formatDate(this.props.value, format);
  }

  public isAfter(date: NotNullDateVO | NullDateVO): boolean {
    if (date.isNull) throw new Error('Cannot derive from null');
    return isAfter(this.date, date.date);
  }

  public isBefore(date: NotNullDateVO | NullDateVO): boolean {
    if (date.isNull) throw new Error('Cannot derive from null');
    return isBefore(this.date, date.date);
  }

  public add(duration: Duration): DateVO {
    return new NotNullDateVO(add(this.date, duration));
  }

  public subtract(duration: Duration): DateVO {
    return new NotNullDateVO(sub(this.date, duration));
  }

  public isAdult(): boolean {
    return this.date < subYears(new Date(), 18);
  }

  public getMsDifference(date: NotNullDateVO | NullDateVO): number {
    if (date.isNull) throw new Error('Cannot derive from null');
    return differenceInMilliseconds(this.date, date.date);
  }
}

class NullDateVO extends DateVO {
  public isNull = true as const;

  constructor() {
    super({ value: null });
  }

  public get date(): null {
    return null;
  }

  public get ISOString(): null {
    return null;
  }

  public get ISOStringWithoutMs(): null {
    return null;
  }

  public get UTCString(): null {
    return null;
  }

  public get isFuture(): boolean {
    throw this.error;
  }

  public get isPast(): boolean {
    throw this.error;
  }

  get isFutureOrNow(): boolean {
    throw this.error;
  }

  get isPastOrNow(): boolean {
    throw this.error;
  }

  get isNow(): boolean {
    throw this.error;
  }

  private get error(): Error {
    return new Error(
      `Cannot use this date method for value ${this.props.value}`,
    );
  }

  public getFormattedString(): null {
    return null;
  }

  public isAfter(): boolean {
    throw this.error;
  }

  public isBefore(): boolean {
    throw this.error;
  }

  public add(): DateVO {
    throw this.error;
  }

  public subtract(): DateVO {
    throw this.error;
  }

  public isAdult(): boolean {
    throw this.error;
  }

  public getMsDifference(date: DateVO): number {
    return 0;
  }
}

export class DateVOFactory {
  public get now(): NotNullDateVO {
    return new NotNullDateVO(new Date());
  }

  public create(value: Date | string | number | null) {
    if (!value) {
      return new NullDateVO();
    } else {
      return new NotNullDateVO(value);
    }
  }

  public getDifference(
    dateA: NotNullDateVO | NullDateVO,
    dateB: NotNullDateVO | NullDateVO,
  ): number {
    if (dateA.isNull || dateB.isNull)
      throw new Error('Cannot derive when one of dates is null');
    return differenceInMilliseconds(dateA.date, dateB.date);
  }
}
