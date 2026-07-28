"use client";

import { useEffect, useState } from "react";
import ScriptGenerator from "@/app/components/ScriptGenerator";

export default function ExperiencePage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState("");
  const [userProducts, setUserProducts] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);

    const fetchUserData = async () => {
      try {
        const token = new URLSearchParams(window.location.search).get("whop-dev-user-token");
        if (!token) return;

        // Decode token to get userId
        const parts = token.split(".");
        if (parts.length !== 3) return;

        const decoded = JSON.parse(atob(parts[1]));
        const uid = decoded.sub;
        setUserId(uid);

        // Fetch user memberships to get products
        const response = await fetch(`/api/user-access?userId=${uid}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setUserProducts(data.products || []);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!mounted) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>;
  }

  return <ScriptGenerator userId={userId} userProducts={userProducts} />;
}
