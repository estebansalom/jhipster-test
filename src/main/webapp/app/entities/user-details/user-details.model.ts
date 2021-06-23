import { ILicense } from 'app/entities/license/license.model';
import { IWallet } from 'app/entities/wallet/wallet.model';
import { IContact } from 'app/entities/contact/contact.model';

export interface IUserDetails {
  id?: number;
  country?: string | null;
  phone?: string | null;
  license?: ILicense | null;
  wallets?: IWallet[] | null;
  contacts?: IContact[] | null;
}

export class UserDetails implements IUserDetails {
  constructor(
    public id?: number,
    public country?: string | null,
    public phone?: string | null,
    public license?: ILicense | null,
    public wallets?: IWallet[] | null,
    public contacts?: IContact[] | null
  ) {}
}

export function getUserDetailsIdentifier(userDetails: IUserDetails): number | undefined {
  return userDetails.id;
}
