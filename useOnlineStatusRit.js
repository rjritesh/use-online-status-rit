import { useState, useEffect } from "react";

export default function useOnlineStatusRit({
  onChange,
  debounce = 300,
  trackLastOnline = true,
} = {}) {
  const [online, setOnline] = useState(navigator.onLine);
  const [lastOnline, setLastOnline] = useState(
    trackLastOnline && navigator.onLine ? new Date() : null
  );

  useEffect(() => {
    let timeoutId;

    const handleChange = (status) => {
      if (debounce) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setOnline(status);
          if (trackLastOnline && status) setLastOnline(new Date());
          if (onChange) onChange(status);
        }, debounce);
      } else {
        setOnline(status);
        if (trackLastOnline && status) setLastOnline(new Date());
        if (onChange) onChange(status);
      }
    };

    const handleOnline = () => handleChange(true);
    const handleOffline = () => handleChange(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearTimeout(timeoutId);
    };
  }, [debounce, onChange, trackLastOnline]);

  return { online, lastOnline };
}
