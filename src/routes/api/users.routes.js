import { Router } from "express"

const usersRoutes = Router()

const users = [
    {name: 'Fernando', lastName: 'Giraudo', age: 33, email: 'ferg@gmail.com', phone: 1234, role: 'admin'},
    {name: 'Nico', lastName: 'Astorga', age: 35, email: 'nico@gmail.com', phone: 2334, role: 'user'},
    {name: 'Cata', lastName: 'Gonzalez', age: 26, email: 'cata@gmail.com', phone: 3445, role: 'admin'},
    {name: 'Carmen', lastName: 'Miranda', age: 55, email: 'carm@gmail.com', phone: 5432, role: 'user'},
    {name: 'Ingrid', lastName: 'Arevalo', age: 53, email: 'ingridrg@gmail.com', phone: 4321, role: 'admin'},
]

usersRoutes.post('/', (req, res) => {
    const user = req.body;
    user.role= 'user';
    users.push(user); 
    res.send({status: 'Ok', message: 'User add'}); 
});

usersRoutes.get('/', (req, res) => {
    res.send({users});
})

export default usersRoutes;
export {
    users
} 