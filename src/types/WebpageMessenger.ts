import { Nullable } from './Utils';

export type MessageData<T> = {
  messageId: string;
  event: keyof EventHandlers;
  payload: T;
  namespace: 'complexity';
};

export type SendMessageOptions<K extends keyof EventHandlers> = {
  event: K;
  timeout?: number;
  payload?: EventPayloads[K];
};

export type ResponseData<T> = {
  event: 'response';
  payload: T;
  messageId: string;
  namespace: 'complexity';
};

export type ResponseOptions<T> = Omit<ResponseData<T>, 'event' | 'namespace'>;

export type EventPayloads = {
  [K in keyof EventHandlers]: Parameters<EventHandlers[K]>[0] extends undefined
    ? void
    : Parameters<EventHandlers[K]>[0];
};

export type SendMessage = <K extends keyof EventHandlers>(
  options: SendMessageOptions<K>
) => Promise<ReturnType<EventHandlers[K]>>;

export type MessageListener = <K extends keyof EventHandlers>(
  eventName: K,
  callback: (
    messageData: MessageData<EventPayloads[K]>
  ) => Promise<ReturnType<EventHandlers[K]>>
) => void;

export type WebSocketEventData = {
  event: 'send' | 'open' | 'message' | 'close';
  payload: any;
};

export type LongPollingEventData = {
  event: 'request' | 'response';
  payload: any;
};

export type AddInterceptorMatchCondition<T, K> = (
  messageData: MessageData<T>
) => {
  match: boolean;
  args?: K[];
};

export type AddInterceptorParams<K extends keyof EventHandlers, T, J> = {
  matchCondition: AddInterceptorMatchCondition<T, J>;
  callback: (
    messageData: MessageData<T>,
    args: J[]
  ) => Promise<ReturnType<EventHandlers[K]>>;
  stopCondition: (messageData: T) => boolean;
};

export type Interceptor<
  K extends keyof EventHandlers,
  T,
  J,
> = AddInterceptorParams<K, T, J> & {
  identifier: string;
};

export interface EventHandlers {
  log(data: string): string;
  sendWebsocketMessage(data: string): void;
  webSocketEvent(data: WebSocketEventData): WebSocketEventData['payload'];
  longPollingEvent(data: LongPollingEventData): LongPollingEventData['payload'];
  websocketCaptured(): void;
  getActiveWebSocketType(): Nullable<'WebSocket' | 'Long-polling'>;
  registerWebSocketMessageListener({}): () => void;
  routeToPage(data: string): void;
}

const interceptorParamsExample = {};