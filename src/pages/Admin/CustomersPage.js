import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  InputAdornment,
  LinearProgress,
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faMagnifyingGlass,
  faChevronRight,
  faCircleCheck,
  faCirclePause,
} from "@fortawesome/free-solid-svg-icons";
import API_URL from "../../config";

/**
 * Customers — searchable, filterable list of all customer workspaces.
 * Row click opens the customer page (settings, users, feature flags, danger zone).
 */
const CustomersPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadTenants = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/admin/tenants`)
      .then((r) => r.data.status === "200" && setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

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
    <div className="admin-console">
      {loading && <LinearProgress className="ac-progress" />}

      <div className="page-head">
        <div>
          <Typography variant="h5" className="page-title">Customers</Typography>
          <Typography variant="body2" className="page-sub">
            All customer workspaces. Click a row to manage settings, users and features.
          </Typography>
        </div>
      </div>

      <div className="ac-card">
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
  );
};

export default CustomersPage;
