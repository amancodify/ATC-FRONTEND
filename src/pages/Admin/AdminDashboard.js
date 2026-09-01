import React, { useEffect, useState, useCallback } from "react";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import cookie from "js-cookie";
import { logout, isLoggedIn } from "../../utils/auth";
import API_URL from "../../config";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faDatabase,
  faUserPlus,
  faArrowUpRightFromSquare,
  faArrowRightFromBracket,
  faCircleCheck,
  faCirclePause,
} from "@fortawesome/free-solid-svg-icons";

// ─── Theme (matches the login/portal design language) ────────────────────────
const adminTheme = createTheme({
  palette: {
    primary: { main: "#5b3df5" },
    secondary: { main: "#f5a623" },
    success: { main: "#16a34a" },
    warning: { main: "#d97706" },
    error: { main: "#dc2626" },
    background: { default: "#f6f7fb" },
    text: { primary: "#12123a", secondary: "#64748b" },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiTextField: { defaultProps: { variant: "outlined", size: "small" } },
    MuiButton: { styleOverrides: { root: { borderRadius: 10 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 16 } } },
  },
});

const OnboardForm = ({ onOnboarded, notify }) => {
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
        onOnboarded();
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
        <Typography variant="h6" className="ac-card-title">
          Onboard new customer
        </Typography>
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
      <Button type="submit" variant="contained" disabled={submitting} className="ac-submit" startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <FontAwesomeIcon icon={faUserPlus} />}>
        {submitting ? "Creating workspace…" : "Create customer"}
      </Button>
    </Box>
  );
};

const UsersDialog = ({ tenant, onClose, notify }) => {
  const [users, setUsers] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [reset, setReset] = useState({ email: "", newPassword: "" });

  const loadUsers = useCallback(() => {
    axios
      .get(`${API_URL}/admin/tenants/${tenant._id}/users`)
      .then((r) => r.data.status === "200" && setUsers(r.data.data))
      .catch(() => notify("Could not load users", "error"));
  }, [tenant._id, notify]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const addUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      notify("Name, email and password are required", "error");
      return;
    }
    const r = await axios.post(`${API_URL}/admin/tenants/${tenant._id}/users`, newUser).catch(() => null);
    if (r && r.data.status === "200") {
      notify("User added", "success");
      setNewUser({ name: "", email: "", password: "" });
      loadUsers();
    } else {
      notify((r && r.data.message) || "Could not add user", "error");
    }
  };

  const resetPassword = async () => {
    if (!reset.email || !reset.newPassword) {
      notify("Email and new password are required", "error");
      return;
    }
    const r = await axios
      .post(`${API_URL}/admin/tenants/${tenant._id}/reset-password`, reset)
      .catch(() => null);
    if (r && r.data.status === "200") {
      notify("Password reset", "success");
      setReset({ email: "", newPassword: "" });
    } else {
      notify((r && r.data.message) || "Could not reset password", "error");
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <span className="ac-dialog-code">{tenant.companyCode}</span> · Users
      </DialogTitle>
      <DialogContent>
        <TableContainer className="ac-mini-table">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(users || []).map((u) => (
                <TableRow key={u._id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                </TableRow>
              ))}
              {users && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="ac-empty">No users</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="subtitle2" className="ac-dialog-section">Add user</Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <TextField label="Name" name="name" value={newUser.name} sx={{ minWidth: 130 }}
            onChange={(e) => setNewUser({ ...newUser, [e.target.name]: e.target.value })} />
          <TextField label="Email" name="email" value={newUser.email} sx={{ minWidth: 180 }}
            onChange={(e) => setNewUser({ ...newUser, [e.target.name]: e.target.value })} />
          <TextField label="Password" name="password" value={newUser.password} sx={{ minWidth: 130 }}
            onChange={(e) => setNewUser({ ...newUser, [e.target.name]: e.target.value })} />
          <Button variant="outlined" onClick={addUser}>Add</Button>
        </Box>

        <Typography variant="subtitle2" className="ac-dialog-section">Reset password</Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <TextField label="Email" name="email" value={reset.email} sx={{ minWidth: 180 }}
            onChange={(e) => setReset({ ...reset, [e.target.name]: e.target.value })} />
          <TextField label="New password" name="newPassword" value={reset.newPassword} sx={{ minWidth: 150 }}
            onChange={(e) => setReset({ ...reset, [e.target.name]: e.target.value })} />
          <Button variant="outlined" onClick={resetPassword}>Reset</Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const RenameDialog = ({ tenant, onClose, onRenamed, notify }) => {
  const [name, setName] = useState(tenant.companyName);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const next = name.trim();
    if (!next) {
      notify("Company name is required", "error");
      return;
    }
    if (next.length > 100) {
      notify("Company name must be 100 characters or fewer", "error");
      return;
    }
    setSaving(true);
    const r = await axios
      .put(`${API_URL}/admin/tenants/${tenant._id}/name`, { companyName: next })
      .catch(() => null);
    setSaving(false);
    if (r && r.data.status === "200") {
      notify(`Renamed to "${next}"`, "success");
      onRenamed();
    } else {
      notify((r && r.data && r.data.message) || "Rename failed", "error");
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Rename <span className="ac-dialog-code">{tenant.companyCode}</span>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Company name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          inputProps={{ maxLength: 100 }}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || name.trim() === tenant.companyName}
        >
          {saving ? <CircularProgress size={18} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteDialog = ({ tenant, onClose, onDeleted, notify }) => {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      notify('Type DELETE to confirm', "error");
      return;
    }
    setDeleting(true);
    const r = await axios
      .delete(`${API_URL}/admin/tenants/${tenant._id}`, { data: { confirm: "DELETE" } })
      .catch(() => null);
    setDeleting(false);
    if (r && r.data.status === "200") {
      notify(`Deleted ${tenant.companyCode} (database dropped)`, "success");
      onDeleted();
    } else {
      notify((r && r.data.message) || "Delete failed", "error");
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Delete {tenant.companyName}?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="error" gutterBottom>
          This permanently drops the customer database ({tenant.dbName}) and all
          their data. This cannot be undone.
        </Typography>
        <TextField
          fullWidth
          label='Type "DELETE" to confirm'
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={handleDelete} disabled={deleting}>
          {deleting ? <CircularProgress size={18} /> : "Delete permanently"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState(null);
  const [usersTenant, setUsersTenant] = useState(null);
  const [deleteTenant, setDeleteTenant] = useState(null);
  const [renameTenant, setRenameTenant] = useState(null);

  const notify = (message, severity = "info") => setSnack({ message, severity });

  const loadTenants = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/admin/tenants`)
      .then((r) => r.data.status === "200" && setData(r.data.data))
      .catch((e) =>
        notify(
          (e.response && e.response.data && e.response.data.error) || "Could not load tenants",
          "error"
        )
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  const toggleStatus = async (tenant) => {
    const next = tenant.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const r = await axios
      .put(`${API_URL}/admin/tenants/${tenant._id}/status`, { status: next })
      .catch(() => null);
    if (r && r.data.status === "200") {
      notify(`${tenant.companyCode} ${next === "ACTIVE" ? "activated" : "suspended"}`, "success");
      loadTenants();
    } else {
      notify((r && r.data.message) || "Status update failed", "error");
    }
  };

  if (!(isLoggedIn() && cookie.get("_role") === "SUPER_ADMIN")) {
    return <Navigate to="/admin/login" replace />;
  }

  const summary = data && data.summary;
  const storagePct = summary
    ? Math.min(100, (summary.totalStorageMb / summary.freeTierLimitMb) * 100)
    : 0;

  return (
    <ThemeProvider theme={adminTheme}>
      <div className="admin-console">
        {/* ── Hero band ─────────────────────────────────────────────────── */}
        <header className="ac-hero">
          <span className="ac-glow ac-glow-1" />
          <span className="ac-glow ac-glow-2" />
          <div className="ac-hero-left">
            <span className="ac-mark" aria-hidden="true">A</span>
            <div>
              <div className="ac-title">ATC Admin Console</div>
              <div className="ac-sub">Manage customer workspaces</div>
            </div>
          </div>
          <div className="ac-hero-actions">
            <Button
              component={Link}
              to="/"
              className="ac-ghost-btn"
              startIcon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
            >
              Site
            </Button>
            <Button
              className="ac-ghost-btn"
              onClick={() => logout("/admin/login")}
              startIcon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
            >
              Logout
            </Button>
          </div>
        </header>

        <div className="ac-body">
          {loading && <LinearProgress className="ac-progress" />}

          {/* ── Stat cards ──────────────────────────────────────────────── */}
          {summary && (
            <div className="ac-stats">
              <div className="ac-card ac-stat">
                <span className="ac-stat-ic is-violet"><FontAwesomeIcon icon={faUsers} /></span>
                <div className="ac-stat-body">
                  <div className="ac-stat-num">{summary.count}</div>
                  <div className="ac-stat-lbl">Customers</div>
                  <div className="ac-stat-sub">
                    {summary.active} active · {summary.suspended} suspended
                  </div>
                </div>
              </div>
              <div className="ac-card ac-stat ac-stat-wide">
                <span className="ac-stat-ic is-gold"><FontAwesomeIcon icon={faDatabase} /></span>
                <div className="ac-stat-body">
                  <div className="ac-stat-num">{summary.totalStorageMb} MB</div>
                  <div className="ac-stat-lbl">Storage used</div>
                  <div className="ac-stat-sub">
                    of {summary.freeTierLimitMb} MB free tier
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={storagePct}
                    className={`ac-meter ${storagePct > 75 ? "is-hot" : ""}`}
                  />
                </div>
              </div>
            </div>
          )}

          <OnboardForm onOnboarded={loadTenants} notify={notify} />

          {/* ── Tenants table ───────────────────────────────────────────── */}
          <div className="ac-card">
            <div className="ac-card-head ac-row-head">
              <div>
                <span className="ac-eyebrow">Workspace</span>
                <Typography variant="h6" className="ac-card-title">Customers</Typography>
              </div>
              <Chip
                size="small"
                label={summary ? `${summary.count} total` : "—"}
                className="ac-count-chip"
              />
            </div>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Company</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Storage</TableCell>
                    <TableCell>Onboarded</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(data && data.tenants ? data.tenants : []).map((t) => (
                    <TableRow key={t._id} className="ac-row" hover>
                      <TableCell>
                        <div className="ac-co">{t.companyName}</div>
                        <div className="ac-code">{t.companyCode}</div>
                      </TableCell>
                      <TableCell>
                        <span className={`ac-status ${t.status === "ACTIVE" ? "ok" : "bad"}`}>
                          <FontAwesomeIcon icon={t.status === "ACTIVE" ? faCircleCheck : faCirclePause} />
                          {t.status === "ACTIVE" ? "Active" : "Suspended"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {t.storageMb != null ? (
                          <div className="ac-store">
                            <div className="ac-store-meta">{t.storageMb} MB</div>
                            <div className="ac-store-track">
                              <div
                                className="ac-store-bar"
                                style={{ width: `${Math.min(100, (t.storageMb / 512) * 100)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="ac-empty">—</span>
                        )}
                      </TableCell>
                      <TableCell className="ac-date">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <div className="ac-actions">
                          <Button size="small" className="ac-act" onClick={() => setRenameTenant(t)}>Rename</Button>
                          <Button size="small" className="ac-act" onClick={() => setUsersTenant(t)}>Users</Button>
                          <Button
                            size="small"
                            className={`ac-act ${t.status === "ACTIVE" ? "is-warn" : "is-ok"}`}
                            onClick={() => toggleStatus(t)}
                          >
                            {t.status === "ACTIVE" ? "Suspend" : "Activate"}
                          </Button>
                          <Button size="small" className="ac-act is-danger" onClick={() => setDeleteTenant(t)}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {data && data.tenants && data.tenants.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="ac-empty">
                        No customers onboarded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>

        {renameTenant && (
          <RenameDialog
            tenant={renameTenant}
            onClose={() => setRenameTenant(null)}
            onRenamed={() => {
              setRenameTenant(null);
              loadTenants();
            }}
            notify={notify}
          />
        )}
        {usersTenant && (
          <UsersDialog tenant={usersTenant} onClose={() => setUsersTenant(null)} notify={notify} />
        )}
        {deleteTenant && (
          <DeleteDialog
            tenant={deleteTenant}
            onClose={() => setDeleteTenant(null)}
            onDeleted={loadTenants}
            notify={notify}
          />
        )}

        <Snackbar
          open={!!snack}
          autoHideDuration={4000}
          onClose={() => setSnack(null)}
          message={snack && snack.message}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </div>
    </ThemeProvider>
  );
};

export default AdminDashboard;
