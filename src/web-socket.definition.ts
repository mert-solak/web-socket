import { Socket } from './web-socket';

export type ControlMethod = (event: Event) => void;
export type Protocols = string | string[];
export interface Options {
  reConnectTime: number;
}

export interface MessageEvent extends Event {
  data: any;
  lastEventId: string;
  origin: string;
  ports: ReadonlyArray<MessagePort>;
  source: MessageEventSource | null;
}
export interface CloseEvent extends Event {
  code: number;
  reason: string;
  wasClean: boolean;
}
export type ListenCallback = (data: any) => void;
export type Listen = (callback: ListenCallback) => Socket;
export type Connect = () => Socket;
