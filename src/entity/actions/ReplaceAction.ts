import {ChildEntity, Column} from 'typeorm';
import {Action} from '../Action';
import {Mail} from '../Mail';

@ChildEntity()
export class ReplaceAction extends Action {

  className: string = 'ReplaceAction';

  @Column()
  regex: string;

  @Column()
  replacement: string;

  private compiledRegex?: RegExp;

  execute(mail: Mail): boolean {
    if (!this.compiledRegex) {
      this.compiledRegex = new RegExp(this.regex, 'gmi');
    }
    mail.body = mail.body.replace(this.compiledRegex, this.replacement);
    mail.save();
    return true;
  }

}
