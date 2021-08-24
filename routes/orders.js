import express from 'express';
import Order from '../modules/order.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    const orders = await Order.find({
        "user.userId" : req.user
    }).populate("user.userId");
    
    res.render('orders', {
        isOrder: true,
        title: "Orders",
        orders
    });
});

router.post('/remove', authMiddleware, async (req, res) => {
    await Order.deleteOne({_id : req.body.id});
    res.redirect('/orders');
});

router.post('/', authMiddleware, async (req, res) => {
    try{
        const user = await req.user.populate("cart.items.teamId").execPopulate();
        const teams = user.cart.items.map(t => ({
            count: t.count,
            team: {...t.teamId._doc}
        }));
    
        await new Order({
            teams,
            user: {
                name: req.user.name,
                userId: req.user
            }
        }).save();
    
        req.user.clearCart();
    
        res.redirect('/orders');
    }catch(e) {
        console.log(e);
    }
});

export default router;