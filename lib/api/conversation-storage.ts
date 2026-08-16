// 계획별 대화 세션 ID를 브라우저에 보관해 새로고침 후 백엔드 대화를 복구합니다.

const CONVERSATION_KEY_PREFIX = "ieoduda:conversation:";

// 서버 계획 ID마다 서로 다른 대화 세션 저장 키를 만듭니다.
function getConversationKey(planId: number) {
  return `${CONVERSATION_KEY_PREFIX}${planId}`;
}

export function getStoredConversationId(planId: number) {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(getConversationKey(planId));
  const conversationId = value == null ? NaN : Number(value);
  return Number.isSafeInteger(conversationId) && conversationId > 0 ? conversationId : null;
}

export function setStoredConversationId(planId: number, conversationId: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getConversationKey(planId), String(conversationId));
}

export function clearStoredConversationId(planId: number) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(getConversationKey(planId));
}

export function clearAllStoredConversationIds() {
  if (typeof window === "undefined") return;

  const conversationKeys = Array.from(
    { length: window.localStorage.length },
    (_, index) => window.localStorage.key(index),
  ).filter((key): key is string => key?.startsWith(CONVERSATION_KEY_PREFIX) === true);

  conversationKeys.forEach((key) => window.localStorage.removeItem(key));
}
