import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import Room from './views/Room';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes> 
                    <Route path="/" element={<Home />} />
                    <Route path="/:roomName" element={<Room />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
