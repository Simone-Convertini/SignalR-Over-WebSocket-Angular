// Needed to construct the url
export interface ConnectionData {
    name: string // Hub name 
};
export interface NegotiationResponse {
    ConnectionId: string,
    ConnectionTimeout: number,
    ConnectionToken: string, // Token required for the connection
    DisconnectTimeout: number,
    KeepAliveTimeout: number,
    LongPollDelay: number,
    ProtocolVersion: string,
    TransportConnectTimeout: number,
    TryWebSockets: boolean,
    Url: string
};
// MessageEvent.data
export interface Message {
    C?: string,
    M?: MObject[],
    I?: string
};
export interface MObject {
    H: string, // Hub name
    M: string, // Method name
    A: any[], // Arguments of the method
    I?: number // Sent message's index
};
export const URL_HTTP = "http://localhost:54660/signalr";
export const URL_WS = "ws://localhost:54660/signalr";