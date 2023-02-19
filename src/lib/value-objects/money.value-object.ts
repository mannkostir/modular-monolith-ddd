import { ValueObject } from '@lib/base/domain/value-object';
import { Axios } from 'axios';
import { isNumber } from 'class-validator';

export enum Currency {
  rub = 'RUB',
  usd = 'USD',
  eur = 'EUR',
}

type CurrencyRate = {
  CharCode: string;
  Value: number;
};

type CurrencyRates = {
  [key in Currency]: CurrencyRate;
};

export abstract class MoneyVO extends ValueObject<number> {
  private static axiosClient: Axios = new Axios({
    transformResponse: (response) => JSON.parse(response),
  });

  protected constructor(amount: number, public readonly currency: Currency) {
    if (!isNumber(amount))
      throw new Error(`Value ${amount} is not a valid monetary value`);
    super({ value: amount });
  }

  public get value(): number {
    return this.props.value;
  }

  private static async convert(
    from: Currency,
    to: Currency,
    amount: number,
  ): Promise<number> {
    const currencyRate = await this.getCurrencyRate(from, to);
    return Number((amount * currencyRate).toFixed(2));
  }

  private static async getCurrencyRate(
    from: Currency,
    to: Currency,
  ): Promise<number> {
    const response = await this.axiosClient
      .get<{ Valute: CurrencyRates }>(
        'https://www.cbr-xml-daily.ru/daily_json.js',
      )
      .then((response) => {
        response.data.Valute.RUB = { CharCode: 'RUB', Value: 1 };
        return response;
      });
    return (
      response.data.Valute[from].Value * (1 / response.data.Valute[to].Value)
    );
  }

  public async convertToEur(): Promise<EurMoneyVO> {
    return MoneyVO.convert(this.currency, Currency.eur, this.props.value).then(
      (amount) => new EurMoneyVO(amount),
    );
  }

  public async convertToUsd(): Promise<UsdMoneyVO> {
    return MoneyVO.convert(this.currency, Currency.usd, this.props.value).then(
      (amount) => new UsdMoneyVO(amount),
    );
  }

  public convertToRub(): Promise<RubMoneyVO> {
    return MoneyVO.convert(this.currency, Currency.rub, this.props.value).then(
      (amount) => new RubMoneyVO(amount),
    );
  }
}

export class RubMoneyVO extends MoneyVO {
  public readonly currency = Currency.rub as const;

  constructor(amount: number) {
    super(amount, Currency.rub);
  }

  async convertToRub(): Promise<RubMoneyVO> {
    return new RubMoneyVO(this.props.value);
  }
}

export class UsdMoneyVO extends MoneyVO {
  public readonly currency = Currency.usd as const;

  constructor(amount: number) {
    super(amount, Currency.usd);
  }

  async convertToUsd(): Promise<UsdMoneyVO> {
    return new UsdMoneyVO(this.props.value);
  }
}

export class EurMoneyVO extends MoneyVO {
  public readonly currency = Currency.eur as const;

  constructor(amount: number) {
    super(amount, Currency.eur);
  }

  async convertToEur(): Promise<EurMoneyVO> {
    return new EurMoneyVO(this.props.value);
  }
}
