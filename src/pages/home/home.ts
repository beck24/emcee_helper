import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';

import str2ab from 'string-to-arraybuffer';
import ab2str from 'arraybuffer-to-string';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  socketId: any;
  uuid: string = '94f39d29-7d6d-437d-973b-fba39e49d4ee';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public modalCtrl: ModalController,
    public bluetooth: BluetoothProvider,
  ) {
    
  }

  ionViewDidEnter() {
    
  }

  searchForDevices() {
    const modal = this.modalCtrl.create('ModalConnectPage');
    modal.present();
  }

  getAdapterInfo() {
    this.bluetooth.getAdapterInfo().then(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log('error', err);
    });
  }

  requestEnable() {
    this.bluetooth.requestEnable();
  }

  getDevices() {
    this.bluetooth.getDevices().then((res) => {
      console.log(res);
    },
    (err) => {
      console.log(err);
    });
  }

  listen() {
    this.bluetooth.getDevices().then((devices: [any]) => {
      console.log(devices);

      for (var i = 0; i < devices.length; i++) {
        this.bluetooth.updateDeviceName(devices[i]);
      }

      this.bluetooth.startDiscovery().then(() => {
        console.log('discovery done');
      });
    });
  }

  requestDiscoverable() {
    this.bluetooth.requestDiscoverable().then(() => {});
    this.listenRF();
  }

  listenRF() {
    this.bluetooth.listenUsingRfcomm(this.uuid).then((socketId) => {
      console.log('found socket id!');
      console.log(socketId);
    },
    (err) => {
      console.log(err);
    });
  }

  connectToEddie() {
    let address = '18:3A:2D:2C:8D:AA';

    this.bluetooth.connect(address, this.uuid).then((res) => {
      console.log('connected1');
      console.log(res);
      this.socketId = res;
    },
    (err) => {
      console.log('connection failed');
      console.log(err);
    });
  }

  disconnect() {
    this.bluetooth.close(this.socketId);
  }

  testConversion() {
    let json = {
      type: 'action',
      name: 'alert',
      value: 'Wrap it up',
    };

    const buffer = this.jsonToBuffer(json);

    console.log(buffer);

    const newJson = this.bufferToJson(buffer);

    console.log(newJson);
  }

  jsonToBuffer(json) {
    return str2ab(JSON.stringify(json));
  }

  bufferToJson(buffer) {
    return JSON.parse(ab2str(buffer));
  }
}
