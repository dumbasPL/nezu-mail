import {MigrationInterface, QueryRunner} from 'typeorm';

export class addDomainWhitelist1630287443393 implements MigrationInterface {

    name = 'addDomainWhitelist1630287443393'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('CREATE TABLE `domain` (`domain` varchar(255) NOT NULL, PRIMARY KEY (`domain`)) ENGINE=InnoDB');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('DROP TABLE `domain`');
    }

}
