import axios from 'axios';
import {ChildEntity, Column} from 'typeorm';
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
    }).then(() => {
      if (this.lastError != this.lastError) {
        this.lastError = null;
        this.save();
      }
    }).catch(e => {
      this.lastError = e.massage ?? e;
      this.save();
    });
    return true;
  }

}
