import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'instagram.quest_type',
})
export class InstagramQuestTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  typeName: string;
}
