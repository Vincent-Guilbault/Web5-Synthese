import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from '../context/authContext';
import { db } from '../config/firebase';
import { getDoc, doc } from "firebase/firestore";
import "../pages/Contacts.css";
import { motion } from "framer-motion";

const Contacts = () => {
  const { user } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (user) {
        try {
          const userRef = doc(db, "Utilisateurs", user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setContacts(userData.contacts || []);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des contacts : ", error);
        }
      }
    };

    fetchContacts();
  }, [user]);

  return (
    <motion.div className="contacts-body"
      initial={{ opacity: 0, x: -90 }}
      transition={{ duration: 0.2}}
      animate={{ opacity: 1, x: 0 }}>
      <h1>Contacts</h1>
      <ul>
      {contacts.length > 0 ? (
            contacts.map((contact, index) => (
                <motion.li whileHover={{ scale: 1.1 }}
                onHoverStart={e => {}}
                onHoverEnd={e => {}} key={index}>
                    <img src={contact.photoURL} alt={"Photo de profil de " + contact.displayName} />
                    <Link to={"/user/"+contact.id}>{contact.displayName}</Link>
                </motion.li>
            ))
        ) : (
            <div>
                <p>Vous n'avez pas ajouté de contacts encore...</p>
            </div>
        )}
      </ul>
      <div className="bkg">
       <Link to="/RechercheContact">Trouver des contacts</Link> 
      </div>
      
    </motion.div>
  );
};

export default Contacts;
