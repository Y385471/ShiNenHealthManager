import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add RTL and Arabic language support
document.documentElement.dir = "rtl";
document.documentElement.lang = "ar";

createRoot(document.getElementById("root")!).render(<App />);
