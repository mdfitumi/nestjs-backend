import { CurrencyEntity } from './public.currency.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'public.user',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  displayName: string;
  @Column()
  picture: string;
  @Column()
  emails: any;
  @Column()
  roles: any;
  @OneToOne(
    () => UserEntity,
    source => source.referrer,
  )
  @JoinColumn({ name: 'referrerId' })
  referrer: UserEntity;
  @Column()
  referrerId: number;
  @Column()
  cloudpaymentsToken: string;
  @Column()
  insolvent: boolean;
  @Column()
  auth0id: string;
  @Column({
    nullable: true,
    type: 'timestamp with time zone',
    default: "now() + '2 days'::interval",
  })
  trialEndsAt: Date;
  @Column()
  trialActivated: boolean;
  @OneToOne(() => CurrencyEntity)
  @JoinColumn({ name: 'currencyId' })
  currency: CurrencyEntity;
  @Column()
  currencyId: number;
  @Column()
  language: string;
  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;
}
