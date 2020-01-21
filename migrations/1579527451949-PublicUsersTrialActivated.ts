import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class PublicUsersTrialActivated1579527451949
  implements MigrationInterface {
  name = 'PublicUsersTrialActivated1579527451949';
  private readonly tableName = 'public.users';

  public async up(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.addColumn(
      this.tableName,
      new TableColumn({
        name: 'trialActivated',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.dropColumn(this.tableName, 'trialActivated');
  }
}
