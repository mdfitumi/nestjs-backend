import { MigrationInterface, QueryRunner } from 'typeorm';

export class PublicCurrencies1579584751355 implements MigrationInterface {
  name = 'PublicCurrencies1579584751355';
  private readonly tableName = 'public.currency';

  public async up(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.query(
      `INSERT INTO ${this.tableName}(id, template) VALUES ('RUB', '<%- value %>₽'), ('USD', '$<%- value %>') `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.query(
      `DELETE FROM ${this.tableName} WHERE id = 'RUB' OR id = 'USD'`,
    );
  }
}
