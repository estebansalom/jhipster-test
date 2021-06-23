import { ITransaction } from 'app/entities/transaction/transaction.model';
import { IUserDetails } from 'app/entities/user-details/user-details.model';
import { IIcon } from 'app/entities/icon/icon.model';

export interface IWallet {
  id?: number;
  name?: string | null;
  description?: string | null;
  currency?: string | null;
  initialBalance?: number | null;
  inReports?: boolean | null;
  transactions?: ITransaction[] | null;
  user?: IUserDetails | null;
  icon?: IIcon | null;
}

export class Wallet implements IWallet {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public currency?: string | null,
    public initialBalance?: number | null,
    public inReports?: boolean | null,
    public transactions?: ITransaction[] | null,
    public user?: IUserDetails | null,
    public icon?: IIcon | null
  ) {
    this.inReports = this.inReports ?? false;
  }
}

export function getWalletIdentifier(wallet: IWallet): number | undefined {
  return wallet.id;
}
