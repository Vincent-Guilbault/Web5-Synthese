import { Link } from 'react-router-dom';
import "./Header.css";

import { IoListSharp, IoMusicalNoteSharp, IoPeopleSharp, IoPersonSharp  } from "react-icons/io5";

const Profil = () => {
    return (
        <nav className="header">
            <img src="/coin_gauche_mauve.svg" alt="left_corner" className="left-purple-corner"/>
            <img src="/coin_droit_mauve.svg" alt="right_corner" className="right-purple-corner"/>
            <ul>
                <li>
                    <Link to="/profil">
                        <IoPersonSharp />
                    </Link>
                </li>
                <li>
                    <Link to="/contacts">
                        <IoPeopleSharp />
                    </Link>
                </li>
                <li>
                    <Link to="/AccueilConnecte">
                        <img src="/logo_white.svg" alt="logo" />
                    </Link>
                </li>
                <li>
                    <Link to="/playlist">
                        <IoListSharp />
                    </Link>
                </li>
                <li>
                    <Link to="/recherche">
                        <IoMusicalNoteSharp />
                    </Link>
                </li>
            </ul> 
        </nav>
        
    );
};

export default Profil;
