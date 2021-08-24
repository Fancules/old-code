import express from 'express';
//const Handlebars = require ('handlebars');
//const {allowInsecurePrototypeAccess} = require ('@handlebars/allow-prototype-access');
import exphbs from 'express-handlebars';
import mongoose from 'mongoose';
import session from 'express-session';
import csrf from 'csurf';
import flash from 'connect-flash';
import connectMongoDB from 'connect-mongodb-session';
import helmet from "helmet";
import compression from 'compression';
import addTeamPage from './routes/addTeam.js';
import homePage from './routes/home.js';
import listPage from './routes/list.js';
import cartPage from './routes/cart.js';
import ordersPage from './routes/orders.js';
import authPage from './routes/auth.js';
import profilePage from './routes/profile.js';
import varSession from './middleware/variables.js';
import userMiddleware from './middleware/user.js';
import err404 from './middleware/404.js';
import fileMiddleware from './middleware/file.js';
import KEY from './keys/index.js';
import iseq from './utils/isEqual.js';

const storeMongoDB = connectMongoDB(session);
const link = 'mongodb+srv://Fancules:' + KEY.PASSWORD_MONGODB + '@firstcluster.gswgr.mongodb.net/myFirstDatabase?retryWrites=true&';
const PORT = process.env.PORT || 8080;

const app = express();
const store = new storeMongoDB({
    collection: 'sessions',
    uri: link
});

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: iseq,
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
      },
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({
    extended: true
}));
app.use(session({
    secret: KEY.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store
}));
app.use(fileMiddleware.single('avatar'));
app.use(csrf());
app.use(flash());
app.use(helmet());
app.use(compression());
app.use(varSession);
app.use(userMiddleware);

app.use('/addTeam', addTeamPage);
app.use('/', homePage);
app.use('/list', listPage);
app.use('/cart', cartPage);
app.use('/orders', ordersPage);
app.use('/auth', authPage);
app.use('/profile', profilePage);
app.use(err404);

async function start() {
    try {
        await mongoose.connect(link, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        app.listen(PORT, () => {
            console.log('it is working');
        });

    } catch (e) {
        console.log(e);
    }
}

start();
