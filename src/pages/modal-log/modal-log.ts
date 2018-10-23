import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoggerProvider } from '../../providers/logger/logger';
import moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-modal-log',
  templateUrl: 'modal-log.html',
})
export class ModalLogPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public logger: LoggerProvider,
  ) {
  }

  formatTime(time) {
    return moment(time).format('YYYY-MM-DD hh:mm:ss a');
  }

  clearLog() {
    this.logger.clearLog();
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
