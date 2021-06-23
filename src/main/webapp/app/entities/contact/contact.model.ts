import { IUserDetails } from 'app/entities/user-details/user-details.model';

export interface IContact {
  id?: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  userDetails?: IUserDetails[] | null;
}

export class Contact implements IContact {
  constructor(
    public id?: number,
    public name?: string | null,
    public email?: string | null,
    public phone?: string | null,
    public userDetails?: IUserDetails[] | null
  ) {}
}

export function getContactIdentifier(contact: IContact): number | undefined {
  return contact.id;
}
