import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'timer',
  templateUrl: 'timer.html'
})
export class TimerComponent {
  startTime: any;
  endTime: any;
  timeDiff: 0;
  timerDisplay: string = '00:00:00';
  timerActive: boolean = false;
  @Output() result: EventEmitter<any> = new EventEmitter();
  @Input() control: string;

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('control')) {
      switch (changes.control.currentValue) {
        case 'start':
          this.startTimer();
        break;
        case 'stop':
          this.stopTimer();
        break;
        case 'reset':
          this.reset();
        break;
      }
    }
  }
  
  startTimer() {
    if (this.timerActive) {
      return;
    }

    this.startTime = moment();
    this.timerActive = true;
    this.tick();
  }

  stopTimer() {
    if (!this.timerActive) {
      return;
    }

    this.timerActive = false;
    this.timeDiff += moment().diff(this.startTime);
    this.result.emit(this.timeDiff);
  }

  reset() {
    this.stopTimer;
    this.timeDiff = 0;
    this.timerDisplay = this.getMSAsDigitalClock(this.timeDiff);
  }

  tick() {
    setTimeout(() => {
      if (!this.timerActive) {
        return;
      }

      this.endTime = moment();

      let ms = moment().diff(this.startTime, 'milliseconds') + this.timeDiff;

      this.timerDisplay = this.getMSAsDigitalClock(ms);
      this.result.emit(ms);

      this.tick();
    }, 100);
  }

  getMSAsDigitalClock(milliseconds: number) {
    let duration = moment.duration(milliseconds, 'milliseconds');

    let hourString = duration.hours() < 10 ? `0${duration.hours()}` : `${duration.hours()}`;
    let minuteString = duration.minutes() < 10 ? `0${duration.minutes()}` : `${duration.minutes()}`;
    let secondString = duration.seconds() < 10 ? `0${duration.seconds()}` : `${duration.seconds()}`;

    return `${hourString}:${minuteString}:${secondString}`;
  }
}
