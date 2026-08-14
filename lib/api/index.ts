import {
  currentUser,
  emailAudit,
  evidenceAuditRecords,
  executionOrder,
  externalReview,
  lifeAreaResults,
  planOverview,
  roleInspectionPeople,
  handoffInspectionPeople,
} from "./mock-data";

// 실제 API 연결 시 각 함수의 반환부만 fetch 호출로 교체합니다.
export function getCurrentUser() {
  return currentUser;
}
export function getPlanOverview() {
  return planOverview;
}
export function getLifeAreaResults() {
  return lifeAreaResults;
}
export function getExecutionOrder() {
  return executionOrder;
}
export function getEmailAudit() {
  return emailAudit;
}
export function getEvidenceAuditRecords() {
  return evidenceAuditRecords;
}
export function getExternalReview() {
  return externalReview;
}
export function getRoleInspectionPeople() {
  return roleInspectionPeople;
}
export function getHandoffInspectionPeople() {
  return handoffInspectionPeople;
}
