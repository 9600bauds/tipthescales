import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './views/Home';
import RoomResolver from './views/RoomResolver';

function App() {
    return (
        <Router>
            <div className="App">
                <ToastContainer />
                <Routes> 
                    <Route path="/:roomName" element={<RoomResolver />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
