import { CurrencyEntity } from 'src/entities';

export class CreateUserDto {
  displayName: string;
  picture: string;
  emails: any;
  roles: any;
  referrerId?: number;
  currencyId: string;
  cloudpaymentsToken: string;
  insolvent: boolean;
  auth0id: string;
  currency: CurrencyEntity;
  language: string;
}
