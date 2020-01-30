import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class InstagramQuestType1578039040144 implements MigrationInterface {
  public static readonly tableName = 'instagram.quest_type';

  public async up(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.createTable(
      new Table({
        name: InstagramQuestType1578039040144.tableName,
        columns: [
          new TableColumn({
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          }),
          new TableColumn({
            name: 'typeName',
            type: 'text',
            isNullable: false,
          }),
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.dropTable(InstagramQuestType1578039040144.tableName);
  }
}
