"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/api/user";
import type { UserResponse } from "@/lib/api/user-types";

export function useCurrentUser(enabled = true) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    let active = true;
    getCurrentUser()
      .then((next) => { if (active) setUser(next); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "사용자 정보를 불러오지 못했습니다."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [enabled]);

  return { user, setUser, loading, error };
}
