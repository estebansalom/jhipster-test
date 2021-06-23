import { IInvoice } from 'app/entities/invoice/invoice.model';
import { IUserDetails } from 'app/entities/user-details/user-details.model';

export interface ILicense {
  id?: number;
  invoice?: IInvoice | null;
  userDetails?: IUserDetails | null;
}

export class License implements ILicense {
  constructor(public id?: number, public invoice?: IInvoice | null, public userDetails?: IUserDetails | null) {}
}

export function getLicenseIdentifier(license: ILicense): number | undefined {
  return license.id;
}
