import { Link } from 'react-router-dom';
import "./Home.css";
import PlusPopulaires from '../components/PlusPopulaires';
import Nouveautes from '../components/Nouveautes';
import GenresMusique from '../components/GenresMusique';
import { motion } from 'framer-motion';
import Logo from "../img/svg/logo_magenta_noir.svg";

const AccueilConnecte = () => {
    return (
        <motion.div className='home-body'
        initial={{ opacity: 0, x: -90 }}
        transition={{ duration: 0.2}}
        animate={{ opacity: 1, x: 0 }}>
            <div className="header-titre">
                <motion.img whileHover={{ scale: 1.1 }}
                    onHoverStart={e => {}}
                    onHoverEnd={e => {}} src={Logo} alt="" />
                <h1>Laissez la musique vous connecter entre vous.</h1>
            </div>
            
            <br />
            
            <PlusPopulaires/>
            <Nouveautes/>
            <GenresMusique/>
        </motion.div>
    );
};

export default AccueilConnecte;