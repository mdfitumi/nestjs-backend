import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActiveCampaignsView1578906295855 implements MigrationInterface {
  public static readonly tableName = 'instagram.active_campaigns';
  public async up(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.query(
      `CREATE OR REPLACE VIEW ${ActiveCampaignsView1578906295855.tableName} AS SELECT * FROM instagram.campaign c WHERE enabled = true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.dropView(ActiveCampaignsView1578906295855.tableName);
  }
}
