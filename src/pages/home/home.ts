import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  timerControl: String = 'reset';
  cdControl: String = 'reset';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public modalCtrl: ModalController,
    public bluetooth: BluetoothProvider,
  ) {

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
  }

  startCD() {
    this.cdControl = 'start';
  }

  stopCD() {
    this.cdControl = 'stop';
  }

  resetCD() {
    this.cdControl = 'reset';
  }

  cdResult(event) {
    console.log(event);
  }

  goTimer() {
    this.navCtrl.setRoot('TimerPage');
  }

  searchForDevices() {
    const modal = this.modalCtrl.create('ModalConnectPage');
    modal.present();
  }

  requestEnable() {
    this.bluetooth.requestEnable().catch((err) => {
      console.log(err);
    });
  }

  requestDiscoverable() {
    this.bluetooth.requestDiscoverable().catch((err) => {
      console.log(err);
    });
    
    this.bluetooth.listenUsingRfcomm(this.bluetooth.uuid).then((socketId) => {
      console.log('found socket id!');
      console.log(socketId);
      this.bluetooth.connection.listenSocketId = socketId;

      this.bluetooth.send({ message: 'ok cool, both ways' });
    },
    (err) => {
      console.log(err);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  sendMessage() {
    this.bluetooth.send({ message: 'message sent!' }).catch((err) => {
      console.log(err);
    });
  }

  disconnect() {
    this.bluetooth.close();
  }
}
