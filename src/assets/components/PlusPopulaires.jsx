import "./PlusPopulaires.css";
import Album1 from "../img/jpg/ed-sheeran_bad-habits.jpeg";
import Album2 from "../img/jpg/bts_butter.jpg";
import Album3 from "../img/jpg/metallica_master-puppets.jpg";
import Album4 from "../img/jpg/queen_miracle.jpg";
import Album5 from "../img/jpg/the-weeknd_starboy.jpg";
import { motion } from "framer-motion";



const PlusPopulaires = () => {
    return (
        <motion.section initial={{ opacity: 0, x: -90 }}
        transition={{ duration: 0.2, delay: 2}}
        animate={{ opacity: 1, x: 0 }} className="populaire">
            <div className="gallerie-populaire">
                <div>
                  <img src={Album1} alt="" />  
                </div>
                <div>
                 <img src={Album2}alt="" />   
                </div>
                <div>
                   <img src={Album3} alt="" /> 
                </div>
                <div>
                  <img src={Album4} alt="" />  
                </div>
                <div>
                  <img src={Album5} alt="" />  
                </div>
                
            </div>
            <h2>Les plus populaires</h2>
            
        </motion.section>

    );
};
export default PlusPopulaires;