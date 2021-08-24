import express from 'express';
import footballTeam from '../modules/add.js';
import authMiddleware from '../middleware/auth.js';
import {listValidator} from '../utils/validates.js';
import validator from 'express-validator';

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
   res.render('addTeam', {
       title: "Add your team",
       isActive1: true
   });
});

router.post('/', authMiddleware, listValidator, async (req, res) => {
    const body = req.body;

    try{
        const errors = validator.validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).render('addTeam', {
                title: "Add your team",
                isActive1: true,
                error: errors.array()[0].msg,
                data: {
                    team: body.team,
                    estDate: body.estDate,
                    img: body.img,
                }
            })
        }
        const team = new footballTeam({
            team: body.team,
             estDate: body.estDate,
             img: body.img,
             userId: req.user
         });
         
         await team.save();
         
         res.redirect('/list');
    }catch(e){
        console.log(e);
    }
    
});

export default router;