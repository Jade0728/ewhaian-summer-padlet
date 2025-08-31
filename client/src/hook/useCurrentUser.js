// /hook/useCurrentUser.js 
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

export default function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState(null); // { _id, username, ... } or null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await axiosInstance.get("/auth/me"); // 세션 기반 사용자
        if (alive) setCurrentUser(data?.user ?? null);
      }
      catch {
        if (alive) setCurrentUser(null);
      }
      finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { currentUser, loading };
}
