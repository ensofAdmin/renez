// src/dashboard/SuperuserDashboard.jsx

import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

import { useApi } from "../api/useApi";
import {useAuth} from "../auth/useAuth.jsx";
import {useSidebar} from "../ui/useSidebar.js";

import ServicesForm from "../salon/ServicesForm.jsx";
import {ServiceModal} from "../salon/ServiceModal.jsx";
import ConfirmServiceDelModal from "../salon/ConfirmServiceDelModal.jsx";

import StylistForm from "../salon/StylistForm.jsx";
import { StylistModal } from "../salon/StylistModal.jsx";
import ConfirmStylistDelModal from "../salon/ConfirmStylistDelModal.jsx";

import UserAdminForm from "../auth/UserAdminForm.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function DashboardCard({ title, children }) {

  return (
    <div className="dashboard-card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default function SuperuserDashboard() {

    const closeSidebar = useSidebar(state => state.closeSidebar);
    const api = useApi();
    const accessToken = useAuth(state => state.access);

    const navigate = useNavigate();

    const [serviceModal, setServiceModal] = useState(null); // holds existing service if duplicate
    const [serviceForm, setServiceForm] = useState({ name: "", duration: "", price: "" });
    const [serviceConfirmDelete, setServiceConfirmDelete] = useState({
      open: false,
      stylist: null,
    });

    const [services, setServices] = useState([]);
    const [stylists, setStylists] = useState([]);

    const [stylistForm, setStylistForm] = useState({
        name: "",
        specialty: "",
        bio: "",
    });
    const [stylistModal, setStylistModal] = useState(null); // holds existing service if duplicate
    const [stylistConfirmDelete, setStylistConfirmDelete] = useState({
      open: false,
      stylist: null,
    });

    const [error, setError] = useState("");

    useEffect(() => {
        closeSidebar();   // auto-close on page load
    }, []);

    // Load services on mount
    useEffect(() => {
        if (!accessToken) return;
        loadServices();
        loadStylists();
    }, [accessToken]);

    const loadServices = async () => {
        setError("");

        const res = await api.request(`${API_URL}/salon/services/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          console.log("Failed to load services:", res.data);
          setError("Failed to load services.");
          setServices([]);
          return;
        }

        // ⭐ Sort alphabetically by name
        const sorted = [...res.data].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setServices(sorted);
    };

    const updateService = async id => {
        const res = await api.request(`${API_URL}/salon/services/${id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuth.getState().accessToken}`
          },
          body: JSON.stringify(serviceForm)
        });

        if (!res.ok) {
          console.log("Failed to update service:", res.data);
          return;
        }

        setServiceForm({ name: "", duration: "", price: "" });
        await loadServices();
        setServiceModal(null);
        navigate("/superuser")
    }

    const deleteService = async id => {
        setError("");

        const res = await api.request(`${API_URL}/salon/services/${id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${useAuth.getState().accessToken}`,
          },
        });

        if (!res.ok) {
          setError(`Failed to delete service: ${res.data}`)
          return;
        }

        // Refresh list after delete
        await loadServices();
    };

    // -------------------------
    // STYLISTS
    // -------------------------
    const loadStylists = async () => {
        const res = await api.request(`${API_URL}/salon/stylists/`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.ok) {
          const sorted = [...res.data].sort((a, b) => a.name.localeCompare(b.name));
          setStylists(sorted);
        }
    };

    const createStylist = async (payload) => {
        const res = await api.request(`${API_URL}/salon/stylists/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) loadStylists();
    };

    const deleteStylist = async (id) => {
        const res = await api.request(`${API_URL}/salon/stylists/${id}/`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.ok) loadStylists();
    };

    const updateStylist = async id => {
        const res = await api.request(`${API_URL}/salon/stylists/${id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuth.getState().accessToken}`
          },
          body: JSON.stringify(stylistForm)
        });

        if (!res.ok) {
          console.log("Failed to update service:", res.data);
          return;
        }

        setStylistForm({ name: "", specialty: "", bio: "" });
        await loadStylists();
        setStylistModal(null);
        navigate("/superuser")
    }

    if (!accessToken) {
        return <p>You need to log in as superuser to manage services.</p>;
    }

    return (
        <div className="dashboard-container">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <div className="dashboard-grid">

            {/* SERVICES */}
            <DashboardCard>
              <ServicesForm
                  setModalData={setServiceModal}
                  form={serviceForm}
                  setForm={setServiceForm}
                  error={error}
                  setError={setError}
                  services={services}
                  loadServices={loadServices}
                  setConfirmDelete={setServiceConfirmDelete}
              />
            </DashboardCard>

            {/* STYLISTS */}
            <DashboardCard>
              <StylistForm
                form={stylistForm}
                setForm={setStylistForm}
                stylists={stylists}
                onCreate={createStylist}
                setConfirmDelete={setStylistConfirmDelete}
                setModalData={setStylistModal}
              />
            </DashboardCard>

            <DashboardCard>
              <UserAdminForm />
            </DashboardCard>
          </div>
            {
                serviceModal && (
                  <ServiceModal
                    existing={serviceModal}
                    onUpdate={() => updateService(serviceModal.id)}
                    onClose={() => setServiceModal(null)}
                  />
                )
            }

            {
                stylistModal && (
                  <StylistModal
                    existing={stylistModal}
                    onUpdate={() => updateStylist(stylistModal.id)}
                    onClose={() => setStylistModal(null)}
                  />
                )
            }

            {
                serviceConfirmDelete.open && (
                    <ConfirmServiceDelModal
                        open={serviceConfirmDelete.open}
                        service={serviceConfirmDelete.service}
                        onClose={() => setServiceConfirmDelete({ open: false, service: null })}
                        onConfirm={() => {
                            deleteService(serviceConfirmDelete.service.id);
                            setServiceConfirmDelete({ open: false, service: null });
                        }}
                    />
                )
            }

            {
                stylistConfirmDelete.open && (
                    <ConfirmStylistDelModal
                        open={stylistConfirmDelete.open}
                        stylist={stylistConfirmDelete.stylist}
                        onClose={() => setStylistConfirmDelete({ open: false, stylist: null })}
                        onConfirm={() => {
                            deleteStylist(stylistConfirmDelete.stylist.id);
                            setStylistConfirmDelete({ open: false, stylist: null });
                        }}
                    />
                )
            }
        </div>
    );
}
