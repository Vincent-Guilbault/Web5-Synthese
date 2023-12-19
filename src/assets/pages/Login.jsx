import { useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from '../context/authContext';
import "./Login.css";
import { motion } from 'framer-motion';

const Login = () => {
  const { signInWithGoogle } = useContext(AuthContext);

  return (
    <motion.div className="connexion"
    initial={{ opacity: 0, x: -90 }}
      transition={{ duration: 0.2}}
      animate={{ opacity: 1, x: 0 }}>
      
      <h1>Se connecter au compte</h1>
      <div className='forms'>
        <label htmlFor="form_utilisateur">Nom d'utilisateur</label>
        <input type="text" />
        <label htmlFor="form_password">Mot de passe</label>
        <input type="text" />
      </div>
      <p>- ou -</p>
      <motion.button whileHover={{ scale: 1.1 }}
                    onHoverStart={e => {}}
                    onHoverEnd={e => {}} onClick={signInWithGoogle}>Se connecter avec Google</motion.button>
      <Link to="/register">Pas encore inscrit?</Link>
      <Link to="/home">Retour à l'accueil</Link>
    </motion.div>
  );
};

export default Login;
