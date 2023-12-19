import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ShareSocial } from 'react-share-social';
import { useState, useEffect, useRef } from 'react';

import { IoShareSocialSharp } from "react-icons/io5";



const ShareButton = ({ userId, playlistName, playlistId }) => {
    const [isVisible, setIsVisible] = useState(false);
    const modalRef = useRef(null);

    const handleShare = (playlistName) => {
        updateText('Copier');
        setIsVisible(true);
    };

    const copyNotify = (playlistName) => {
        toast.success(`Lien de la playlist ${playlistName} copié dans le presse-papier`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    };

    const updateText = (newText) => {
        const copyIconElement = document.querySelector('.makeStyles-copyIcon-7');

        if (copyIconElement) {
            const paragraphElement = copyIconElement.querySelector('p');

            if (paragraphElement) {
                paragraphElement.textContent = newText;
            }
        }
    };

    const style = {
        root: {
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            borderRadius: 3,
            border: 0,
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            color: 'white',
        },
        copyContainer: {
            border: '1px solid white',
            background: 'rgb(0,0,0,0.7)'
        },
        title: {
            color: 'aquamarine',
            fontStyle: 'italic'
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [modalRef]);

    return (
        <>
            <p>
                <button onClick={() => handleShare(playlistName)}>
                    <IoShareSocialSharp />
                </button>
            </p>
            {isVisible && (
                <div className="modal-backdrop">
                    <div ref={modalRef} className="social-warrior">
                        <ShareSocial
                            title={'Partager la playlist'}
                            url={`${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}/user/${userId}/public-playlist/${playlistId}`}
                            socialTypes={['facebook', 'twitter', 'whatsapp', 'email']}
                            onSocialButtonClicked={() => {}}
                            style={style}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ShareButton;
