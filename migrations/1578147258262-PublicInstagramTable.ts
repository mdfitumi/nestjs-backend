import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class PublicInstagramTable1578147258262 implements MigrationInterface {
  private readonly tableName = 'public.instagram';
  public async up(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          new TableColumn({
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          }),
          new TableColumn({
            name: 'username',
            type: 'text',
            isNullable: false,
          }),
          new TableColumn({
            name: 'createdAt',
            type: 'timestamp with time zone',
            default: 'now()',
          }),
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.dropTable(this.tableName);
  }
}
