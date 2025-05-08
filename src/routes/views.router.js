 import { Router } from 'express';
import { users } from './api/users.routes.js';

const router = Router()

router.get('/', async (req, res) => {

    const user = users [Math.floor(Math.random() * users.length)];
    const isAdmin = user.role === 'admin';
    res.render('home', {user, title: 'bienvenida', isAdmin, style: 'index.css'})
})


router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts')
})

export default router 
