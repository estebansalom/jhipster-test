import { ITransaction } from 'app/entities/transaction/transaction.model';

export interface ICurrency {
  id?: number;
  name?: string | null;
  conversionRate?: number | null;
  transactions?: ITransaction[] | null;
}

export class Currency implements ICurrency {
  constructor(
    public id?: number,
    public name?: string | null,
    public conversionRate?: number | null,
    public transactions?: ITransaction[] | null
  ) {}
}

export function getCurrencyIdentifier(currency: ICurrency): number | undefined {
  return currency.id;
}
