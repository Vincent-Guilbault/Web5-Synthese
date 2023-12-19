import "./Nouveautes.css";
import Album1 from "../img/jpg/acdc_back-in-black.jpg";
import Album2 from "../img/jpg/gorillaz_demon-days.jpg";
import Album3 from "../img/jpg/madonna_celebration.jpg";
import Album4 from "../img/jpg/michael-jackson_thriller.jpg";
import Album5 from "../img/jpg/avril-lavigne_let-go.jpg";
import { motion } from "framer-motion";
const Nouveautes = () => {
    return (
        <motion.section initial={{ opacity: 0, x: 90 }}
        transition={{ duration: 0.2, delay: 3}}
        animate={{ opacity: 1, x: 0 }} className="nouveautes">
            
            <div className="gallerie-nouveautes">
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
            <h2>Les nouveautés</h2>
        </motion.section>

    );
};
export default Nouveautes;