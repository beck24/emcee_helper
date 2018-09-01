import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-timer',
  templateUrl: 'timer.html',
})
export class TimerPage {
  timerControl: String = 'reset';
  timerConfig: any = {
    good: 0,
    warn: 20000,
    danger: 30000,
    limit: 40000,
  };
  timerClasses: any = {
    good: true,
    warn: false,
    danger: false,
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // enforce landscape
  }

  startTimer() {
    this.timerControl = 'start';
  }

  stopTimer() {
    this.timerControl = 'stop';
  }

  resetTimer() {
    this.timerControl = 'reset';
  }

  timerResult(event) {
    console.log(event);

    this.setClasses(event);
  }

  setClasses(time) {
    
    if (time >= this.timerConfig.good && time < this.timerConfig.warn) {
      this.timerClasses.good = true;
    }
    else {
      this.timerClasses.good = false;
    }

    if (time >= this.timerConfig.warn && time < this.timerConfig.danger) {
      this.timerClasses.warn = true;
    }
    else {
      this.timerClasses.warn = false;
    }

    if (time >= this.timerConfig.danger) {
      this.timerClasses.danger = true;
    }
    else {
      this.timerClasses.danger = false;
    }
  }

  goHome() {
    this.navCtrl.setRoot('HomePage');
  }

}
