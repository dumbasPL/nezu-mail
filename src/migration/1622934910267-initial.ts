import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1622934910267 implements MigrationInterface {
    name = 'initial1622934910267'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `access_token` (`token` varchar(32) NOT NULL, PRIMARY KEY (`token`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `mail` (`id` int NOT NULL AUTO_INCREMENT, `sender` varchar(255) NOT NULL, `inbox` varchar(255) NOT NULL, `subject` varchar(255) NOT NULL, `date` datetime NOT NULL, `body` longtext NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `mail`");
        await queryRunner.query("DROP TABLE `access_token`");
    }

}
