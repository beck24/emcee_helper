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

      devices.forEach((device) => {
        this.bluetooth.updateDeviceName(device);
      });

      this.bluetooth.startDiscovery()
      .catch((err) => {
        console.log(err);
      });
    });
  }

  connect(device) {
    console.log('connecting device');
    this.bluetooth.connect(device.address, this.bluetooth.uuid).then(
      (socketId) => {
        console.log('success!');

        this.bluetooth.connection.sendSocketId = socketId;

        console.log('sending data');
        this.bluetooth.send({ message: 'Hello world' });

        // listen for our own return messages
        if (!this.bluetooth.connection.listenSocketId) {
          this.bluetooth.listenUsingRfcomm(this.bluetooth.uuid).then((socketId) => {
            this.bluetooth.connection.listenSocketId = socketId;

            console.log(this.bluetooth.connection);

            this.bluetooth.send({ type: 'reciprocalConnect', data: {
              uuid: this.bluetooth.uuid,
              address: this.bluetooth.info.address,
            }});
          },
          (err) => {
            console.log(err);
          });
        }
      },
      (err) => {
        console.log('fail...');
        console.log(err);
      }
    );
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
