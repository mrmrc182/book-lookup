const router = require('express').Router();
const userRoutes = require('./user-routes');

router.get('/users', userRoutes);

module.exports = router;
