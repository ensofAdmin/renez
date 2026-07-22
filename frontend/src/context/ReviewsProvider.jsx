import {createContext, useState} from "react";

const ReviewsContext = createContext({});

export const ReviewsProvider = ({children}) => {

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [openReviews, setOpenReviews] = useState(false);

    const [service, setService] = useState("");
    const [serviceId, setServiceId] = useState("");
    const [services, setServices] = useState([]);
    const [stylist, setStylist] = useState("");
    const [stylistId, setStylistId] = useState("");
    const [stylists, setStylists] = useState([]);

    const [appointment, setAppointment] = useState("");
    const [appointmentId, setAppointmentId] = useState("");
    const [appointments, setAppointments] = useState([]);

    const [showRegister, setShowRegister] = useState(false)

    return (
        <ReviewsContext value={{
            rating, setRating,
            comment, setComment,
            openReviews, setOpenReviews,

            service, setService,
            serviceId, setServiceId,
            services, setServices,

            stylist, setStylist,
            stylistId, setStylistId,
            stylists, setStylists,

            appointment, setAppointment,
            appointmentId, setAppointmentId,
            appointments, setAppointments,

            showRegister, setShowRegister
        }}>
            {children}
        </ReviewsContext>
    )
};

export default ReviewsContext;