import {EventEmitter} from 'events';

class Socket {
  constructor(socket = new WebSocket(), emitter = new EventEmitter()) {
    this.socket = socket;
    this.emitter = emitter;
    socket.onmessage = this.message.bind(this);
    socket.onopen = this.open.bind(this);
    socket.onclose = this.close.bind(this);
  }

  on(name, fn) {
    this.emitter.on(name, fn);
  }

  off(name, fn) {
    this.emitter.removeListener(name, fn);
  }

  emit(name, data) {
    const message = JSON.stringify({name, data});
    this.socket.send(message);
  }

  message(e) {
    try {
      const message = JSON.parse(e.data);
      this.emitter.emit(message.name, message.data);
    }
    catch (err) {
      this.emitter.emit('error', err);
    }
  }

  open() {
    this.emitter.emit('connect');
  }

  close() {
    this.emitter.emit('disconnect');
  }
}

export default Socket;