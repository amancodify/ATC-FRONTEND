import React, { useState } from "react";
import { Snackbar, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDatabase,
  faKey,
  faRobot,
  faShieldHalved,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import OnboardForm from "./OnboardForm";

/**
 * Onboard Customer — form + a "what you get" explainer panel.
 */
const OnboardPage = () => {
  const [snack, setSnack] = useState(null);
  const notify = (message, severity = "info") => setSnack({ message, severity });

  return (
    <div className="admin-console">
      <div className="page-head">
        <div>
          <Typography variant="h5" className="page-title">Onboard Customer</Typography>
          <Typography variant="body2" className="page-sub">
            Spin up a fresh, isolated workspace for a new customer.
          </Typography>
        </div>
      </div>

      <div className="onboard-grid">
        <OnboardForm notify={notify} />

        <aside className="onboard-side">
          <div className="ac-card os-card">
            <span className="ac-eyebrow">What happens next</span>
            <ul className="os-list">
              <li>
                <span className="os-ic is-violet"><FontAwesomeIcon icon={faDatabase} /></span>
                <div>
                  <div className="os-title">Private database</div>
                  <div className="os-desc">A dedicated ATC_&lt;code&gt; database is provisioned with all collections and indexes.</div>
                </div>
              </li>
              <li>
                <span className="os-ic is-gold"><FontAwesomeIcon icon={faKey} /></span>
                <div>
                  <div className="os-title">First login created</div>
                  <div className="os-desc">The initial email + password you enter becomes the customer&apos;s first sign-in.</div>
                </div>
              </li>
              <li>
                <span className="os-ic is-teal"><FontAwesomeIcon icon={faShieldHalved} /></span>
                <div>
                  <div className="os-title">Fully isolated</div>
                  <div className="os-desc">The customer only ever sees their own data — fresh start, zero shared state.</div>
                </div>
              </li>
              <li>
                <span className="os-ic is-violet"><FontAwesomeIcon icon={faRobot} /></span>
                <div>
                  <div className="os-title">AI Chat off by default</div>
                  <div className="os-desc">Reserved for approved customers. Toggle it later in the customer&apos;s Feature flags tab.</div>
                </div>
              </li>
            </ul>
            <div className="os-note">
              <FontAwesomeIcon icon={faCircleCheck} />
              Share the Company ID, initial email and password with the customer after onboarding.
            </div>
          </div>
        </aside>
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

export default OnboardPage;
