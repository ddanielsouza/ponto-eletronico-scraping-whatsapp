
import * as WebSocket from 'ws';
export const users: WebSocket[] = [];
import WAppServices from './services/WAppServices';

export interface ReqWS{
    method:string,
    data: any,
}

export default class SocketApp{
    private _server;
    private _wss;
    constructor(server){
        this._server = server;
        this.start();
    }

    private start(){
        this._wss = new WebSocket.Server({ server: this._server });
        this._wss.on('connection', async (ws: WebSocket) => {
            users.push(ws);
            ws.send(JSON.stringify({
                'method': 'status-wapp',
                'data': await WAppServices.check()
            }));
            ws.on('message', async (message: string) => {
                const reqWS:ReqWS = JSON.parse(message);
                console.log(reqWS);
            });
        })
    }
}