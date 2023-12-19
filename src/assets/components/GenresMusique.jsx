import "./GenresMusique.css";
import Travail from "../img/jpg/travail.jpg";
import Gym from "../img/jpg/gym.jpg";
import Meditation from "../img/jpg/meditation.jpg";
import Lecture from "../img/jpg/lecture.jpg";
import Route from "../img/jpg/route.jpg";
import Randonnee from "../img/jpg/randonnee.jpg";
import Danse from "../img/jpg/danse.jpg";
import Voyage from "../img/jpg/voyage.jpg";
import { motion } from "framer-motion";

const GenresMusique = () => {
    return (
        <motion.section initial={{ opacity: 0, y: -90}} transition={{duration: 0.3}}
        whileInView={{ opacity: 1, y: 0}} className="musique">
            <h2>Musique selon vos occupations</h2>
            <section className="gallerie">
                <motion.div whileHover={{ scale: 1.1 }}
                    onHoverStart={e => {}}
                    onHoverEnd={e => {}}>
                  <img src={Travail} alt="travail" />
                  <p>Aller au travail</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}
                    onHoverStart={e => {}}
                    onHoverEnd={e => {}}>
                  <img src={Gym} alt="travail" />
                  <p>Séances de Gym</p>  
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}
                    onHoverStart={e => {}}
                    onHoverEnd={e => {}}>
                  <img src={Meditation} alt="travail" />
                  <p>Méditation</p>   
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}
                    onHoverStart={e => {}}
                    onHoverEnd={e => {}}>
                  <img src={Lecture} alt="travail" />
                  <p>Lecture</p>  
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}
                    onHoverStart={e => {}}
                    onHoverEnd={e => {}}>
                  <img src={Route} alt="travail" />
                  <p>Sur la route</p>  
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}
                    onHoverStart={e => {}}
                    onHoverEnd={e => {}}>
                  <img src={Randonnee} alt="travail" />
                  <p>En Randonnée</p>  
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}
                    onHoverStart={e => {}}
                    onHoverEnd={e => {}}>
                  <img src={Danse} alt="travail" />
                  <p>Danse</p>  
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}
                    onHoverStart={e => {}}
                    onHoverEnd={e => {}}>
                  <img src={Voyage} alt="travail" />
                  <p>En Voyage</p> 
                </motion.div>
                
            </section>
        </motion.section>

    );
};
export default GenresMusique;