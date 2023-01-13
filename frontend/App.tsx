import React from "react"
import {
  BrowserRouter,
  Routes,
  Route,

} from "react-router-dom";




import { makeStyles } from "@mui/material";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, Slider, styled } from '@mui/material'

import Store from "./components/Store";
import Header from './header';
// import Navbar from "./components/Navbar";
import { Profile } from "./pages/Profile"
import { Home } from "./pages/Home";
import Item from "./pages/Item";


export default () => {


  const Root = styled('div')`
  padding: 1% 2% 10vh 2%;
  width: 100%;
  min-height: 95vh;
  display: flex;


  & a {
    text-decoration: none;
    color: ${({ theme: { palette } }) => palette.primary.main};
  }
`
  return (
    <BrowserRouter>
      <Store>
        <Root>
          <Header/>
          <ToastContainer />
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/item/:id" element={<Item />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Root>
      </Store>
    </BrowserRouter>


  )
}

