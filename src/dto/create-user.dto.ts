import { UserEntity, CurrencyEntity } from 'src/entities';

export class CreateUserDto {
  displayName: string;
  picture: string;
  emails: any;
  roles: any;
  referrer?: UserEntity;
  referrerId: number;
  cloudpaymentsToken: string;
  insolvent: boolean;
  auth0id: string;
  currency: CurrencyEntity;
  language: string;
}
