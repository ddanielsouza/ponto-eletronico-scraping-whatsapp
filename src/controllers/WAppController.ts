import { Request, Response } from "express";
import WAppServices from '../services/WAppServices';


class WAppController{
    async loginWApp(req: Request, res: Response){
        try{
            const img = await WAppServices.loginWApp();
            
            res.json({
                success: true,
                data: img,
            });
        }catch(e){
            console.log(e);
            return res.status(500).json({
                success: false,
                message: 'Erro Interno!',
                erros: [e.message] 
            });
        }
    }

    async sendMessage(req: Request, res: Response){
        try{
            await WAppServices.sendMessage(req.body.msg, req.body.tel);
            return res.json({
                success: true,
                message: 'OK',
            });
        }catch(e){
            console.log(e);
            return res.status(500).json({
                success: false,
                message: 'Erro Interno!',
                erros: [e.message] 
            });
        }
    }
}

export default new WAppController();