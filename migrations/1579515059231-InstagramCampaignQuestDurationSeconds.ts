import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { ActiveCampaignsView1578906295855 } from './1578906295855-ActiveCampaignsView';

export class InstagramCampaignQuestDurationSeconds1579515059231
  implements MigrationInterface {
  private readonly tableName = 'instagram.campaign';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DROP VIEW ${ActiveCampaignsView1578906295855.tableName}`,
    );
    await queryRunner.changeColumn(
      this.tableName,
      'questExpireDuration',
      new TableColumn({
        name: 'questExpireDurationSeconds',
        type: 'integer',
        isNullable: false,
      }),
    );
    return new ActiveCampaignsView1578906295855().up(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DROP VIEW ${ActiveCampaignsView1578906295855.tableName}`,
    );
    await queryRunner.changeColumn(
      this.tableName,
      'questExpireDurationSeconds',
      new TableColumn({
        name: 'questExpireDuration',
        type: 'interval',
        isNullable: false,
      }),
    );
    return new ActiveCampaignsView1578906295855().up(queryRunner);
  }
}
