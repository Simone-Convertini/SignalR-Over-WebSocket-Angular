import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom, Subject } from "rxjs";
import { ConnectionData, Message, MObject, NegotiationResponse, URL_HTTP, URL_WS } from "./models.interface";

@Injectable({ providedIn: "root" })
export class SignalrService {
    private ws: WebSocket;
    private messageId = 0;
    private subjMap: {[name: string] : Subject<any[]>} = {  }

    constructor(private http: HttpClient) {  }

    // Return the negotiation response as NegotiationResponse
    private async startNegotiation(connectionData: ConnectionData[], protocolNumber: number) {
        let negRes = await lastValueFrom(
            this.http.get(
                URL_HTTP + `/negotiate?connectionData=${JSON.stringify(connectionData)}&clientProtocol=${protocolNumber}`
            )
        );
        return (negRes as NegotiationResponse);
    }
    // Construct the ws path from the negotiation response and return the ws client
    private getWsClient(connectionData: ConnectionData[], protocolNumber: number, negRes: NegotiationResponse) {
        let token = encodeURIComponent(negRes.ConnectionToken);
        let wsPath = URL_WS + `/connect?transport=webSockets&clientProtocol=${protocolNumber}&connectionToken=${token}&connectionData=${JSON.stringify(connectionData)}tid=10`;

        return new WebSocket(wsPath);
    }
    // Return the WebSoket Client
    async serveWs(connectionData: ConnectionData[], protocolNumber: number) {
        if(this.ws){
            return this.ws;
        } else {
            let negRes = await this.startNegotiation(connectionData, protocolNumber);
            this.ws = this.getWsClient(connectionData, protocolNumber, negRes);
            return this.ws;
        }
    }

    // FUNCTIONS TO CALL AFTER serveWs

    // Add listner to emit function's event
    private addSignalrListner(funcHubName: string){
        this.ws.addEventListener("message", (ev)=>{
            let msg: Message = JSON.parse(ev.data);
            try {
                let mObj: MObject = msg.M[0];
                if(mObj.M == funcHubName) {
                    this.subjMap[funcHubName].next(mObj.A);
                }
            } catch(err) {
                //console.log("Empty Message");
            }
        });
    }
    // Get subject coupled to the function's name
    getSubject(funcHubName: string) : Subject<any[]> {
        if(this.subjMap[funcHubName]){
            return this.subjMap[funcHubName];
        }
        this.subjMap[funcHubName] = new Subject<any[]>();
        this.addSignalrListner(funcHubName);
        return this.subjMap[funcHubName];
    }
    // Sent a message to invoke hub method
    invoke(hubName:string, method: string, args: any[]) {
        let mObject: MObject = {
            H: hubName,
            M: method,
            A: args,
            I: ++this.messageId
        } 

        this.ws.send(
            JSON.stringify(mObject)
        );
    }

}