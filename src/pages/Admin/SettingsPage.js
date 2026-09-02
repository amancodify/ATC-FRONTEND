import React, { useState } from "react";
import cookie from "js-cookie";
import { Box, Button, CircularProgress, Snackbar, TextField, Typography } from "@mui/material";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import API_URL from "../../config";

/**
 * Settings — the logged-in super admin's own account settings.
 */
const SettingsPage = () => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState(null);

  const adminEmail = cookie.get("_loginemail") || "";
  const adminName = cookie.get("_loginname") || "Admin";

  const notify = (message, severity = "info") => setSnack({ message, severity });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (snack) setSnack(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.currentPassword || !form.newPassword) {
      notify("Please fill in all password fields", "error");
      return;
    }
    if (form.newPassword.length < 8) {
      notify("New password must be at least 8 characters", "error");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      notify("New passwords do not match", "error");
      return;
    }
    setSaving(true);
    const r = await axios
      .put(`${API_URL}/admin/account/password`, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      .catch(() => null);
    setSaving(false);
    if (r && r.data.status === "200") {
      notify("Password changed successfully", "success");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      notify((r && r.data.message) || "Could not change password", "error");
    }
  };

  return (
    <div className="admin-console">
      <div className="page-head">
        <div>
          <Typography variant="h5" className="page-title">Settings</Typography>
          <Typography variant="body2" className="page-sub">
            Manage your platform administrator account.
          </Typography>
        </div>
      </div>

      <div className="settings-grid">
        <div className="ac-card">
          <div className="ac-card-head">
            <span className="ac-eyebrow">Profile</span>
            <Typography variant="h6" className="ac-card-title">Admin account</Typography>
          </div>
          <div className="set-profile">
            <span className="set-profile-avatar" aria-hidden="true">
              {(adminName || "?").trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
            </span>
            <div>
              <div className="set-profile-name">{adminName}</div>
              <div className="set-profile-email">{adminEmail}</div>
              <div className="set-profile-role">SUPER ADMIN</div>
            </div>
          </div>
        </div>

        <Box component="form" onSubmit={handleSave} className="ac-card">
          <div className="ac-card-head">
            <span className="ac-eyebrow">Security</span>
            <Typography variant="h6" className="ac-card-title">Change password</Typography>
            <Typography variant="body2" className="ac-card-sub">
              Use at least 8 characters. You stay signed in after changing.
            </Typography>
          </div>
          <Box sx={{ display: "grid", gap: 2, maxWidth: 420 }}>
            <TextField
              fullWidth
              type="password"
              label="Current password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <TextField
              fullWidth
              type="password"
              label="New password (min 8 chars)"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm new password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            className="ac-submit"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <FontAwesomeIcon icon={faLock} />}
          >
            {saving ? "Updating…" : "Update password"}
          </Button>
        </Box>
      </div>

      <Snackbar
        open={!!snack}
        autoHideDuration={4000}
        onClose={() => setSnack(null)}
        message={snack && snack.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
};

export default SettingsPage;
