import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'countdown',
  templateUrl: 'countdown.html'
})
export class CountdownComponent {
  startTime: any;
  endTime: any;
  timeDiff: number = 0;
  timerDisplay: string = '00:00:00';
  timerActive: boolean = false;
  @Output() result: EventEmitter<any> = new EventEmitter();
  @Input() control: string;
  @Input() time: any = 0; // numnber of ms to count down from

  constructor() {
    this.time = parseFloat(this.time);
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
        case 'time':
          this.time = parseFloat(this.time);
        break;
      }
    }
  }
  
  startTimer() {
    this.startTime = moment();
    this.timerActive = true;
    this.tick();
  }

  stopTimer() {
    this.timerActive = false;
    this.timeDiff -= moment().diff(this.startTime);
    this.result.emit(this.timeDiff);
  }

  reset() {
    this.stopTimer;
    this.time = parseFloat(this.time);
    this.timeDiff = this.time;
    this.timerDisplay = this.getMSAsDigitalClock(this.timeDiff);
  }

  tick() {
    setTimeout(() => {
      if (!this.timerActive) {
        return;
      }

      this.endTime = moment();

      let ms = this.timeDiff - moment().diff(this.startTime, 'milliseconds');

      if (ms <= 0) {
        this.timeDiff = 0;
        this.timerActive = false;
        this.result.emit(true);
        return;
      }

      this.timerDisplay = this.getMSAsDigitalClock(ms);

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
