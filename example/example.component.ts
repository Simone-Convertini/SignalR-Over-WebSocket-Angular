import { Component, OnInit } from '@angular/core';
import { ConnectionData } from '../signalr/models.interface';
import { SignalrService } from '../signalr/signalr.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {
  connectionData: ConnectionData = { name: "myhub" }
  messages: string[] = [];

  constructor(private signalr: SignalrService) {  }
  ngOnInit(): void {
    //Get ws client
    this.signalr.serveWs([this.connectionData], 2.1).then((ws)=>{
      // Subscribe to addNewMessageToPage
      this.signalr.getSubject("addNewMessageToPage").subscribe(
        (args)=>{this.addMessage(args)}
      );
    });
  }

  addMessage(args: any[]){
    this.messages.push(`From ${args[0]}: ${args[1]}`);
  }

  send(from: string, message: string) {
    this.signalr.invoke(
      "Myhub",
      "Send",
      [from, message]
    )
  }
}
