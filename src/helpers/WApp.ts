import puppeteer, { Browser, Page} from "puppeteer";
export enum STATUS_WAPP {
    DESCONECTADO = 0,
    OK = 1,
    NAO_CONECTADO = 2,
}

export default class WApp{
    private _page: Page;

    private readonly launchOptions : any = {
        headless: process.env.NODE_ENV === 'production',
        ignoreHTTPSErrors: true,
        args: ["--disable-web-security", "--no-sandbox"],
        executablePath: process.env.NODE_ENV === 'production' ? 'google-chrome-unstable' : null
    };

    public async open(){
        const browser  = await puppeteer.launch(this.launchOptions);
        const pages: Page[] = await browser.pages()
        this._page = pages[0];

        await this._page.goto('https://web.whatsapp.com', { waitUntil: 'networkidle0' });
    }

    public async getQRCodeBase64(): Promise<string>{
        await this._page.waitForSelector('[aria-label="Scan me!"]', {timeout: 60 * 1000});
        const base64 = await this._page.$eval('[aria-label="Scan me!"]', (img:HTMLCanvasElement)=> img.toDataURL());

        return new Promise(r=> r(base64));
    }

    public async sendMessageToTelNumber(msg="Mensagem envia pelo bot criado em node :)", tel="5562991985005"){
        await this._page.goto(`https://web.whatsapp.com/send?phone=${tel}`, { waitUntil: 'networkidle0' });

        const selectorTxtInputMessage = 'div.copyable-text.selectable-text[contenteditable="true"]';
        await this._page.waitForSelector(selectorTxtInputMessage, {timeout: 1000 * 60});
       
        await this._page.type(selectorTxtInputMessage, msg);
        await this._page.click(" #main .copyable-area button._3M-N-");
    }

    public async check(): Promise<STATUS_WAPP> {
        return new Promise(async resolve =>{
            if(!this._page){
                resolve(STATUS_WAPP.NAO_CONECTADO);
            }
            else {
                
                if((await this._page.$('[data-icon="alert-phone"]')) !== null){
                    resolve(STATUS_WAPP.DESCONECTADO)
                }
                else if((await this._page.$('[aria-label="Scan me!"]')) !== null){
                    resolve(STATUS_WAPP.NAO_CONECTADO)
                }
                else if((await this._page.$('#app div[role="button"]:nth-child(2)')) !== null){
                    const buttonTxt = await this._page.$eval('#app div[role="button"]:nth-child(2)', (div: HTMLDivElement)=>{
                        return div ? div.innerText : null;
                    })
                    if(buttonTxt.trim().toLowerCase() === 'Tentar novamente'.toLowerCase()){
                        resolve(STATUS_WAPP.DESCONECTADO)
                    }
                    else {
                        resolve(STATUS_WAPP.OK)
                    }
                }
                else {
                    resolve(STATUS_WAPP.OK)
                }
            }
        })
        
    }
}