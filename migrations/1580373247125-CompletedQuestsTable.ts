import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { InstagramQuestType1578039040144 } from './1578039040144-InstagramQuestType';
import { InstagramCampaignTable1578040089815 } from './1578040089815-InstagramCampaignTable';
import { PublicUserTable1578035934083 } from './1578035934083-PublicUserTable';

export class CompletedQuestsTable1580373247125 implements MigrationInterface {
  private readonly tableName = 'instagram.completed_quests';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      InstagramQuestType1578039040144.tableName,
      'id',
      new TableColumn({
        name: 'id',
        type: 'smallint',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      }),
    );
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          new TableColumn({
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          }),
          new TableColumn({
            name: 'campaignId',
            type: 'integer',
            isNullable: false,
          }),
          new TableColumn({
            name: 'userId',
            type: 'integer',
            isNullable: false,
          }),
          new TableColumn({
            name: 'rewardAmount',
            type: 'decimal',
            isNullable: false,
          }),
          new TableColumn({
            name: 'createdAt',
            type: 'timestamp with time zone',
            default: 'now()',
          }),
        ],
      }),
    );
    await queryRunner.createForeignKeys(this.tableName, [
      new TableForeignKey({
        columnNames: ['campaignId'],
        referencedColumnNames: ['id'],
        referencedTableName: InstagramCampaignTable1578040089815.tableName,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: PublicUserTable1578035934083.tableName,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(this.tableName);
    await queryRunner.changeColumn(
      InstagramQuestType1578039040144.tableName,
      'id',
      new TableColumn({
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      }),
    );
  }
}
