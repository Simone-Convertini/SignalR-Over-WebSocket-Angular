# [SignalR Angular Service:](./README.md)
If you need to use some services provided by old signalr hubs `Microsoft.AspNet.SignalR`, you have to install npm signalR-client and jquery as dependencies. But since I really despite the idea to install jquery in an Angular project, I decided to write this service.

## Example Component:
A test component is located in the example folder, providing a chat implementation using Angular instead of razor pages as shown in the [Microsoft Docs](https://learn.microsoft.com/en-us/aspnet/signalr/overview/older-versions/tutorial-getting-started-with-signalr-and-mvc-4).

## Service and Models:
The Service uses only WebSocket and JsRx to work. For each hub's function the service provide a Subject as an argument provider. Subscribe to that subject to bind your functions. Also the models of the WebSoket messages and responses are provided.

If you want to deepen the topic read this [article](https://www.derpturkey.com/signalr-is-an-abomination-how-to-connect-using-raw-websockets/).