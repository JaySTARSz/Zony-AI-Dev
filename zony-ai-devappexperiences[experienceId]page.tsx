"use client";

import { useEffect, useState } from "react";
import ScriptGenerator from "@/app/components/ScriptGenerator";

export default function ExperiencePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Fetch and log experience/user/access data (console only, not displayed)
    const fetchDebugData = async () => {
      try {
        const token = new URLSearchParams(window.location.search).get("whop-dev-user-token");
        if (!token) return;

        const response = await fetch("/api/debug", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        console.log("Experience:", data.experience);
        console.log("User:", data.user);
        console.log("Access:", data.access);
      } catch (error) {
        console.error("Debug fetch error:", error);
      }
    };

    fetchDebugData();
  }, []);

  if (!mounted) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>;
  }

  return <ScriptGenerator />;
}
