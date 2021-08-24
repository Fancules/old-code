import Teams from '../modules/add.js';
import path from 'path';
import fs from 'fs';

const p = path.dirname(process.argv[1]);

class Cart {
    static async add(id) {
        const goods = await Cart.fetch();
        const team = await Teams.getById(id);

        const index = goods.teams.findIndex(c => c.id === team.id);

        const candidate = goods.teams[index];

        if (candidate) {
            candidate.count++;
            goods.teams[index] = candidate;
        } else {
            team.count = 1;
            goods.teams.push(team);
        }

        goods.price += +team.estDate;

        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(p, 'data', 'cart.json'), JSON.stringify(goods), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

    };
    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(p, 'data', 'cart.json'), 'utf-8', (err, content) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(content));
                }
            });
        });
    }

    static async remove(id) {
        const goods = await Cart.fetch();

        const index = goods.teams.findIndex(c => c.id === id);
        const team = goods.teams[index];
        
        if (team.count === 1) {
            goods.teams = goods.teams.filter(t => t.id !== id);
        } else {
            goods.teams[index].count -= 1;
        }
        
        goods.price -= +team.estDate;

        return new Promise((resolve, reject) => {
                fs.writeFile(path.join(p, 'data', 'cart.json'), JSON.stringify(goods), (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(goods);
                    }
                });
            });
    }
}

export default Cart;
