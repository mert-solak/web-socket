import { isDefined } from './web-socket.helper';

import {
  Options,
  ControlMethod,
  Protocols,
  Connect,
  Listen,
  ListenCallback,
  MessageEvent,
  CloseEvent,
} from './web-socket.definition';

export class Socket {
  private socket: WebSocket;

  private url: string;
  private protocols: Protocols;

  private options: Options = { reConnectTime: 3000 };

  onError: ControlMethod;
  onOpen: ControlMethod;
  onClose: ControlMethod;
  onMessage: ControlMethod;

  private listenCallback: ListenCallback;

  constructor(url: string, protocols?: Protocols, options?: Options) {
    this.url = url;

    if (isDefined(protocols)) {
      this.protocols = protocols;
    }

    if (isDefined(options)) {
      this.options = options;
    }
  }

  private readonly onCloseHandler = (event: CloseEvent) => {
    if (isDefined(this.onClose)) {
      this.onClose(event);
    }

    setTimeout(() => {
      this.socket = new WebSocket(this.url, this.protocols);
    }, this.options.reConnectTime);
  };

  private readonly onOpenHandler = (event: Event) => {
    if (isDefined(this.onClose)) {
      this.onOpen(event);
    }
  };

  private readonly onMessageHandler = (event: MessageEvent) => {
    if (isDefined(this.onClose)) {
      this.onMessage(event);
    }

    if (isDefined(this.listenCallback)) {
      const data = event.data;

      try {
        const parsedData = JSON.parse(data);

        if (isDefined(parsedData)) {
          this.listenCallback(parsedData);
        }
      } catch (error: any) {
        this.listenCallback(data);
      }
    }
  };

  private readonly onErrorHandler = (event: Event) => {
    if (isDefined(this.onClose)) {
      this.onError(event);
    }
  };

  readonly connect: Connect = () => {
    this.socket = new WebSocket(this.url, this.protocols);

    this.socket.addEventListener('close', this.onCloseHandler);
    this.socket.addEventListener('open', this.onOpenHandler);
    this.socket.addEventListener('error', this.onErrorHandler);
    this.socket.addEventListener('message', this.onMessageHandler);

    return this;
  };

  readonly listen: Listen = (callback) => {
    this.listenCallback = callback;

    return this;
  };
}
