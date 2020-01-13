import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'instagram.campaign',
})
export class InstagramCampaignEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false, type: 'interval' })
  questExpireDuration: any;
  @Column({ nullable: true, default: "'{}'::jsonb", type: 'json' })
  allowedHeroes?: any;
  @Column({ nullable: true })
  followersLowerBound?: number;
  @Column({ nullable: true })
  postsLowerBound?: number;
  @Column({ nullable: false })
  workerId: number;
  @Column({ nullable: false })
  enabled: boolean;
  @Column({ default: 'now()' })
  createdAt: Date;
  @Column()
  updatedAt: Date;
}
