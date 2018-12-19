import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';
import { LoggerProvider } from '../../providers/logger/logger';
// import { WebServer } from '@ionic-native/web-server';

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
    public logger: LoggerProvider,
//    public webServer: WebServer,
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

  viewLog() {
    const modal = this.modalCtrl.create('ModalLogPage');
    modal.present();
  }

  requestEnable() {
    this.bluetooth.requestEnable().catch((err) => {
      this.logger.log('error on requestEnable: ' + err.message);
      console.log(err);
    });
  }

  requestDiscoverable() {
    this.bluetooth.requestDiscoverable().catch((err) => {
      this.logger.log('error on requestDiscoverable: ' + err.message);
      console.log(err);
    });
    
    this.bluetooth.listenUsingRfcomm(this.bluetooth.uuid).then((socketId) => {
      this.logger.log('found listen socket id: ' + socketId);
      console.log('found socket id!');
      console.log(socketId);
      this.bluetooth.connection.listenSocketId = socketId;

      // this.bluetooth.send({ message: 'ok cool, both ways' })
      //   .catch(() => {
      //     console.log('not immediately connected 2-way');
      //   });
    },
    (err) => {
      console.log(err);
      this.logger.log('error on listenUsingRfcomm: ' + err.message);
    })
    .catch((err) => {
      console.log(err);
      this.logger.log('error on listenUsingRfcomm: ' + err.message);
    });
  }

  sendMessage() {
    this.bluetooth.send({ message: 'message sent!' }).catch((err) => {
      console.log(err);
      this.logger.log('error on send: ' + err.message);
    });
  }

  disconnect() {
    this.bluetooth.close();
  }

  startServer() {
    this.logger.log('starting server');
    const webserver = window['webserver'];

    webserver.onRequest(
      (request) => {
        this.logger.log('listened to a request');
        this.logger.log(request);
    
        webserver.sendResponse(
          request.requestId,
          {
            status: 200,
            body: '<html>Hello World</html>',
            headers: {
              'Content-Type': 'text/html'
            }
          }
        );
      }
    );

    const success = () => {
      this.logger.log('started!');
    };

    const error = (err) => {
      this.logger.log('failed to start server');
      this.logger.log(err);
    };

    const s = function() {
      console.log('started');
    };

    const e = function(er) {
      console.log('errored');
      console.log(er);
    };
    
    webserver.start(s, e, 8002);
  }

  stopServer() {
    const webserver = window['webserver'];

    const success = () => {
      this.logger.log('stopped!');
    }

    const error = (err) => {
      this.logger.log('failed to stop server');
      this.logger.log(err);
    }

    webserver.stop(success, error);
  }
}
