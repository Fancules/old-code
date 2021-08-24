import dev from './keys.dev.js';
import prod from './keys.prod.js';
const KEY = process.env.node_env === "production" ? prod : dev;

export default KEY;