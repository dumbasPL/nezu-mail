import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from 'typeorm';

@Entity()
export class Mail extends BaseEntity {

  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    sender: string;

  @Column()
    inbox: string;

  @Column()
    subject: string;

  @Column()
    date: Date;

  @Column('longtext')
    body: string;

}
