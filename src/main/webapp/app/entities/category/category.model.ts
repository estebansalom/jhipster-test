import { ITransaction } from 'app/entities/transaction/transaction.model';
import { IIcon } from 'app/entities/icon/icon.model';

export interface ICategory {
  id?: number;
  name?: string | null;
  categories?: ICategory[] | null;
  transactions?: ITransaction[] | null;
  icon?: IIcon | null;
  parent?: ICategory | null;
}

export class Category implements ICategory {
  constructor(
    public id?: number,
    public name?: string | null,
    public categories?: ICategory[] | null,
    public transactions?: ITransaction[] | null,
    public icon?: IIcon | null,
    public parent?: ICategory | null
  ) {}
}

export function getCategoryIdentifier(category: ICategory): number | undefined {
  return category.id;
}
