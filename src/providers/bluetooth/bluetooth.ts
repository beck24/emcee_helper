import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import str2ab from 'string-to-arraybuffer';
import ab2str from 'arraybuffer-to-string';
import { LoggerProvider } from '../../providers/logger/logger';

@Injectable()
export class BluetoothProvider {

  public uuid: string = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
  public devices: any = [];
  public info: any = {
    name: '',
    address: '',
    discovering: false,
    discoverable: false,
    enabled: false,
  };

  public connection: any = {
    listenSocketId: null,
    sendSocketId: null,
  };

  constructor(
    public platform: Platform,
    public logger: LoggerProvider,
  ) {
    this.logger.log('Constructing BT');

    if (!this.canUse()) {
      this.logger.log('Device not supported');
      return;
    }

    this.addListener('onDeviceAdded', (device) => {
      this.updateDeviceName(device);
    });

    this.addListener('onAdapterStateChange', (adapterInfo) => {
      this.onStateChange(adapterInfo);
    });

    this.addListener('onAccept', (acceptInfo) => {
      console.log('received onAccept');
      console.log(acceptInfo);
      this.logger.log('received onAccept: ' + JSON.stringify(acceptInfo));
      this.onAccept(acceptInfo);
    });

    this.addListener('onReceive', (receiveInfo) => {
      this.logger.log('received communication: ' + JSON.stringify(receiveInfo));
      console.log('received communication');
      console.log(receiveInfo);
      alert(JSON.stringify(this.bufferToJson(receiveInfo.data)));
      this.onReceive(receiveInfo);
    });

    this.addListener('onReceiveError', (errorInfo) => {
      this.onReceiveError(errorInfo);
    });

    this.getAdapterInfo().then(
      (adapterInfo) => {
        this.onStateChange(adapterInfo);
      },
      (error) => {
        console.log(error);
        this.logger.log('adapter info error: ' + JSON.stringify(error));
      }
    );
  }

  canUse() {
    const result = this.platform.is('android') && this.platform.is('cordova');

    if (!result) {
      console.log('This device cannot use bluetooth');
      this.logger.log('This device cannot use bluetooth');
    }

    return result;
  }

  isConnected() {
    return this.connection.sendSocketId !== null;
  }

  addListener(event, listener) {
    if (!this.canUse()) {
      return;
    }

    switch (event) {
      case 'onAdapterStateChange':
        window['networking'].bluetooth.onAdapterStateChanged.addListener(listener);
      break;
      case 'onDeviceAdded':
        window['networking'].bluetooth.onDeviceAdded.addListener(listener);
      break;
      case 'onReceive':
        window['networking'].bluetooth.onReceive.addListener(listener);
      break;
      case 'onReceiveError':
        window['networking'].bluetooth.onReceiveError.addListener(listener);
      break;
      case 'onAccept':
        window['networking'].bluetooth.onAccept.addListener(listener);
      break;
    }
  }

  removeListener(event, listener) {
    if (!this.canUse()) {
      return;
    }

    switch (event) {
      case 'onAdapterStateChange':
        window['networking'].bluetooth.onAdapterStateChanged.removeListener(listener);
      break;
      case 'onDeviceAdded':
        window['networking'].bluetooth.onDeviceAdded.removeListener(listener);
      break;
      case 'onReceive':
        window['networking'].bluetooth.onReceive.removeListener(listener);
      break;
      case 'onReceiveError':
        window['networking'].bluetooth.onReceiveError.removeListener(listener);
      break;
      case 'onAccept':
        window['networking'].bluetooth.onAccept.removeListener(listener);
      break;
    }
  }

  hasListener(event, listener) {
    if (!this.canUse()) {
      return false;
    }

    switch (event) {
      case 'onAdapterStateChange':
        return window['networking'].bluetooth.onAdapterStateChanged.hasListener(listener);

      case 'onDeviceAdded':
        return window['networking'].bluetooth.onDeviceAdded.hasListener(listener);

      case 'onReceive':
        return window['networking'].bluetooth.onReceive.hasListener(listener);

      case 'onReceiveError':
        return window['networking'].bluetooth.onReceiveError.hasListener(listener);

      case 'onAccept':
        return window['networking'].bluetooth.onAccept.hasListener(listener);
    }
  }

  hasListeners(event) {
    if (!this.canUse()) {
      return false;
    }

    switch (event) {
      case 'onAdapterStateChange':
        return window['networking'].bluetooth.onAdapterStateChanged.hasListeners();

      case 'onDeviceAdded':
        return window['networking'].bluetooth.onDeviceAdded.hasListeners();

      case 'onReceive':
        return window['networking'].bluetooth.onReceive.hasListeners();

      case 'onReceiveError':
        return window['networking'].bluetooth.onReceiveError.hasListeners();

      case 'onAccept':
        return window['networking'].bluetooth.onAccept.hasListeners();
    }
  }

  getAdapterInfo() {
    if (!this.canUse()) {
      return Promise.resolve({
        address: 'Invalid Device',
        name: 'Device',
        enabled: false,
        discovering: false,
        discoverable: false,
      });
    }

    return new Promise((resolve, reject) => {
      window['networking'].bluetooth.getAdapterState(function (adapterInfo) {
        // The adapterInfo object has the following properties:
        // address: String --> The address of the adapter, in the format 'XX:XX:XX:XX:XX:XX'.
        // name: String --> The human-readable name of the adapter.
        // enabled: Boolean --> Indicates whether or not the adapter is enabled.
        // discovering: Boolean --> Indicates whether or not the adapter is currently discovering.
        // discoverable: Boolean --> Indicates whether or not the adapter is currently discoverable.
        resolve(adapterInfo);
      }, function (errorMessage) {
        this.logger.log('error on getAdapterState: ' + JSON.stringify(errorMessage));
        reject(errorMessage);
      });
    });
  }

  requestEnable() {
    if (!this.canUse()) {
      return Promise.reject(false);
    }

    return new Promise((resolve, reject) => {
      window['networking'].bluetooth.requestEnable(() => {
        // The adapter is now enabled
        resolve(true);
      },
      () => {
        // The user has cancelled the operation
        reject(false);
      });
    });
  }

  enable() {
    if (!this.canUse()) {
      return Promise.reject(false);
    }

    return new Promise((resolve, reject) => {
      window['networking'].bluetooth.enable(() => {
        // The adapter is now enabled
        resolve(true);
      },
      () => {
        // The user has cancelled the operation
        reject(false);
      });
    });
  }

  getDevices() {
    if (!this.canUse()) {
      return Promise.resolve([]);
    }

    return new Promise((resolve, reject) => {
      window['networking'].bluetooth.getDevices((devices) => {
        resolve(devices);
      },
      (err) => {
        reject(err);
      });
    });
  }

  startDiscovery() {
    if (!this.canUse()) {
      return Promise.reject('Invalid Device Type');
    }

    return new Promise((resolve, reject) => {
      window['networking'].bluetooth.startDiscovery(() => {
        // Stop discovery after 30 seconds.
        setTimeout(() => {
            window['networking'].bluetooth.stopDiscovery();
            resolve();
        }, 30000);
      },
      (err) => {
        reject(err);
      });
    });
  }

  requestDiscoverable() {
    if (!this.canUse()) {
      return Promise.reject('Invalid Device Type');
    }

    return new Promise((resolve, reject) => {
      window['networking'].bluetooth.requestDiscoverable(() => {
        resolve();
      },
      () => {
        reject();
      });
    });
  }

  listenUsingRfcomm(uuid) {
    if (!this.canUse()) {
      return Promise.reject('Invalid Device Type');
    }

    return new Promise((resolve, reject) => {
      window['networking'].bluetooth.listenUsingRfcomm(uuid, (serverSocketId) => {
        // Keep a handle to the serverSocketId so that you can later accept connections (onAccept) from this socket.
        resolve(serverSocketId);
      },
      (err) => {
        reject(err);
      });
    });
  }

  connect(address, uuid) {
    if (this.canUse()) {
      return Promise.reject('Invalid Device Type');
    }

    return new Promise((resolve, reject) => {
      window['networking'].bluetooth.connect(address, uuid, (socketId) => {
        // Profile implementation here.
        resolve(socketId);
      },
      (err) => {
        this.logger.log('Connection failed: ' + JSON.stringify(err));
        console.log('Connection failed: ' + err);
        reject(err);
      });
    });
  }

  send(data) {
    if (!this.isConnected() || !this.canUse()) {
      return Promise.reject('not connected');
    }

    return new Promise((resolve, reject) => {
      const arrayBuffer = this.jsonToBuffer(data);

      window['networking'].bluetooth.send(this.connection.sendSocketId, arrayBuffer, (bytes_sent) => {
        resolve(bytes_sent);
      },
      (err) => {
        this.logger.log('send failed: ' + JSON.stringify(err));
        console.log('Send failed: ' + err);
        reject(err);
      });
    });
  }

  close() {
    if (!this.canUse()) {
      return;
    }

    if (this.connection.listenSocketId) {
      window['networking'].bluetooth.close(this.connection.listenSocketId);
    }

    if (this.connection.sendSocketId) {
      window['networking'].bluetooth.close(this.connection.sendSocketId);
    }
    
    this.connection.listenSocketId = null;
    this.connection.sendSocketId = null;
  }

  updateDeviceName(device) {
    if (!this.canUse()) {
      return;
    }

    let key = false;
    this.devices.forEach((d, index) => {
      if (d.address === device.address) {
        key = index;
      }
    });

    if (key !== false) {
      this.devices[key] = device;
    }
    else {
      this.devices.push(device);
    }
  }

  onStateChange(adapterInfo) {
    if (!this.canUse()) {
      return;
    }

    let keys = Object.keys(adapterInfo);

    keys.forEach((key) => {
      this.info[key] = adapterInfo[key];
    });
  }

  onAccept(acceptInfo) {
    if (!this.canUse()) {
      return;
    }

    console.log('acceptInfo');
    console.log(acceptInfo);
    this.logger.log('acceptInfo: ' + JSON.stringify(acceptInfo));

    if (acceptInfo.socketId !== this.connection.listenSocketId) {
      return;
    }

    this.connection.sendSocketId = acceptInfo.clientSocketId;

    console.log('not sure what to do here');
    this.logger.log('accepted... not sure what to do here');
  }

  onReceive(receiveInfo) {
    if (this.canUse()) {
      return;
    }

    if (receiveInfo.socketId !== this.connection.listenSocketId) {
      return;
    }

    const data = this.bufferToJson(receiveInfo.data);
    console.log(data);
    this.logger.log('onreceive data: ' + JSON.stringify(data));

    if (data.hasOwnProperty('message')) {
      alert('received message: ' + data.message);
    }

    // somehow dispatch on type property
    if (data.hasOwnProperty('type')) {
      switch (data.type) {
        case 'reciprocalConnect':
          this.connect(data.address, data.uuid).then((socketId) => {
            this.connection.sendSocketId = socketId;
          }).catch((err) => {
            this.logger.log('recprocalconnect error: ' + JSON.stringify(err));
            console.log('reciprocalConnect error');
            console.log(err);
          })
        break;
      }
    }
  }

  onReceiveError(errorInfo) {
    if (!this.canUse()) {
      return;
    }

    this.logger.log('onReceiveError: ' + JSON.stringify(errorInfo));
    console.log('error', errorInfo);
    if (errorInfo.socketId !== this.connection.sendSocketId) {
      return;
    }

    console.log(errorInfo.errorMessage);
    alert('onReceiveError');
    alert(errorInfo.errorMessage);
    if (errorInfo.errorMessage.startsWith('bt socket closed')) {
      this.close();
    }
  }

  jsonToBuffer(json) {
    return str2ab(JSON.stringify(json));
  }

  bufferToJson(buffer) {
    return JSON.parse(ab2str(buffer));
  }
}
