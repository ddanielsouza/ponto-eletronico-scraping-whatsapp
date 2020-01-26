import WApp, { STATUS_WAPP } from "../helpers/WApp";
import fs from 'fs';
import stream from 'stream';
import { users } from "../socket";

export class WAppServices{
    private static _wappHelper: WApp;



    public async loginWApp(): Promise<String>{
        if( !WAppServices._wappHelper){
            WAppServices._wappHelper = new WApp();
            let status = STATUS_WAPP.DESCONECTADO; 
            setInterval(async ()=>{
                try{
                    const resp = await WAppServices._wappHelper.check();
                    if(status != resp){
                        status = resp;
                        users.forEach(ws =>{
                            ws.send(JSON.stringify({
                                'method': 'status-wapp',
                                'data': status
                            }));
                        })
                    }
                }catch(e){}
            }, 5000)
        }
        const wappHelper = WAppServices._wappHelper;

        await wappHelper.open();
        const qrCodeBase64 = await wappHelper.getQRCodeBase64();

        return new Promise(r=>r(qrCodeBase64))
    }

    public check(){
        return WAppServices._wappHelper ? WAppServices._wappHelper.check() : 2;
    }

    public async sendMessage(msg, tel){
        const wappHelper: WApp = WAppServices._wappHelper;
        await wappHelper.sendMessageToTelNumber(msg, tel);
    }
}


export default new WAppServices();