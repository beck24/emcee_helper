import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  socketId: any;
  uuid = '94f39d29-7d6d-437d-973b-fba39e49d4ee';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public bluetooth: BluetoothProvider,
  ) {
    bluetooth.addListener('onAdapterStateChange', this.onStateChange);
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

  onStateChange(adapterInfo) {
    console.log('state changed');
    console.log(adapterInfo);
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
  }

  connectToEddie() {
    let address = '18:3A:2D:2C:8D:AA';
    let name = 'Edison Beckett (Galaxy S4)';

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
}
