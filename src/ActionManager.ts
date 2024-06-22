import {Action} from './entity/Action';
import {Mail} from './entity/Mail';

export class ActionManager {

  static actions: Action[];

  static async reload() {
    this.actions = await Action.findBy({});
    console.log(`${this.actions.length} action(s) loaded`);
  }

  static run(mail: Mail): boolean {
    for (const action of this.actions) {
      if (action.active && action.match(mail) && !action.execute(mail)) {
        return false;
      }
    }
    return true;
  }

}
