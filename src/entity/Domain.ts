import {BaseEntity, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class Domain extends BaseEntity {

  @PrimaryColumn()
  domain: string;

}
