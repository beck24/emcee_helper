import { Injectable } from '@angular/core';
import str2ab from 'string-to-arraybuffer';
import ab2str from 'arraybuffer-to-string';

@Injectable()
export class BluetoothProvider {

  public uuid: string = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
  public socketId: any;
  public devices: any = [];
  public info: any = {
    name: '',
    address: '',
    discovering: false,
    discoverable: false,
    enabled: false,
  };

  public connection: any = {
    device: {},
    socketId: 0,
  };

  constructor() {
    this.addListener('onDeviceAdded', (device) => {
      console.log('found device', device);
      this.updateDeviceName(device);
    });

    this.addListener('onAdapterStateChange', (adapterInfo) => {
      this.onStateChange(adapterInfo);
    });

    this.addListener('onAccept', (acceptInfo) => {
      this.onAccept(acceptInfo);
    });

    this.addListener('onReceive', (receiveInfo) => {
      this.onReceive(receiveInfo);
    });

    this.getAdapterInfo().then(
      (adapterInfo) => {
        this.onStateChange(adapterInfo);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addListener(event, listener) {
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
        reject(errorMessage);
      });
    });
  }

  requestEnable() {
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
    return new Promise((resolve, reject) => {
      window['networking'].bluetooth.connect(address, uuid, (socketId) => {
        // Profile implementation here.
        resolve(socketId);
      },
      (err) => {
        console.log('Connection failed: ' + err);
        reject(err);
      });
    });
  }

  send(data) {
    return new Promise((resolve, reject) => {
      const arrayBuffer = this.jsonToBuffer(data);

      window['networking'].bluetooth.send(this.connection.socketId, arrayBuffer, (bytes_sent) => {
        console.log('Sent ' + bytes_sent + ' bytes');
        resolve(bytes_sent);
      },
      (err) => {
        console.log('Send failed: ' + err);
        reject(err);
      });
    });
  }

  close(socketId) {
    window['networking'].bluetooth.close(socketId);
    this.connection.device = {};
    this.connection.socketId = 0;
  }

  updateDeviceName(device) {
    this.devices[device.address] = device.name;

    let key = false;
    this.devices.forEach((d, index) => {
      if (d.address === device.address) {
        key = index;
      }
    });

    if (key) {
      this.devices[key] = device;
    }
    else {
      this.devices.push(device);
    }
  }

  onStateChange(adapterInfo) {
    let keys = Object.keys(adapterInfo);

    keys.forEach((key) => {
      this.info[key] = adapterInfo[key];
    });
  }

  onAccept(acceptInfo) {
    console.log('acceptInfo');
    console.log(acceptInfo);

    if (acceptInfo.socketId !== this.connection.socketId) {
      return;
    }

    console.log('not sure what to do here');
  }

  onReceive(receiveInfo) {
    if (receiveInfo.socketId !== this.connection.socketId) {
      return;
    }

    const data = this.bufferToJson(receiveInfo.data);

    console.log('got data!');
    alert('received message: ' + data.message);
  }

  jsonToBuffer(json) {
    return str2ab(JSON.stringify(json));
  }

  bufferToJson(buffer) {
    return JSON.parse(ab2str(buffer));
  }
}
