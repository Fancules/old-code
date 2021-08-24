import dev from './keys.dev.js';
import prod from './keys.prod.js';
const KEY = process.env.NODE_ENV === "production" ? prod : dev;

export default KEY;