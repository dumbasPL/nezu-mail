import { EventEmitter } from "events";
import { Mail } from "./entity/Mail";

export declare interface MailEvent {
  on(event: 'newMail', listener: (mail: Mail) => void): this;
}

export class MailEvent extends EventEmitter {
  emitNewMail(mail: Mail): void {
    this.emit('newMail', mail);
  }
}