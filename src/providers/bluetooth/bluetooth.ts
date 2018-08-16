import { Injectable } from '@angular/core';

@Injectable()
export class BluetoothProvider {
  public devices: any = {};

  constructor() {
    this.addListener('onDeviceAdded', (device) => {
      console.log('found device', device);
      this.updateDeviceName(device);
    });
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

  send(socketId, arrayBuffer) {
    return new Promise((resolve, reject) => {
      window['networking'].bluetooth.send(socketId, arrayBuffer, (bytes_sent) => {
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
  }

  updateDeviceName(device) {
    this.devices[device.address] = device.name;
  }
}
