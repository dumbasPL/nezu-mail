import axios from 'axios';
import {ChildEntity, Column, getConnection} from 'typeorm';
import {getUrl} from '../../Util';
import {Action} from '../Action';
import {Mail} from '../Mail';

@ChildEntity()
export class WebhookAction extends Action {

  className: string = 'WebhookAction';

  @Column()
    webhookUrl: string;

  execute(mail: Mail): boolean {
    axios.post(this.webhookUrl, {
      ...mail,
      mailURL: getUrl('/mail/' + mail.id),
      action: this
    }, {
      headers: {'User-Agent': 'NezuMail'}
    }).then(async () => {
      if (this.lastError != null) {
        await getConnection().createQueryBuilder().update(Action).set({
          lastError: null
        }).where('id = :id', {id: this.id}).execute();
      }
    }).catch(async e => {
      await getConnection().createQueryBuilder().update(Action).set({
        lastError: e.massage ?? e.toString()
      }).where('id = :id', {id: this.id}).execute();
    });
    return true;
  }

}
