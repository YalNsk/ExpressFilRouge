const authRouter = require('./auth-router');
const categoryRouter = require('./category-router');
const taskRouter = require('./task-router');
const userRouter = require('./user-router');
//Création du routeur "parent"
const router = require('express').Router();

//Paramétrer toutes les routes
//Nous indiquons qu'à l'arrivée sur le segment /category, nous devons charger le routeur enfant category-routeur
router.use('/category', categoryRouter);
//Tant qu'on n'a pas implémenté les fonctionnalités liées à notre route, on va renvoyer une erreur 501 : Not Implemented
//router.use('/task', (req, res) => res.sendStatus(501))
router.use('/task', taskRouter)
router.use('/user', userRouter)
router.use('/auth', authRouter)

//On export notre routeur parent
module.exports = router;