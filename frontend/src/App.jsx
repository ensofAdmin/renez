import { Routes, Route } from "react-router-dom";

import SuperuserRoute from "./routes/SuperuserRoute.jsx";
import ValidUserRoute from "./routes/ValidUserRoute.jsx";

import SuperuserDashboard from "./dashboard/SuperuserDashboard.jsx";

import Layout from "./components/Layout";

import BookAppointment from "./salon/BookAppointment";
import AppointmentList from "./salon/AppointmentList";
import AppointmentDetails from "./salon/AppointmentDetails";
import {KanbanPage} from "./pages/KanbanPage.jsx";

import {HomePage} from "./pages/HomePage.jsx";

import "react-big-calendar/lib/css/react-big-calendar.css";


export default function App() {
  return (
    <Routes>
      <Route path="*" element={<MainRoutes />} />
    </Routes>
  )
}

function MainRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Layout />}>
            <Route path="/" element={<HomePage />} />

            <Route path="/home" element={<HomePage />} />

            <Route path="/book" element={<ValidUserRoute><BookAppointment /></ValidUserRoute>} />
            <Route path="/appointments" element={<ValidUserRoute><AppointmentList /></ValidUserRoute>} />
            <Route path="/appointments/:id" element={<ValidUserRoute><AppointmentDetails /></ValidUserRoute>} />
            <Route path="/kanban" element={<ValidUserRoute><KanbanPage /></ValidUserRoute>} />

            <Route path="/superuser" element={<SuperuserRoute><SuperuserDashboard /></SuperuserRoute>}/>
        </Route>
    </Routes>
  )
}
