import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';


@IonicPage()
@Component({
  selector: 'page-modal-connect',
  templateUrl: 'modal-connect.html',
})
export class ModalConnectPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public bluetooth: BluetoothProvider,
  ) {
  }

  ionViewDidLoad() {
    this.search();
  }

  search() {
    this.bluetooth.getDevices().then((devices: [any]) => {

      for (var i = 0; i < devices.length; i++) {
        this.bluetooth.updateDeviceName(devices[i]);
      }

      this.bluetooth.startDiscovery().then(() => {
        console.log('discovery done');
      });
    });
  }

  connect(device) {
    console.log('connecting device');
    this.bluetooth.connect(device.address, this.bluetooth.uuid).then(
      (socketId) => {
        console.log('success!');

        this.bluetooth.connection.device = device;
        this.bluetooth.connection.socketId = socketId;
      },
      (err) => {
        console.log('fail...');
        console.log(err);
      }
    )
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
