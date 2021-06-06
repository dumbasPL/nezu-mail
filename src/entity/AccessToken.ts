import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class AccessToken extends BaseEntity {

  @PrimaryColumn({
    length: 32
  })
  token: string;

  @Column()
  name: string;

}