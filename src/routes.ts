import { Router } from 'express'
import WAppController from './controllers/WAppController'

const routes = Router()

//routes.get('/users', UserController.index)
routes.get('/login', WAppController.loginWApp)
routes.post('/send', WAppController.sendMessage)

export default routes