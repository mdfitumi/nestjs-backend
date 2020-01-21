import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class PublicRolesDefault1579586978737 implements MigrationInterface {
  name = 'PublicRolesDefault1579586978737';
  private readonly tableName = 'public.users';

  public async up(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.changeColumn(
      this.tableName,
      'roles',
      new TableColumn({
        name: 'roles',
        type: 'json',
        default: "'[]'::jsonb",
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.changeColumn(
      this.tableName,
      'roles',
      new TableColumn({ name: 'roles', type: 'json' }),
    );
  }
}
