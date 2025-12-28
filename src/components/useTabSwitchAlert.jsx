import { useEffect } from "react";

export default function useTabSwitchAlert() {
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        alert("⚠️ Tab switching detected! Further attempts may result in suspension.");
      }
    };

    const onBlur = () => {
      alert("⚠️ Window change detected! Further attempts may result in suspension.");
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
    };
  }, []);
}
