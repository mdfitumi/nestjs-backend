import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type InstagramCampaignId = number;

@Entity({
  name: 'instagram.campaign',
})
export class InstagramCampaignEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  questExpireDurationSeconds: number;
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
