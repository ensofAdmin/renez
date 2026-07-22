import "../styles/home.css"

export default function StylistForm(
    { form, setForm, stylists, onCreate, setConfirmDelete, setModalData }
) {

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for duplicate service name
    const existing = stylists.find(
      s => s.name.toLowerCase() === form.name.toLowerCase()
    );

    if (existing) {
      setModalData(existing);
      return;
    }

    onCreate(form);
    setForm({ name: "", specialty: "", bio: "" });
  };

  return (
      <div className="dashboard-grid">
          <div className="booking-card">
              <h2 className={"booking-title"}>Add New Stylist</h2>

              <form onSubmit={handleSubmit} className="booking-form">
                <input
                  type="text"
                  name="name"
                  placeholder="Stylist Name"
                  value={form.name}
                  onChange={e => handleChange("name", e.target.value)}
                  required
                />

                <input
                  type="text"
                  name="specialty"
                  placeholder="Specialty (Braids, Locks, etc.)"
                  value={form.specialty}
                  onChange={e => handleChange("specialty", e.target.value)}
                  required
                />

                <textarea
                  name="bio"
                  placeholder="Short Bio"
                  value={form.bio}
                  onChange={e => handleChange("bio", e.target.value)}
                />

                <button type="submit" className="booking-submit">Add Stylist</button>
              </form>

              <h3 style={{ marginTop: "30px" }}>Existing Stylists</h3>

              <ul className="stylist-list">
                {stylists.map((s) => (
                  <li key={s.id} className="stylist-item">
                    <span className="stylist-text">{s.name} — {s.specialty}</span>

                    <button
                        className="delete-btn"
                        onClick={() => setConfirmDelete({ open: true, stylist: s })}
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
            </div>
      </div>

  );
}
