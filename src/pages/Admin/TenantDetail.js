import React, { useEffect, useState, useCallback } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import cookie from "js-cookie";
import { isLoggedIn, logout } from "../../utils/auth";
import API_URL from "../../config";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Snackbar,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRightFromBracket,
  faCircleCheck,
  faCirclePause,
  faTriangleExclamation,
  faRobot,
  faUserPlus,
  faKey,
  faTrash,
  faPencil,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import { initials as toInitials, fmtDateTime } from "./adminTheme";


const AddUserDialog = ({ tenantId, onClose, onAdded, notify }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      notify("Name, email and a 6+ character password are required", "error");
      return;
    }
    setSaving(true);
    const r = await axios
      .post(`${API_URL}/admin/tenants/${tenantId}/users`, form)
      .catch(() => null);
    setSaving(false);
    if (r && r.data.status === "200") {
      notify(`User ${form.email} added`, "success");
      onAdded();
    } else {
      notify((r && r.data.message) || "Could not add user", "error");
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add user</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField
            autoFocus
            label="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Email (login ID)"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="Password (min 6 chars)"
            type="text"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            helperText="Share this with the user — they cannot change it themselves yet."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? <CircularProgress size={18} /> : "Add user"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ResetPasswordDialog = ({ tenantId, user, onClose, notify }) => {
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (newPassword.length < 6) {
      notify("New password must be at least 6 characters", "error");
      return;
    }
    setSaving(true);
    const r = await axios
      .post(`${API_URL}/admin/tenants/${tenantId}/reset-password`, {
        email: user.email,
        newPassword,
      })
      .catch(() => null);
    setSaving(false);
    if (r && r.data.status === "200") {
      notify(`Password reset for ${user.email}`, "success");
      onClose();
    } else {
      notify((r && r.data.message) || "Could not reset password", "error");
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Reset password — <span className="ac-dialog-code">{user.email}</span>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="New password (min 6 chars)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? <CircularProgress size={18} /> : "Reset password"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const RenameUserDialog = ({ tenantId, user, onClose, onRenamed, notify }) => {
  const [name, setName] = useState(user.name);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const next = name.trim();
    if (!next) {
      notify("User name is required", "error");
      return;
    }
    if (next.length > 80) {
      notify("User name must be 80 characters or fewer", "error");
      return;
    }
    setSaving(true);
    const r = await axios
      .put(`${API_URL}/admin/tenants/${tenantId}/users/${user._id}`, { name: next })
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
        Rename user — <span className="ac-dialog-code">{user.email}</span>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="User name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          inputProps={{ maxLength: 80 }}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || name.trim() === user.name}
        >
          {saving ? <CircularProgress size={18} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ConfirmDialog = ({ title, message, confirmLabel, onConfirm, onClose, notify }) => {
  const [working, setWorking] = useState(false);
  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="error"
          variant="contained"
          onClick={async () => {
            setWorking(true);
            const ok = await onConfirm();
            setWorking(false);
            if (ok) onClose();
          }}
          disabled={working}
        >
          {working ? <CircularProgress size={18} /> : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ONLINE_WINDOW_MS = 2 * 60 * 1000;

const isUserOnline = (u) =>
  !!u.lastSeenAt && Date.now() - new Date(u.lastSeenAt).getTime() < ONLINE_WINDOW_MS;

const TABS = [
  { id: "account", label: "Account" },
  { id: "users", label: "Users" },
  { id: "flags", label: "Feature flags" },
  { id: "danger", label: "Danger zone" },
];

const TenantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "account";

  const [tenant, setTenant] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState(null);

  const [accountForm, setAccountForm] = useState(null);
  const [savingAccount, setSavingAccount] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const [renameUser, setRenameUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [deletingTenant, setDeletingTenant] = useState(false);

  const notify = (message, severity = "info") => setSnack({ message, severity });

  const loadTenant = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/admin/tenants/${id}`)
      .then((r) => {
        if (r.data.status === "200") {
          setTenant(r.data.data.tenant);
          setAccountForm({
            companyName: r.data.data.tenant.companyName,
            contactEmail: r.data.data.tenant.contactEmail || "",
            contactPhone: r.data.data.tenant.contactPhone || "",
            plan: r.data.data.tenant.plan || "FREE",
            notes: r.data.data.tenant.notes || "",
          });
        } else {
          notify(r.data.message || "Could not load customer", "error");
        }
      })
      .catch(() => notify("Could not load customer", "error"))
      .finally(() => setLoading(false));
  }, [id]);

  const loadUsers = useCallback(() => {
    axios
      .get(`${API_URL}/admin/tenants/${id}/users`)
      .then((r) => r.data.status === "200" && setUsers(r.data.data))
      .catch(() => notify("Could not load users", "error"));
  }, [id]);

  useEffect(() => {
    loadTenant();
    loadUsers();
  }, [loadTenant, loadUsers]);

  if (!(isLoggedIn() && cookie.get("_role") === "SUPER_ADMIN")) {
    return <Navigate to="/admin/login" replace />;
  }

  const saveAccount = async () => {
    setSavingAccount(true);
    const r = await axios
      .put(`${API_URL}/admin/tenants/${id}`, accountForm)
      .catch(() => null);
    setSavingAccount(false);
    if (r && r.data.status === "200") {
      setTenant((t) => ({ ...t, ...r.data.data }));
      notify("Account details saved", "success");
    } else {
      notify((r && r.data.message) || "Could not save settings", "error");
    }
  };

  const toggleFlag = async (flag, value) => {
    const r = await axios
      .put(`${API_URL}/admin/tenants/${id}`, { [flag]: value })
      .catch(() => null);
    if (r && r.data.status === "200") {
      setTenant((t) => ({ ...t, ...r.data.data }));
      notify(`${flag === "aiChatEnabled" ? "AI Chat" : "Flag"} ${value ? "enabled" : "disabled"}`, "success");
    } else {
      notify((r && r.data.message) || "Could not update flag", "error");
    }
  };

  const toggleStatus = async () => {
    const next = tenant.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const r = await axios
      .put(`${API_URL}/admin/tenants/${id}/status`, { status: next })
      .catch(() => null);
    if (r && r.data.status === "200") {
      setTenant((t) => ({ ...t, status: next }));
      notify(`Workspace ${next === "ACTIVE" ? "activated" : "suspended"}`, "success");
    } else {
      notify((r && r.data.message) || "Status update failed", "error");
    }
  };

  const removeUser = async (user) => {
    const r = await axios
      .delete(`${API_URL}/admin/tenants/${id}/users/${user._id}`)
      .catch(() => null);
    if (r && r.data.status === "200") {
      notify(`User ${user.email} deleted`, "success");
      loadUsers();
      return true;
    }
    notify((r && r.data.message) || "Could not delete user", "error");
    return false;
  };

  const removeTenant = async () => {
    const r = await axios
      .delete(`${API_URL}/admin/tenants/${id}`, { data: { confirm: "DELETE" } })
      .catch(() => null);
    if (r && r.data.status === "200") {
      notify(`Deleted ${tenant.companyCode} (database dropped)`, "success");
      navigate("/admin");
      return true;
    }
    notify((r && r.data.message) || "Delete failed", "error");
    return false;
  };

  const accountDirty =
    accountForm &&
    tenant &&
    (accountForm.companyName !== tenant.companyName ||
      accountForm.contactEmail !== (tenant.contactEmail || "") ||
      accountForm.contactPhone !== (tenant.contactPhone || "") ||
      accountForm.plan !== (tenant.plan || "FREE") ||
      accountForm.notes !== (tenant.notes || ""));

  const field = (label, name, props = {}) => (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={(accountForm && accountForm[name]) || ""}
      onChange={(e) => setAccountForm({ ...accountForm, [name]: e.target.value })}
      {...props}
    />
  );

  return (
    <div className="admin-console tenant-detail">
        {/* ── Hero band ─────────────────────────────────────────────────── */}
        <header className="ac-hero">
          <span className="ac-glow ac-glow-1" />
          <span className="ac-glow ac-glow-2" />
          <div className="ac-hero-left">
            <button className="td-back" onClick={() => navigate("/admin")} aria-label="Back to customers">
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <span className="ac-mark" aria-hidden="true">{toInitials(tenant && tenant.companyName)}</span>
            <div>
              <div className="ac-title td-title">
                {(tenant && tenant.companyName) || "…"}
                {tenant && (
                  <span className={`td-status ${tenant.status === "ACTIVE" ? "ok" : "bad"}`}>
                    <FontAwesomeIcon icon={tenant.status === "ACTIVE" ? faCircleCheck : faCirclePause} />
                    {tenant.status === "ACTIVE" ? "Active" : "Suspended"}
                  </span>
                )}
              </div>
              <div className="ac-sub td-meta">
                {tenant && (
                  <>
                    <span className="ac-code">{tenant.companyCode}</span>
                    <span>{tenant.userCount} users</span>
                    <span>·</span>
                    <span>{tenant.storageMb != null ? `${tenant.storageMb} MB` : "—"}</span>
                    <span>·</span>
                    <span>Plan: {tenant.plan || "FREE"}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="ac-hero-actions">
            <Button
              className="ac-ghost-btn"
              onClick={toggleStatus}
              startIcon={
                <FontAwesomeIcon icon={tenant && tenant.status === "ACTIVE" ? faCirclePause : faCircleCheck} />
              }
            >
              {tenant && tenant.status === "ACTIVE" ? "Suspend" : "Activate"}
            </Button>
          </div>
        </header>

        <div className="ac-body">
          {loading && <Typography className="ac-empty">Loading…</Typography>}

          {/* ── Tabs ────────────────────────────────────────────────────── */}
          <div className="td-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`td-tab ${tab === t.id ? "is-active" : ""} ${t.id === "danger" ? "is-danger" : ""}`}
                onClick={() => setSearchParams({ tab: t.id })}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Account ─────────────────────────────────────────────────── */}
          {tab === "account" && accountForm && (
            <div className="ac-card td-section">
              <div className="ac-card-head">
                <span className="ac-eyebrow">Settings</span>
                <Typography variant="h6" className="ac-card-title">Account details</Typography>
                <Typography variant="body2" className="ac-card-sub">
                  Company identity shown in the customer portal and reports.
                </Typography>
              </div>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
                {field("Company name", "companyName", { inputProps: { maxLength: 100 } })}
                {field("Contact email", "contactEmail", { type: "email" })}
                {field("Contact phone", "contactPhone")}
                <TextField
                  select
                  fullWidth
                  label="Plan"
                  name="plan"
                  value={accountForm.plan}
                  onChange={(e) => setAccountForm({ ...accountForm, plan: e.target.value })}
                >
                  <MenuItem value="FREE">FREE</MenuItem>
                  <MenuItem value="STANDARD">STANDARD</MenuItem>
                  <MenuItem value="PREMIUM">PREMIUM</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label="Internal notes"
                  name="notes"
                  value={accountForm.notes}
                  onChange={(e) => setAccountForm({ ...accountForm, notes: e.target.value })}
                  sx={{ gridColumn: { md: "1 / -1" } }}
                />
              </Box>
              <Button
                variant="contained"
                className="ac-submit"
                onClick={saveAccount}
                disabled={!accountDirty || savingAccount}
                startIcon={savingAccount ? <CircularProgress size={16} color="inherit" /> : <FontAwesomeIcon icon={faPencil} />}
              >
                {savingAccount ? "Saving…" : "Save changes"}
              </Button>
            </div>
          )}

          {/* ── Users ───────────────────────────────────────────────────── */}
          {tab === "users" && (
            <div className="ac-card td-section">
              <div className="ac-card-head ac-row-head">
                <div>
                  <span className="ac-eyebrow">Access</span>
                  <Typography variant="h6" className="ac-card-title">Login users</Typography>
                  <Typography variant="body2" className="ac-card-sub">
                    People from this company who can sign in to their portal.
                  </Typography>
                </div>
                <Button
                  variant="contained"
                  startIcon={<FontAwesomeIcon icon={faUserPlus} />}
                  onClick={() => setAddUserOpen(true)}
                >
                  Add user
                </Button>
              </div>
              <div className="td-users">
                {users.map((u) => (
                  <div key={u._id} className="td-user-row">
                    <span className={`td-user-avatar ${isUserOnline(u) ? "is-online" : ""}`} aria-hidden="true">{toInitials(u.name)}</span>
                    <div className="td-user-main">
                      <div className="td-user-name">
                        {u.name}
                        {isUserOnline(u) && <span className="td-online-pill">Online</span>}
                      </div>
                      <div className="td-user-email">{u.email}</div>
                    </div>
                    <div className="td-user-meta">
                      <div className="td-user-kv kv-added"><span>Added</span>{fmtDateTime(u.createdAt)}</div>
                      <div className="td-user-kv kv-login">
                        <span>Last login</span>
                        {isUserOnline(u) ? (
                          <span className="td-online-val">Online now</span>
                        ) : (
                          fmtDateTime(u.lastLoginAt)
                        )}
                      </div>
                      <div className="td-user-kv kv-location">
                        <span>Location</span>
                        {u.lastLoginLocation || "—"}
                        {u.lastLoginIp && u.lastLoginLocation !== "Local network" && (
                          <div className="td-user-ip">{u.lastLoginIp}</div>
                        )}
                      </div>
                    </div>
                    <div className="td-user-actions">
                      <Tooltip title="Rename user">
                        <Button size="small" className="ac-act" onClick={() => setRenameUser(u)} startIcon={<FontAwesomeIcon icon={faUserPen} />}>
                          Rename
                        </Button>
                      </Tooltip>
                      <Tooltip title="Reset password">
                        <Button size="small" className="ac-act" onClick={() => setResetUser(u)} startIcon={<FontAwesomeIcon icon={faKey} />}>
                          Reset
                        </Button>
                      </Tooltip>
                      <Tooltip title={users.length <= 1 ? "Cannot delete the only user" : "Delete user"}>
                        <span>
                          <Button
                            size="small"
                            className="ac-act is-danger"
                            onClick={() => setDeleteUser(u)}
                            disabled={users.length <= 1}
                            startIcon={<FontAwesomeIcon icon={faTrash} />}
                          >
                            Delete
                          </Button>
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                ))}
                {users.length === 0 && <div className="ac-empty" style={{ padding: "12px 4px" }}>No users found.</div>}
              </div>
            </div>
          )}

          {/* ── Feature flags ───────────────────────────────────────────── */}
          {tab === "flags" && tenant && (
            <div className="ac-card td-section">
              <div className="ac-card-head">
                <span className="ac-eyebrow">Capabilities</span>
                <Typography variant="h6" className="ac-card-title">Feature flags</Typography>
                <Typography variant="body2" className="ac-card-sub">
                  Toggle optional modules for this workspace. Changes apply immediately.
                </Typography>
              </div>
              <div className="td-flag-row">
                <span className="td-flag-ic is-violet"><FontAwesomeIcon icon={faRobot} /></span>
                <div className="td-flag-main">
                  <div className="td-flag-name">AI Chat</div>
                  <div className="td-flag-desc">
                    Conversational assistant over this workspace&apos;s data. Reserved for approved
                    customers only — keep off unless agreed.
                  </div>
                </div>
                <Switch
                  checked={!!tenant.aiChatEnabled}
                  onChange={(e) => toggleFlag("aiChatEnabled", e.target.checked)}
                  color="primary"
                />
              </div>
            </div>
          )}

          {/* ── Danger zone ─────────────────────────────────────────────── */}
          {tab === "danger" && tenant && (
            <div className="ac-card td-section td-danger">
              <div className="ac-card-head">
                <span className="ac-eyebrow is-red">Irreversible</span>
                <Typography variant="h6" className="ac-card-title">Danger zone</Typography>
              </div>
              <Typography variant="body2" className="td-danger-text">
                Deleting this workspace permanently drops the customer database
                (<strong>{tenant.dbName}</strong>) including all dealers, transactions and
                users. This cannot be undone.
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={() => setDeletingTenant(true)}
                startIcon={<FontAwesomeIcon icon={faTriangleExclamation} />}
              >
                Delete this workspace permanently
              </Button>
            </div>
          )}
        </div>

        {addUserOpen && (
          <AddUserDialog
            tenantId={id}
            onClose={() => setAddUserOpen(false)}
            onAdded={() => {
              setAddUserOpen(false);
              loadUsers();
              loadTenant();
            }}
            notify={notify}
          />
        )}
        {renameUser && (
          <RenameUserDialog
            tenantId={id}
            user={renameUser}
            onClose={() => setRenameUser(null)}
            onRenamed={() => {
              setRenameUser(null);
              loadUsers();
            }}
            notify={notify}
          />
        )}
        {resetUser && (
          <ResetPasswordDialog
            tenantId={id}
            user={resetUser}
            onClose={() => setResetUser(null)}
            notify={notify}
          />
        )}
        {deleteUser && (
          <ConfirmDialog
            title={`Delete ${deleteUser.name}?`}
            message={`They will immediately lose access to this workspace (${deleteUser.email}).`}
            confirmLabel="Delete user"
            onConfirm={() => removeUser(deleteUser)}
            onClose={() => setDeleteUser(null)}
            notify={notify}
          />
        )}
        {deletingTenant && (
          <ConfirmDialog
            title={`Delete ${tenant.companyName}?`}
            message={`This permanently drops the database (${tenant.dbName}) and all customer data. This cannot be undone.`}
            confirmLabel="Delete permanently"
            onConfirm={removeTenant}
            onClose={() => setDeletingTenant(false)}
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
  );
};

export default TenantDetail;
