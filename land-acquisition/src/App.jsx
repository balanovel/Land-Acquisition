import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sourcing from './Routes/Sourcing/Sourcing.jsx';
import Home from './Routes/Home/Home';
import Login from './Routes/Login/Login.jsx';
import Demo from './Routes/Demo/Demo.jsx';
import Demo2 from './Routes/Demo2/Demo2.jsx'; // Correct casing for import
import Screening from './Routes/Screening/Screening';
import './App.css';
import BottomDraw from './Components/bottomdraw.jsx';
import BottomDraw2 from './Routes/BottomDraw2/bottomdraw2.jsx';
import Acquisitions from './Routes/Acquisitions/Acquisitions.jsx';
import Analysis from './Routes/Analysis/Analysis.jsx';
import Design from './Routes/Design/Design.jsx';
import AcquisitionPopUp from './Routes/Acquisitions/AcquisitionPopUp.jsx';
import Construction from './Routes/Construction/Construction.jsx';
import AddNewTask from './Routes/New_Task_Addition/AddNewTask.jsx';
import Dashboard from './Routes/DashBoard/Dashboard.jsx';
import Marketing from './Routes/Marketing/Marketing.jsx';

function App() {
    console.warn("Hello");
    return (
        <Router>
            <Routes>
                <Route index element={<Login />} /> {/* Make Home the default route */}
                <Route path="/home" element={<Home />} />
                <Route path="/home/demo" element={<Demo />} />
                <Route path="/home/demo2" element={<Demo2 />} /> {/* Correct route path */}
                <Route path="/home/sourcing" element={<Sourcing />} />
                <Route path="/home/screening" element={<Screening />} /> {/* Fixed route path to lowercase */}
                <Route path="/home/acquisition" element={<Acquisitions />} /> {/* Fixed route path to lowercase */}
                <Route path='/home/details' element={<AcquisitionPopUp />} />
                <Route path="/home/bottomdraw" element={<BottomDraw />} />
                <Route path="/home/bottomdraw2" element={<BottomDraw2 />} />
                <Route path="/home/analysis" element={<Analysis />} /> {/* Fixed route path to lowercase */}
                <Route path="/home/Design" element={<Design />} />
                <Route path="/home/construction" element={<Construction />} />
                <Route path="/home/addTask" element={<AddNewTask />} />
                <Route path="/home/dashboard" element={<Dashboard />} />
                <Route path="/home/marketing" element={<Marketing />} />

                {/* Uncomment and add missing routes if needed */}
                {/* <Route path="/legal" element={<Legal />} />
                <Route path="/lending" element={<Lending />} />
                <Route path="/dashboard" element={<Dashboard />} /> */}
            </Routes>
        </Router>
    );
}

export default App;
