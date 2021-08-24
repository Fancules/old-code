import express from 'express';
import User from '../modules/user.js';

const router = express.Router();

router.get('/', async (req, res) => {
   res.render('index', {
       title: "Main page",
       isActive: true,
       error: req.flash('error'),
       user: req.session.isAuthenticated ? req.user.name : 'guest',
   });
});

export default router;