import { InstagramQuestTypeEntity } from '../entities';
export interface InstagramQuest {
  expireDurationSeconds: number;
  type: InstagramQuestTypeEntity;
}
