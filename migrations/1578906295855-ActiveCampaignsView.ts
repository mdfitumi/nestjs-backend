import { MigrationInterface, QueryRunner } from 'typeorm';
import { View } from 'typeorm/schema-builder/view/View';

export class ActiveCampaignsView1578906295855 implements MigrationInterface {
  private readonly tableName = 'instagram.active_campaigns';
  public async up(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.query(
      `CREATE VIEW ${this.tableName} AS SELECT * FROM instagram.campaign c WHERE enabled = true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.dropView(this.tableName);
  }
}
