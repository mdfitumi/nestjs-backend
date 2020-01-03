import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  Table,
  TableForeignKey,
} from 'typeorm';

export class PublicUserTable1578035934083 implements MigrationInterface {
  private readonly tableName = 'public.users';
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
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
          new TableColumn({ name: 'displayName', type: 'text' }),
          new TableColumn({ name: 'picture', type: 'text' }),
          new TableColumn({ name: 'emails', type: 'json' }),
          new TableColumn({ name: 'roles', type: 'json' }),
          new TableColumn({
            name: 'referrerId',
            type: 'integer',
            isNullable: true,
          }),
          new TableColumn({
            name: 'cloudpaymentsToken',
            type: 'character varying',
            length: '128',
          }),
          new TableColumn({
            name: 'insolvent',
            type: 'boolean',
            default: false,
            isNullable: false,
          }),
          new TableColumn({ name: 'auth0id', type: 'text', isNullable: false }),
          new TableColumn({
            name: 'trialEndsAt',
            type: 'timestamp with time zone',
            isNullable: true,
            default: "now() + '2 days'::interval",
            comment: 'Дата окончания тестового периода',
          }),
          new TableColumn({
            name: 'currencyId',
            type: 'character varying',
            length: '3',
            isNullable: false,
            default: "'RUB'::character varying",
          }),
          new TableColumn({ name: 'language', type: 'text' }),
          new TableColumn({
            name: 'createdAt',
            type: 'timestamp with time zone',
            default: 'now()',
          }),
          new TableColumn({
            name: 'updatedAt',
            type: 'timestamp with time zone',
          }),
        ],
      }),
      true,
      true,
    );
    await queryRunner.createForeignKeys(this.tableName, [
      new TableForeignKey({
        columnNames: ['referrerId'],
        referencedColumnNames: ['id'],
        referencedTableName: this.tableName,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['currencyId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'public.currency',
        onDelete: 'SET DEFAULT',
        onUpdate: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.dropTable(this.tableName);
  }
}
