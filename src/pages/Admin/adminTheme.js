import { createTheme } from "@mui/material/styles";

// Shared MUI theme for all admin console pages (matches the ATC design language)
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
    MuiSwitch: { styleOverrides: { root: { "& .MuiSwitch-switchBase.Mui-checked": { color: "#5b3df5" } } } },
  },
});

export default adminTheme;

export const initials = (name) =>
  String(name || "")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "Never");

export const fmtDateTime = (d) =>
  d
    ? `${new Date(d).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}, ${new Date(d).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : "Never";
