import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class SoccerTeam {
    constructor(team, estDate, img){
        this.team = team,
        this.estDate = estDate,
        this.img = img;
        this.id = uuidv4();
    }
    
    toJSON(){
        return {
            team: this.team,
            estDate: this.estDate,
            img: this.img,
            id: this.id
        }
    }
    
    async save(){
        const clubs = await SoccerTeam.getAll();
        
        clubs.push(this.toJSON());
        
        return new Promise((resolve, reject) => {
           fs.writeFile(
            path.join(__dirname, '..', 'data', 'bd.json'),
            JSON.stringify(clubs),
            (err) => {
                if (err){
                    reject(err);
                }else {
                    resolve();
                }
            }
        ) 
        });
    };
    
    static async update(team){
        const clubs = await SoccerTeam.getAll();
        console.log(team);
        const index = clubs.findIndex(elem => elem.id === team.id);   
        clubs[index] = team;
        
        return new Promise((resolve, reject) => {
           fs.writeFile(
            path.join(__dirname, '..', 'data', 'bd.json'),
            JSON.stringify(clubs),
            (err) => {
                if (err){
                    reject(err);
                }else {
                    resolve();
                }
            }
        ) 
        });
    };
    
    static getAll(){
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'bd.json'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        reject(err);
                    }else {
                        resolve(JSON.parse(content));
                    }
                }
            );
        });
    }
    
    static async getById (id) {
        const teams = await SoccerTeam.getAll();
        return teams.find(elem => elem.id === id)
    }
}

export default SoccerTeam;