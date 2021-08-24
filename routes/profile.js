import express from 'express';
import auth from '../middleware/auth.js';
import User from '../modules/user.js';

const router = express.Router();

router.get('/', auth, (req, res) => {
    res.render('profile', {
        title: "profile",
        isProfile: true,
        user: req.user.toObject()
    })
});

router.post('/', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user._id);

        user.name = req.body.name;

        if(req.file){
            user.avatar = req.file.path;
        }
        
        await user.save();

        res.redirect('/profile');
    }catch(e){
        console.log(e);
    }
});

export default router;