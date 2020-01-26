import app from './app'
import chalk from 'chalk';
import * as WebSocket from 'ws';
import SocketApp from './socket';
require('dotenv').config({path: '.env'})
console.info('----------------------------------------------------');
console.info(chalk.blue( 'WAPP'));
console.info(chalk.green(`Environment:      ${process.env.NODE_ENV}`));
console.info(chalk.green(`Port:             ${process.env.SERVER_PORT}`));
console.info('----------------------------------------------------');
console.info(`Waiting for connections on port ${process.env.SERVER_PORT}...`);



const server = app.listen(process.env.SERVER_PORT)

new SocketApp(server);              