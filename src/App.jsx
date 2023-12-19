import React from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from "./assets/components/Layout.jsx";
import { Login, Register, Profil, Home, Recherche, Playlist, PlaylistAll, Track, Favoris, RechercheContact, User, Contacts, PublicPlaylist, TopSongs, AccueilConnecte } from './assets/pages/index.js';
import { AuthProvider } from './assets/context/authContext.jsx';
import ProtectedRoutes from './ProtectedRoutes.jsx';
import GuestRoutes from './GuestRoutes.jsx';
import { AudioProvider } from "./lib/audiotim";
import { UserProvider } from './assets/context/userContext.jsx';
import { PlaybackProvider } from './assets/context/playbackContext.jsx';
import { AnimatePresence } from 'framer-motion';

const App = () => {
  return (
    <AnimatePresence> 
      <AuthProvider>
      <UserProvider>
        <AudioProvider>
          <PlaybackProvider>
            <RouterProvider
              router={createBrowserRouter([
                {
                  path: "/",
                  element: <Layout />,
                  children: [
                    {
                      index: true,
                      element: <Navigate to="/profil" replace />,
                    },
                  
                    {
                      path: "login",
                      element: (
                        <GuestRoutes>
                          <Login />
                        </GuestRoutes>
                      ),
                    },
                    {
                      path: "register",
                      element: (
                        <GuestRoutes>
                          <Register />
                        </GuestRoutes>
                      ),
                    },
                    {
                      path: "home",
                      element: (
                        <GuestRoutes>
                          <Home />
                        </GuestRoutes>
                      ),
                    },
                    {
                      path: "AccueilConnecte",
                      element: (
                        <ProtectedRoutes>
                          <AccueilConnecte />
                        </ProtectedRoutes>
                      ),
                    },
                    {
                      path: "profil",
                      element: (
                        <ProtectedRoutes>
                          <Profil />
                        </ProtectedRoutes>),
                    },
                    {
                      path: "recherche",
                      element: (
                        <ProtectedRoutes>
                          <Recherche />
                        </ProtectedRoutes>
                      ),
                    },
                    {
                      path: "playlist",
                      element: (
                        <ProtectedRoutes>
                          <PlaylistAll />
                        </ProtectedRoutes>
                      ),
                    },
                    {
                      path: "/playlist/:playlistId",
                      element: (
                        <ProtectedRoutes>
                          <Playlist />
                        </ProtectedRoutes>
                      ),
                    },
                    {
                      path: "track/:trackId",
                      element: (
                        <ProtectedRoutes>
                          <Track />
                        </ProtectedRoutes>
                      ),
                    },
                    {
                      path: "/playlist/favoris",
                      element: (
                        <ProtectedRoutes>
                          <Favoris />
                        </ProtectedRoutes>
                      ),
                    },
                    {
                      path: "rechercheContact",
                      element: (
                        <ProtectedRoutes>
                          <RechercheContact />
                        </ProtectedRoutes>
                      ),
                    },
                    {
                      path: "user/:userId",
                      element: (
                        <ProtectedRoutes>
                          <User />
                        </ProtectedRoutes>
                      ),
                    },
                    {
                      path: "contacts",
                      element: (
                        <ProtectedRoutes>
                          <Contacts />
                        </ProtectedRoutes>
                      ),
                    },
                    {
                      path: "user/:userId/public-playlist/:playlistId",
                      element: (
                        <ProtectedRoutes>
                          <PublicPlaylist />
                        </ProtectedRoutes>
                      ),
                    },  
                    {
                      path: "top-songs",
                      element: (
                        <ProtectedRoutes>
                          <TopSongs />
                        </ProtectedRoutes>
                      ),
                    },                  
                  ],
                },
                {
                  path: "*",
                  element: <Navigate to="/profil" replace />,
                },
              ])}
            />
          </PlaybackProvider>
        </AudioProvider>
      </UserProvider>
    </AuthProvider>
    </AnimatePresence>
    
  );
};

export default App;
