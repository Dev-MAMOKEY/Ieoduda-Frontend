export type PlanSelectionKey =
  | "socialAccount"
  | "obituary"
  | "workAccount"
  | "workHandover"
  | "waitingPeriod"
  | "objectionContact";

export type PlanFormValues = Record<PlanSelectionKey, string> & {
  name: string;
  message: string;
};

export type RequiredPlanField = "name" | "waitingPeriod";

export type StructuredPlan = Pick<PlanFormValues, RequiredPlanField> &
  Partial<Omit<PlanFormValues, RequiredPlanField>> & {
    id: number;
    source: string;
  };
