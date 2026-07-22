import {useContext, useEffect, useState} from "react";
import { Link } from "react-router-dom";

import { useApi } from "../api/useApi";
import {useAuth} from "../auth/useAuth.jsx";

import ReviewsContext from "../context/ReviewsProvider.jsx";

// Reusable Divider Component
const Divider = ({ color = "lightgrey", space = "20px" }) => {
  return (
    <hr style={{
      border: "none",
      borderTop: `1px solid ${color}`,
      margin: `${space} 0`
    }} />
  );
};

export default function ReviewList({ serviceId, stylistId }) {
  const api = useApi();
  const user = useAuth(s => s.user);

  const {
        setOpenReviews, setShowRegister
  } = useContext(ReviewsContext);

  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);

  const handleReviewUser = (id) => {
    const reviewUser = users.find(u => u.id === id);
    return reviewUser?.first_name
  };

  const loadReviews = () => {
    const params = [];
    if (serviceId) params.push(`service=${serviceId}`);
    if (stylistId) params.push(`stylist=${stylistId}`);

    api.request(`${import.meta.env.VITE_API_URL}/salon/reviews/?${params.join("&")}`)
      .then(res => {
        if (res.ok) setReviews(res.data);
      });
  };

  useEffect(loadReviews, [serviceId, stylistId]);

  useEffect(() => {
    api.request(`${import.meta.env.VITE_API_URL}/salon/users/all/`)
      .then(res => {
        if (res.ok) setUsers(res.data);
      });
  }, []);

  return (
    <div className="mt-4 space-y-4">
      <span style={{ fontSize: 18, fontStyle: "italic" }}>
        {reviews && "Read our member reviews. "}
        Active subscriber? {" "}
        <Link onClick={() => (
            user && setOpenReviews(true)
        )}>{!user ? "Login and share" : "Share"} your experience here.</Link>{" "}
        {!user && <>Not a member yet? <Link onClick={() => setShowRegister(true)}>Join us today!</Link></>}
      </span>


      <Divider color="#e0e0e0" space="30px" />

      {reviews.map(r => (
        <div key={r.id} className="border p-3 rounded bg-gray-50">
          <div
              className="flex items-center gap-1 text-yellow-400 text-xl"
              style={{
                fontSize: "40px",
                cursor: "pointer",
                userSelect: "none",
              }}
          >
            <span className="text-amber-400" style={{color: "#fbbf24"}}>
              {"★".repeat(r.rating)}
            </span>

            <span className="text-gray-300" style={{color: "#d1d5db"}}>
              {"☆".repeat(5 - r.rating)}
            </span>
          </div>

          <p className="mt-2 text-gray-700">{r.comment}</p>

          <p className="text-sm text-gray-500 mt-1">
            {handleReviewUser(r.user) ? handleReviewUser(r.user) : "Anonymous"} — {new Date(r.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
