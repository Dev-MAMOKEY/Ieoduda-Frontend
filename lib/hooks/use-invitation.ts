"use client";

import { useEffect, useRef, useState } from "react";
import {
  decideConfirmerInvitation,
  decideRecipientInvitation,
  getConfirmerInvitation,
  getRecipientInvitation,
} from "@/lib/api/public";
import { getApiErrorMessage } from "@/lib/api/auth";
import type { ConfirmerInviteResponse, RecipientInviteResponse } from "@/lib/api/public-types";

function getToken() {
  return typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("token") ?? "";
}

export function useRecipientInvitation() {
  const [invitation, setInvitation] = useState<RecipientInviteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const requestInFlight = useRef(false);
  const invitationLoaded = useRef(false);
  useEffect(() => {
    if (invitationLoaded.current) return;
    invitationLoaded.current = true;
    const token = getToken();
    if (!token) {
      queueMicrotask(() => { setError("유효한 초대 토큰이 필요합니다."); setLoading(false); });
      return;
    }
    getRecipientInvitation(token).then(setInvitation).catch((reason: unknown) => setError(getApiErrorMessage(reason, "초대를 불러오지 못했습니다."))).finally(() => setLoading(false));
  }, []);
  const decide = async (decision: "accept" | "decline", inquiry = "") => {
    const token = getToken();
    if (!token || requestInFlight.current || invitation?.acceptanceStatus !== "PENDING") return;
    requestInFlight.current = true;
    setPending(true);
    setError("");
    try {
      await decideRecipientInvitation(token, decision, inquiry);
      setInvitation((current) => current ? { ...current, acceptanceStatus: decision === "accept" ? "ACCEPTED" : "DECLINED" } : current);
    } catch (reason) {
      setError(getApiErrorMessage(reason, "응답을 처리하지 못했습니다."));
    } finally {
      requestInFlight.current = false;
      setPending(false);
    }
  };
  const canDecide = invitation?.acceptanceStatus === "PENDING";
  return { invitation, loading, pending, canDecide, error, decide };
}

export function useConfirmerInvitation() {
  const [invitation, setInvitation] = useState<ConfirmerInviteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const requestInFlight = useRef(false);
  const invitationLoaded = useRef(false);
  useEffect(() => {
    if (invitationLoaded.current) return;
    invitationLoaded.current = true;
    const token = getToken();
    if (!token) {
      queueMicrotask(() => { setError("유효한 초대 토큰이 필요합니다."); setLoading(false); });
      return;
    }
    getConfirmerInvitation(token).then(setInvitation).catch((reason: unknown) => setError(getApiErrorMessage(reason, "초대를 불러오지 못했습니다."))).finally(() => setLoading(false));
  }, []);
  const decide = async (decision: "accept" | "decline", inquiry = "") => {
    const token = getToken();
    if (!token || requestInFlight.current || invitation?.acceptanceStatus !== "PENDING") return;
    requestInFlight.current = true;
    setPending(true);
    setError("");
    try {
      const result = await decideConfirmerInvitation(token, decision, inquiry);
      setInvitation((current) => current ? { ...current, acceptanceStatus: result.acceptanceStatus } : current);
      return result;
    } catch (reason) {
      setError(getApiErrorMessage(reason, "응답을 처리하지 못했습니다."));
    } finally {
      requestInFlight.current = false;
      setPending(false);
    }
  };
  const canDecide = invitation?.acceptanceStatus === "PENDING";
  return { invitation, loading, pending, canDecide, error, decide };
}
