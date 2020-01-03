import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class PublicCurrencyTable1578034341959 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'public.currency',
        columns: [
          new TableColumn({
            isPrimary: true,
            name: 'id',
            type: 'character varying',
            length: '3',
          }),
          new TableColumn({
            name: 'template',
            type: 'text',
            isNullable: false,
          }),
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.dropTable('public.currency');
  }
}
