import express from 'express';
import { engine } from 'express-handlebars';
import routes from './routes/views.router.js';
import cartsRoutes from './routes/api/carts.routes.js';
import productsRoutes from './routes/api/product.routes.js';
import path from 'path';
import { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import usersRoutes from './routes/api/users.routes.js';

const PORT = 8080;

const app = express();

const httpServer = new HttpServer(app)

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'));


const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.engine('hbs', engine({
    extname: '.hbs' 
}))

const pathViews = path.resolve('src', 'views');
app.set('views', pathViews); 

app.set('view engine', 'hbs');


app.use('/', routes) 
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);
app.use('/api/users', usersRoutes )


httpServer.listen(PORT, err => {
    if (err) {
        console.log('no se pudo iniciar el servidor:', err)
        return
    }
    console.log(`scuchando en ${PORT}`);
});


const socketServer = new Server(httpServer);

const messages = [];

socketServer.on('connection', (socket) => {
    console.log("Cliente conectado"); 
    socket.emit('message', messages); 
    socket.on('message', (data) => { 
        messages.push(data);
        socketServer.emit('message', messages); 
    })
})