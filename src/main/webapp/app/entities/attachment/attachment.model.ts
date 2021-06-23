import { ITransaction } from 'app/entities/transaction/transaction.model';

export interface IAttachment {
  id?: number;
  url?: string | null;
  name?: string | null;
  alt?: string | null;
  description?: string | null;
  transaction?: ITransaction | null;
}

export class Attachment implements IAttachment {
  constructor(
    public id?: number,
    public url?: string | null,
    public name?: string | null,
    public alt?: string | null,
    public description?: string | null,
    public transaction?: ITransaction | null
  ) {}
}

export function getAttachmentIdentifier(attachment: IAttachment): number | undefined {
  return attachment.id;
}
