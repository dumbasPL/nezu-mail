import {ChildEntity} from 'typeorm';
import {Action} from '../Action';
import {Mail} from '../Mail';

@ChildEntity()
export class DeleteAction extends Action {

  className: string = 'DeleteAction';

  execute(mail: Mail): boolean {
    mail.remove();
    return false;
  }

}
