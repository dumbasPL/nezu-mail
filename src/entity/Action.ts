import {BaseEntity, Column, Entity, PrimaryGeneratedColumn, TableInheritance} from 'typeorm';
import {Mail} from './Mail';

@Entity({orderBy: {
  priority: 'DESC',
  id: 'DESC'
}})
@TableInheritance({column: {type: 'varchar', name: 'type'}})
export abstract class Action extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  sender?: string;

  @Column({
    nullable: true,
  })
  inbox?: string;

  @Column({
    nullable: true,
  })
  subject?: string;

  @Column({
    nullable: true,
  })
  lastError?: string;

  @Column()
  priority: number;

  @Column({
    default: true
  })
  active: boolean;

  abstract className: string;

  private senderRegex?: RegExp;

  private inboxRegex?: RegExp;

  private subjectRegex?: RegExp;

  abstract execute(mail : Mail): boolean;

  match(mail: Mail) {
    if (!this.senderRegex && this.sender && this.sender.length > 0) {
      this.senderRegex = new RegExp(this.sender, 'im');
    }
    if (!this.inboxRegex && this.inbox && this.inbox.length > 0) {
      this.inboxRegex = new RegExp(this.inbox, 'im');
    }
    if (!this.subjectRegex && this.subject && this.subject.length > 0) {
      this.subjectRegex = new RegExp(this.subject, 'im');
    }

    let matches = true;

    matches &&= this.senderRegex == undefined || this.senderRegex.test(mail.sender);
    matches &&= this.inboxRegex == undefined || this.inboxRegex.test(mail.inbox);
    matches &&= this.subjectRegex == undefined || this.subjectRegex.test(mail.subject);

    return matches;
  }

}
