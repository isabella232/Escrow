import React, { useState } from "react"
import { useEffect } from "react"
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Identity } from "@dfinity/agent";


import { HOST } from "../lib/canisters";
import { ONE_WEEK_NS, IDENTITY_PROVIDER } from "../lib/constants";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';

import { useOneblock, useSetAgent, useGlobalContext, useEscrow } from "./Store";
import { Profile } from "frontend/api/profile/profile.did";
import OrderList from "./orders/OrderList";


export default () => {

  const oneblock = useOneblock();
  const escrow = useEscrow();
  const setAgent = useSetAgent();
  const { state: { isAuthed, principal } } = useGlobalContext();
  const [openProfile, setOpenProfile] = useState(false);

  const [profile, setProfile] = useState<Profile>();
  const [authClient, setAuthClient] = useState<AuthClient>(null);



  useEffect(() => {

    (async () => {
      const authClient = await AuthClient.create(
        {
          idleOptions: {
            disableIdle: true,
            disableDefaultIdleCallback: true
          }
        }
      );
      setAuthClient(authClient);


      if (await authClient.isAuthenticated()) {
        handleAuthenticated(authClient);
        loadProfile();
      }


    })();

  }, []);

  const handleAuthenticated = async (authClient: AuthClient) => {

    const identity: Identity = authClient.getIdentity();
    setAgent({
      agent: new HttpAgent({
        identity,
        host: HOST,
      }),
      isAuthed: true,

    });

  };

  const login = async () => {
    authClient.login({
      identityProvider: IDENTITY_PROVIDER,
      maxTimeToLive: ONE_WEEK_NS,
      onSuccess: () => handleAuthenticated(authClient),
    });
  };

  const logout = async () => {
    await authClient.logout();
    setAgent({ agent: null });
  };

  async function loadProfile() {
    if (principal) {
      oneblock.getMyProfile().then(res => {
        if (res[0]) {
          setProfile(res[0])
        }
      });
    }
  }



  return (

    <AppBar color="secondary" position="static" sx={{ mb: 2 }}>
      <Toolbar >
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >

        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Transfer Safely with Open Escrow
        </Typography>
        {isAuthed && <Button color="inherit" onClick={() => setOpenProfile(true)}>Profile</Button>}
        {!isAuthed && <Button color="inherit" onClick={login}>Login</Button>}
        {principal && <Tooltip title={principal.toString()}><Button color="inherit" onClick={logout}>{principal.toString().slice(0, 5) + "..." + principal.toString().slice(-5)}</Button></Tooltip>}

      </Toolbar>

      <Dialog
      maxWidth="md"
      fullWidth
      onClose={()=>setOpenProfile(false)} open={openProfile}>
        <DialogTitle>Orders</DialogTitle>
          <OrderList/>
      </Dialog>
    </AppBar>

  )
}

