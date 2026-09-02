import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, Chip, LinearProgress, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faDatabase,
  faCircleCheck,
  faCirclePause,
  faUserPlus,
  faArrowRight,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import API_URL from "../../config";
import { fmtDate } from "./adminTheme";

/**
 * Dashboard — platform overview: stats, storage meter, quick onboarding
 * CTA and the most recently onboarded customers.
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const summary = data && data.summary;
  const storagePct = summary
    ? Math.min(100, (summary.totalStorageMb / summary.freeTierLimitMb) * 100)
    : 0;
  const recent = (data && data.tenants ? [...data.tenants] : [])
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="admin-console">
      {loading && <LinearProgress className="ac-progress" />}

      <div className="page-head">
        <div>
          <Typography variant="h5" className="page-title">Dashboard</Typography>
          <Typography variant="body2" className="page-sub">
            Platform health at a glance.
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<FontAwesomeIcon icon={faUserPlus} />}
          onClick={() => navigate("/admin/onboard")}
        >
          Onboard customer
        </Button>
      </div>

      {summary && (
        <div className="ac-stats">
          <div className="ac-card ac-stat">
            <span className="ac-stat-ic is-violet"><FontAwesomeIcon icon={faUsers} /></span>
            <div className="ac-stat-body">
              <div className="ac-stat-num">{summary.count}</div>
              <div className="ac-stat-lbl">Customers</div>
              <div className="ac-stat-sub">{summary.active} active · {summary.suspended} suspended</div>
            </div>
          </div>
          <div className="ac-card ac-stat">
            <span className="ac-stat-ic is-teal"><FontAwesomeIcon icon={faCircleCheck} /></span>
            <div className="ac-stat-body">
              <div className="ac-stat-num">{summary.active}</div>
              <div className="ac-stat-lbl">Active workspaces</div>
              <div className="ac-stat-sub">sign-ins enabled</div>
            </div>
          </div>
          <div className="ac-card ac-stat">
            <span className="ac-stat-ic is-amber"><FontAwesomeIcon icon={faCirclePause} /></span>
            <div className="ac-stat-body">
              <div className="ac-stat-num">{summary.suspended}</div>
              <div className="ac-stat-lbl">Suspended</div>
              <div className="ac-stat-sub">blocked at login</div>
            </div>
          </div>
          <div className="ac-card ac-stat ac-stat-wide">
            <span className="ac-stat-ic is-gold"><FontAwesomeIcon icon={faDatabase} /></span>
            <div className="ac-stat-body">
              <div className="ac-stat-num">{summary.totalStorageMb} MB</div>
              <div className="ac-stat-lbl">Storage used</div>
              <div className="ac-stat-sub">of {summary.freeTierLimitMb} MB free tier</div>
              <LinearProgress
                variant="determinate"
                value={storagePct}
                className={`ac-meter ${storagePct > 75 ? "is-hot" : ""}`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Recent customers */}
      <div className="ac-card">
        <div className="ac-card-head ac-row-head">
          <div>
            <span className="ac-eyebrow">Workspace</span>
            <Typography variant="h6" className="ac-card-title">Recently onboarded</Typography>
          </div>
          <Button component={Link} to="/admin/customers" size="small" className="ac-link-btn" endIcon={<FontAwesomeIcon icon={faArrowRight} />}>
            View all
          </Button>
        </div>
        <div className="dash-recent">
          {recent.map((t) => (
            <button
              key={t._id}
              type="button"
              className="dash-recent-row"
              onClick={() => navigate(`/admin/tenants/${t._id}`)}
            >
              <div className="dr-main">
                <div className="ac-co">{t.companyName}</div>
                <div className="ac-code">{t.companyCode}</div>
              </div>
              <span className={`ac-status ${t.status === "ACTIVE" ? "ok" : "bad"}`}>
                <FontAwesomeIcon icon={t.status === "ACTIVE" ? faCircleCheck : faCirclePause} />
                {t.status === "ACTIVE" ? "Active" : "Suspended"}
              </span>
              <span className="dr-storage">{t.storageMb != null ? `${t.storageMb} MB` : "—"}</span>
              <span className="ac-date">{fmtDate(t.createdAt)}</span>
              <FontAwesomeIcon icon={faChevronRight} className="ac-chevron" />
            </button>
          ))}
          {recent.length === 0 && !loading && (
            <div className="ac-empty" style={{ padding: "14px 4px" }}>
              No customers yet — onboard your first customer to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
