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

  /**
   * it sets url, protocols and options initally
   * @param url @type string
   * @param protocols @type Protocols
   * @param options @type Options
   */
  constructor(url: string, protocols?: Protocols, options?: Options) {
    this.url = url;

    if (isDefined(protocols)) {
      this.protocols = protocols;
    }

    if (isDefined(options)) {
      this.options = options;
    }
  }

  /**
   *  it tries to reconnect and pass event to onClose
   * @param event @type CloseEvent
   */
  private readonly onCloseHandler = (event: CloseEvent) => {
    if (isDefined(this.onClose)) {
      this.onClose(event);
    }

    setTimeout(() => {
      this.connect();
    }, this.options.reConnectTime);
  };

  /**
   * it passes event to onOpen
   * @param event @type Event
   */
  private readonly onOpenHandler = (event: Event) => {
    if (isDefined(this.onOpen)) {
      this.onOpen(event);
    }
  };

  /**
   * it passes event to onOpen, then pass the parsed data
   * to listenCallback if parsable
   * @param event @type MessageEvent
   */
  private readonly onMessageHandler = (event: MessageEvent) => {
    if (isDefined(this.onMessage)) {
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

  /**
   * it passes event to onError
   * @param event @type Event
   */
  private readonly onErrorHandler = (event: Event) => {
    if (isDefined(this.onError)) {
      this.onError(event);
    }
  };

  /**
   * creates connection and add event listeners
   * @returns Socket
   */
  readonly connect: Connect = () => {
    this.socket = new WebSocket(this.url, this.protocols);

    this.socket.removeEventListener('close', this.onCloseHandler);
    this.socket.removeEventListener('open', this.onOpenHandler);
    this.socket.removeEventListener('error', this.onErrorHandler);
    this.socket.removeEventListener('message', this.onMessageHandler);

    this.socket.addEventListener('close', this.onCloseHandler);
    this.socket.addEventListener('open', this.onOpenHandler);
    this.socket.addEventListener('error', this.onErrorHandler);
    this.socket.addEventListener('message', this.onMessageHandler);

    return this;
  };

  /**
   * it sets listenCallback for the future incomming messages
   * @returns Socket
   */
  readonly listen: Listen = (callback) => {
    this.listenCallback = callback;

    return this;
  };
}
