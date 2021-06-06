import {MigrationInterface, QueryRunner} from "typeorm";

export class addTokenName1622940571300 implements MigrationInterface {
    name = 'addTokenName1622940571300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `access_token` ADD `name` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `access_token` DROP COLUMN `name`");
    }

}
