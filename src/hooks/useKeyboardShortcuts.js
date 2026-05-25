import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TAG_BLACKLIST = new Set(["INPUT", "TEXTAREA", "SELECT"]);

export default function useKeyboardShortcuts(onToggleHUD, hudVisible) {
  const navigate = useNavigate();

  useEffect(() => {
    function handler(e) {
      const tag = document.activeElement?.tagName;
      if (TAG_BLACKLIST.has(tag)) return;

      if (e.key === "?" && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        onToggleHUD();
        return;
      }

      if (e.key === "Escape") {
        if (hudVisible) {
          e.preventDefault();
          onToggleHUD();
        }
        return;
      }

      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case "h":
            e.preventDefault();
            navigate("/");
            break;
          case "d":
            e.preventDefault();
            navigate("/dashboard");
            break;
          case "a":
            e.preventDefault();
            navigate("/add-tasks");
            break;
          case "l":
            e.preventDefault();
            navigate("/list-tasks");
            break;
          case "c":
            e.preventDefault();
            navigate("/data-center");
            break;
          case "r":
            e.preventDefault();
            navigate("/delete-history");
            break;
        }
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onToggleHUD, hudVisible, navigate]);
}
