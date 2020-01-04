import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class InstagramCampaignTable1578040089815 implements MigrationInterface {
  private readonly tableName = 'instagram.campaign';
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
            name: 'questExpireDuration',
            type: 'interval',
            isNullable: false,
            comment:
              'Время, после которого квест будет считаться не выполненным',
          }),
          new TableColumn({
            name: 'allowedHeroes',
            type: 'json',
            isNullable: true,
            default: "'{}'::jsonb",
            comment:
              'Допускать к выполнению квестов кампании только определенных пользователей',
          }),
          new TableColumn({
            name: 'followersLowerBound',
            type: 'integer',
            isNullable: true,
            comment:
              'Минимальное количество подписчиков для допуска к выполнению задания кампании',
          }),
          new TableColumn({
            name: 'postsLowerBound',
            type: 'integer',
            isNullable: true,
            comment:
              'Минимальное количество постов в профиле для допуска к выполнению задания кампании',
          }),
          new TableColumn({
            name: 'workerId',
            type: 'integer',
            isNullable: false,
            comment: 'Воркер системы, который будет выполнять эту кампанию',
          }),
          new TableColumn({
            name: 'createdAt',
            type: 'timestamp with time zone',
            default: 'now()',
          }),
          new TableColumn({
            name: 'updatedAt',
            type: 'timestamp with time zone',
            isNullable: true,
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.dropTable(this.tableName);
  }
}
