import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import moment from 'moment';

@Injectable()
export class LoggerProvider {

  public messages: any[] = [];

  constructor(
    public platform: Platform
  ) {

  }

  log(message) {
      const log: any = {
        time: moment().format(),
        message,
      };

      this.messages.push(log);

      console.log(message);
  }

  clearLog() {
      this.messages = [];
  }
}
