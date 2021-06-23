import { ICategory } from 'app/entities/category/category.model';
import { IWallet } from 'app/entities/wallet/wallet.model';

export interface IIcon {
  id?: number;
  icon?: string | null;
  type?: string | null;
  name?: string | null;
  categories?: ICategory[] | null;
  wallets?: IWallet[] | null;
}

export class Icon implements IIcon {
  constructor(
    public id?: number,
    public icon?: string | null,
    public type?: string | null,
    public name?: string | null,
    public categories?: ICategory[] | null,
    public wallets?: IWallet[] | null
  ) {}
}

export function getIconIdentifier(icon: IIcon): number | undefined {
  return icon.id;
}
