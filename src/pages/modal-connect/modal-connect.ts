import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';
import { LoggerProvider } from '../../providers/logger/logger';


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
    public logger: LoggerProvider,
  ) {
  }

  ionViewDidLoad() {
    this.search();
  }

  search() {
    // this.logger.log('searching for devices');
    // this.bluetooth.getDevices().then((devices: [any]) => {

    //   devices.forEach((device) => {
    //     this.bluetooth.updateDeviceName(device);
    //   });

    //   this.bluetooth.startDiscovery()
    //   .catch((err) => {
    //     this.logger.log('error with discovery: ' + JSON.stringify(err));
    //     console.log(err);
    //   });
    // });

    this.bluetooth.startDiscovery()
      .catch((err) => {
        this.logger.log('error with discovery: ' + JSON.stringify(err));
        console.log(err);
      });
  }

  connect(device) {
    console.log('connecting device');
    this.logger.log('connecting device');
    this.bluetooth.connect(device.address, this.bluetooth.uuid).then(
      (socketId) => {
        console.log('success!');
        this.logger.log('success!');

        this.bluetooth.connection.sendSocketId = socketId;

        console.log('sending data');
        this.logger.log('sending data');
        this.bluetooth.send({ message: 'Hello world' });

        // listen for our own return messages
        if (!this.bluetooth.connection.listenSocketId) {
          this.bluetooth.listenUsingRfcomm(this.bluetooth.uuid).then((socketId) => {
            this.bluetooth.connection.listenSocketId = socketId;

            console.log(this.bluetooth.connection);
            this.logger.log(JSON.stringify(this.bluetooth.connection));

            this.bluetooth.send({ type: 'reciprocalConnect', data: {
              uuid: this.bluetooth.uuid,
              address: this.bluetooth.info.address,
            }});
          },
          (err) => {
            console.log(err);
            this.logger.log('listenUsingRfcomm error: ' + JSON.stringify(err));
          });
        }
      },
      (err) => {
        console.log('fail...');
        console.log(err);
        this.logger.log('connect failure: ' + JSON.stringify(err));
      }
    );
  }

  close() {
    this.logger.log('closing modal connect');
    this.viewCtrl.dismiss();
  }

}
