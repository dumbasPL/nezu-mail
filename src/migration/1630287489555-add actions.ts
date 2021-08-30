import {MigrationInterface, QueryRunner} from 'typeorm';

export class addActions1630287489555 implements MigrationInterface {

    name = 'addActions1630287489555'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('CREATE TABLE `action` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `sender` varchar(255) NULL, `inbox` varchar(255) NULL, `subject` varchar(255) NULL, `lastError` varchar(255) NULL, `priority` int NOT NULL, `webhookUrl` varchar(255) NULL, `regex` varchar(255) NULL, `replacement` varchar(255) NULL, `type` varchar(255) NOT NULL, INDEX `IDX_11db75ea5697b4c806aedc0739` (`type`), PRIMARY KEY (`id`)) ENGINE=InnoDB');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('DROP INDEX `IDX_11db75ea5697b4c806aedc0739` ON `action`');
      await queryRunner.query('DROP TABLE `action`');
    }

}
