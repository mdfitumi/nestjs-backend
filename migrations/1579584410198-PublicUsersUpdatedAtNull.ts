import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class PublicUsersUpdatedAtNull1579584410198
  implements MigrationInterface {
  name = 'PublicUsersUpdatedAtNull1579584410198';
  private readonly tableName = 'public.users';

  public async up(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.changeColumn(
      this.tableName,
      'updatedAt',
      new TableColumn({
        name: 'updatedAt',
        type: 'timestamp with time zone',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.changeColumn(
      this.tableName,
      'updatedAt',
      new TableColumn({
        name: 'updatedAt',
        type: 'timestamp with time zone',
      }),
    );
  }
}
