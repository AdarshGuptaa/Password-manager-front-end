import React from "react";
import "./index.css";
import MyNavbar from "./components/MyNavbar";
import YourPasswords from "./components/pages/YourPasswords";
import AddPassword from "./components/pages/AddPassword";
import About from "./components/pages/About";
import Container from 'react-bootstrap/Container';
import {Route, Routes} from "react-router-dom";
import LoginSignup from "./components/pages/LoginSignup";

const API_BASE = "http://localhost:8080";

const PasswordManagerApp = () => {
    
    return(
        <>
            <MyNavbar/>
            <Container>
                <Routes>
                    <Route path="/" element={<LoginSignup/>}/>
                    <Route path="/yourpasswords" element={<YourPasswords/>}/>
                    <Route path="/addpassword" element={<AddPassword/>}/>
                    <Route path="/about" element={<About/>}/>

                </Routes>
            </Container>
        </>
        
    );
}

export default PasswordManagerApp;
