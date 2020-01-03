import { MigrationInterface, QueryRunner } from 'typeorm';

export class InstagramSchema1578030411086 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.createSchema('instagram', true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.dropSchema('instagram');
  }
}
