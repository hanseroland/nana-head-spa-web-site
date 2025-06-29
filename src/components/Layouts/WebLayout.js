// filepath: /src/components/Layouts/WebLayout.js
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const WebLayout = ({ children, themeMode, setThemeMode }) => {



    return (
        <>
            <Navbar themeMode={themeMode} setThemeMode={setThemeMode} />
            <main>{children}</main>
            <Footer />
        </>
    );
};

export default WebLayout;