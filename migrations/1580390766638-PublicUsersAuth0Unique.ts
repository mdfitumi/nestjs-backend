import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { PublicUserTable1578035934083 } from './1578035934083-PublicUserTable';

export class PublicUsersAuth0Unique1580390766638 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.changeColumn(
      PublicUserTable1578035934083.tableName,
      'auth0id',
      new TableColumn({
        name: 'auth0id',
        type: 'text',
        isNullable: false,
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.changeColumn(
      PublicUserTable1578035934083.tableName,
      'auth0id',
      new TableColumn({
        name: 'auth0id',
        type: 'text',
        isNullable: false,
      }),
    );
  }
}
