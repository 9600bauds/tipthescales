import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './views/Home';
import Room from './views/Room';
import CreateRoom from './views/CreateRoom';

function App() {
    return (
        <Router>
            <div className="App">
                <ToastContainer />
                <Routes> 
                    <Route path="/:roomName/create" element={<CreateRoom />} />
                    <Route path="/:roomName" element={<Room />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
