import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public bluetooth: BluetoothProvider
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
}
