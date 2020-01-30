import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { InstagramCampaignEntity } from 'src/entities';
import { ManyToOne } from 'typeorm';
import { PublicUserEntity } from './public.user.entity';

@Entity({
  name: 'instagram.completed_quests',
})
export class InstagramCompletedQuestEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => InstagramCampaignEntity)
  @JoinColumn({ name: 'campaignId' })
  campaign: InstagramCampaignEntity;
  @Column()
  campaignId: number;
  @ManyToOne(() => PublicUserEntity)
  @JoinColumn({ name: 'userId' })
  user: PublicUserEntity;
  @Column()
  userId: number;
  @Column()
  rewardAmount: number;
  @Column({ default: 'now()' })
  createdAt: Date;
}
