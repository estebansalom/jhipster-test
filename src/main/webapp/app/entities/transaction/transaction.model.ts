import * as dayjs from 'dayjs';
import { IAttachment } from 'app/entities/attachment/attachment.model';
import { IWallet } from 'app/entities/wallet/wallet.model';
import { ICurrency } from 'app/entities/currency/currency.model';
import { ICategory } from 'app/entities/category/category.model';

export interface ITransaction {
  name?: string | null;
  description?: string | null;
  date?: dayjs.Dayjs | null;
  amount?: number | null;
  type?: string | null;
  periodic?: boolean | null;
  id?: string;
  attachments?: IAttachment[] | null;
  wallet?: IWallet | null;
  currency?: ICurrency | null;
  category?: ICategory | null;
}

export class Transaction implements ITransaction {
  constructor(
    public name?: string | null,
    public description?: string | null,
    public date?: dayjs.Dayjs | null,
    public amount?: number | null,
    public type?: string | null,
    public periodic?: boolean | null,
    public id?: string,
    public attachments?: IAttachment[] | null,
    public wallet?: IWallet | null,
    public currency?: ICurrency | null,
    public category?: ICategory | null
  ) {
    this.periodic = this.periodic ?? false;
  }
}

export function getTransactionIdentifier(transaction: ITransaction): string | undefined {
  return transaction.id;
}
