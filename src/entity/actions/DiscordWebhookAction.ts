import axios from 'axios';
import {ChildEntity, Column} from 'typeorm';
import {getUrl} from '../../Util';
import {Action} from '../Action';
import {Mail} from '../Mail';

@ChildEntity()
export class DiscordWebhookAction extends Action {

  className: string = 'DiscordWebhookAction';

  @Column()
  webhookUrl: string;

  execute(mail: Mail): boolean {
    axios.post(this.webhookUrl, {
      embeds: [
        {
          title: mail.subject,
          url: getUrl('/mail/' + mail.id),
          timestamp: mail.date,
          fields: [
            {
              name: 'inbox',
              value: mail.inbox,
              inline: true
            }
          ],
          author: {name: mail.sender},
        }
      ]
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
