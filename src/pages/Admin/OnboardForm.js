import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import API_URL from "../../config";

/**
 * Onboarding form — creates a private database + first login for a company.
 * Used on the dedicated "Onboard Customer" page.
 */
const OnboardForm = ({ notify }) => {
  const navigate = useNavigate();
  const empty = {
    companyName: "",
    companyCode: "",
    contactEmail: "",
    contactPhone: "",
    initialName: "",
    initialEmail: "",
    initialPassword: "",
  };
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName || !form.initialName || !form.initialEmail || !form.initialPassword) {
      notify("Company name and initial login details are required", "error");
      return;
    }
    if (form.initialPassword.length < 6) {
      notify("Initial password must be at least 6 characters", "error");
      return;
    }
    setSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/admin/tenants`, form);
      if (response.data.status === "200") {
        const t = response.data.data.tenant;
        notify(`Onboarded ${t.companyName} — Company ID: ${t.companyCode}`, "success");
        setForm(empty);
        navigate(`/admin/tenants/${t._id}`);
      } else {
        notify(response.data.message || "Onboarding failed", "error");
      }
    } catch (err) {
      notify(
        (err.response && err.response.data && err.response.data.message) ||
          "Onboarding failed. Please try again.",
        "error"
      );
    }
    setSubmitting(false);
  };

  const field = (name, label, type = "text", required = false) => (
    <TextField
      fullWidth
      type={type}
      label={label}
      name={name}
      value={form[name]}
      onChange={handleChange}
      required={required}
    />
  );

  return (
    <Box component="form" onSubmit={handleSubmit} className="ac-card ac-onboard">
      <div className="ac-card-head">
        <span className="ac-eyebrow">Onboarding</span>
        <Typography variant="h6" className="ac-card-title">New customer</Typography>
        <Typography variant="body2" className="ac-card-sub">
          Creates a private database and the first login for the company.
        </Typography>
      </div>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 2 }}>
        {field("companyName", "Company Name", "text", true)}
        {field("companyCode", "Company ID (auto if blank)")}
        {field("contactEmail", "Contact Email")}
        {field("contactPhone", "Contact Phone")}
        {field("initialName", "Initial User Name", "text", true)}
        {field("initialEmail", "Initial User Email", "email", true)}
        {field("initialPassword", "Initial Password (min 6)", "password", true)}
      </Box>
      <Button
        type="submit"
        variant="contained"
        disabled={submitting}
        className="ac-submit"
        startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <FontAwesomeIcon icon={faUserPlus} />}
      >
        {submitting ? "Creating workspace…" : "Create customer"}
      </Button>
    </Box>
  );
};

export default OnboardForm;
