import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'public.servers',
})
export class ServerEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  threads: number;
  @Column({ nullable: false })
  description: string;
}
