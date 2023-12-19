import { Outlet } from 'react-router-dom';
import Header from "./Header"
import AudioPlayer from "./AudioPlayer"
import { ToastContainer } from 'react-toastify';
import AudioVisualizer from './AudioVisualizer';
import 'react-toastify/dist/ReactToastify.css';
import './LecteurAudio.css';
import './Layout.css';


const Layout = () => {
    return (
        <div className="site">
            <Header/>
            <Outlet/>
            <div className="lecteur-audio">
                <AudioVisualizer/>
                <AudioPlayer/>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Layout;