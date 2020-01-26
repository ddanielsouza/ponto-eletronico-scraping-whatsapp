import express from 'express'
import cors from 'cors'
import routes from './routes'
import axios from 'axios';
class App {
    public express: express.Application

    public constructor() {
        this.express = express()

        this.middlewares()
        //this.database()
        this.routes()
    }

    private middlewares(): void {
        this.express.use(express.json())
        this.express.use(cors())

        this.express.use('/wapp', async function (req, res, next) {
            try{
                const {data} = await axios.get(`${process.env.PONTO_BASE_URL}/check-token`, {headers: { 
                    'Authorization': req.headers['authorization']
                }})
                if(!data.success){
                    res.send(401).json({success: false})
                }
                else{
                    next();
                }
                
            }catch(e){
                console.log(e);
                res.send(401).json({success: false})
            }
        });
    }

    /*private database(): void {
        mongoose.connect(`mongodb://${process.env.DB_HOST}:27017/tsexample`, { useNewUrlParser: true })
    }*/

    private routes(): void {
        this.express.use('/wapp', routes)
    }
}

export default new App().express