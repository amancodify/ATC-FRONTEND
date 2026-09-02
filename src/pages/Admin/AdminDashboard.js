import React, { useEffect, useState, useCallback } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import cookie from "js-cookie";
import { logout, isLoggedIn } from "../../utils/auth";
import API_URL from "../../config";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  LinearProgress,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
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
  faMagnifyingGlass,
  faChevronRight,
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

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

  if (!(isLoggedIn() && cookie.get("_role") === "SUPER_ADMIN")) {
    return <Navigate to="/admin/login" replace />;
  }

  const summary = data && data.summary;
  const storagePct = summary
    ? Math.min(100, (summary.totalStorageMb / summary.freeTierLimitMb) * 100)
    : 0;

  const visibleTenants = (data && data.tenants ? data.tenants : []).filter((t) => {
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && t.status === "ACTIVE") ||
      (statusFilter === "SUSPENDED" && t.status === "SUSPENDED");
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (t.companyName || "").toLowerCase().includes(q) ||
      (t.companyCode || "").toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

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
            <div className="ac-toolbar">
              <TextField
                fullWidth
                placeholder="Search by company name or ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faMagnifyingGlass} className="ac-search-ic" />
                    </InputAdornment>
                  ),
                }}
              />
              <div className="ac-filters">
                {["ALL", "ACTIVE", "SUSPENDED"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`ac-filter ${statusFilter === s ? "is-active" : ""}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Company</TableCell>
                    <TableCell>Plan</TableCell>
                    <TableCell>Users</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Storage</TableCell>
                    <TableCell>Onboarded</TableCell>
                    <TableCell aria-label="Open" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleTenants.map((t) => (
                    <TableRow
                      key={t._id}
                      className="ac-row ac-row-click"
                      hover
                      onClick={() => navigate(`/admin/tenants/${t._id}`)}
                    >
                      <TableCell>
                        <div className="ac-co">{t.companyName}</div>
                        <div className="ac-code">{t.companyCode}</div>
                      </TableCell>
                      <TableCell>
                        <div className="ac-plan-wrap">
                          <span className={`ac-plan ac-plan-${(t.plan || "FREE").toLowerCase()}`}>
                            {t.plan || "FREE"}
                          </span>
                          {!!t.aiChatEnabled && (
                            <Tooltip title="AI Chat enabled">
                              <span className="ac-ai-badge">AI</span>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="ac-users-cell">
                          <FontAwesomeIcon icon={faUsers} />
                          {t.userCount != null ? t.userCount : "—"}
                        </span>
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
                      <TableCell align="right" className="ac-open-cell">
                        <FontAwesomeIcon icon={faChevronRight} className="ac-chevron" />
                      </TableCell>
                    </TableRow>
                  ))}
                  {visibleTenants.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="ac-empty">
                        {search || statusFilter !== "ALL"
                          ? "No customers match your search."
                          : "No customers onboarded yet."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>

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
