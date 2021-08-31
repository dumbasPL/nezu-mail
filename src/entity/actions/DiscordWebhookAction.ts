import axios from 'axios';
import {ChildEntity, Column, getConnection} from 'typeorm';
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
    }).then(async () => {
      if (this.lastError != null) {
        await getConnection().createQueryBuilder().update(Action).set({
          lastError: null
        }).where('id = :id', {id: this.id}).execute();
      }
    }).catch(async e => {
      console.log(e);
      await getConnection().createQueryBuilder().update(Action).set({
        lastError: e.massage ?? e.toString()
      }).where('id = :id', {id: this.id}).execute();
    });
    return true;
  }

}
