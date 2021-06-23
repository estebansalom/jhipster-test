import { ILicense } from 'app/entities/license/license.model';

export interface IInvoice {
  id?: number;
  name?: string | null;
  license?: ILicense | null;
}

export class Invoice implements IInvoice {
  constructor(public id?: number, public name?: string | null, public license?: ILicense | null) {}
}

export function getInvoiceIdentifier(invoice: IInvoice): number | undefined {
  return invoice.id;
}
