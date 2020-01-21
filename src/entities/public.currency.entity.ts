import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'public.user',
})
export class CurrencyEntity {
  @PrimaryColumn()
  id: string;
  @Column({ nullable: false })
  template: string;
}
