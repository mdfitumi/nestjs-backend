import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class CampaignEnabledField1578904694153 implements MigrationInterface {
  private readonly tableName = 'instagram.campaign';
  public async up(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.addColumn(
      this.tableName,
      new TableColumn({
        name: 'enabled',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.dropColumn(this.tableName, 'enabled');
  }
}
