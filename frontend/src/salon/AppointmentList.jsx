import { useEffect } from "react"

import {useSidebar} from "../ui/useSidebar.js";
import GoogleCalendarPage from "../pages/GoogleCalendarPage.jsx";

export default function AppointmentList() {

    const closeSidebar = useSidebar(state => state.closeSidebar);

    useEffect(() => {
        closeSidebar();   // auto-close on page load
    }, []);

    return (
        <GoogleCalendarPage/>
    )
}
