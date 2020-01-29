import { InstagramQuestTypeEntity } from '../entities';
export interface InstagramQuest {
  questId: string;
  expireDurationSeconds: number;
  type: InstagramQuestTypeEntity;
}

export interface InstagramQuestEvent extends InstagramQuest {
  subscriptionId: string;
}
