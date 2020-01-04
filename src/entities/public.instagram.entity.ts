import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'public.instagram',
})
export class InstagramEntity {
  @PrimaryColumn()
  id: number;
  @Column()
  username: string;

  @Column()
  createdAt: Date;
}
