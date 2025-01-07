import React from "react";
import "./index.css";
import ReactDOM from 'react-dom/client'
import routes from "./components/Routes";
import { RouterProvider } from 'react-router-dom';
import { UserProvider } from "./components/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <UserProvider>
            <RouterProvider router={routes} />
        </UserProvider>
    </React.StrictMode>
);