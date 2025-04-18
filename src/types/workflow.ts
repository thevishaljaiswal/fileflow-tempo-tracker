
export enum FileStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  VERIFICATION = "VERIFICATION",
  ONBOARDING = "ONBOARDING",
  PAYMENT = "PAYMENT",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED"
}

export enum UserRole {
  SALES = "SALES",
  CHECKER = "CHECKER",
  ONBOARDING_MANAGER = "ONBOARDING_MANAGER",
  PAYMENT_SUPPORT_MANAGER = "PAYMENT_SUPPORT_MANAGER",
  REPORTING_MANAGER = "REPORTING_MANAGER",
  DEPARTMENT_HEAD = "DEPARTMENT_HEAD",
  FINANCE_HEAD = "FINANCE_HEAD",
  CFO_CEO = "CFO_CEO"
}

export enum EscalationLevel {
  NONE = "NONE",
  LEVEL1 = "LEVEL1", // 3-5 days - Reporting Manager
  LEVEL2 = "LEVEL2", // 6-8 days - Department Head
  LEVEL3 = "LEVEL3", // 9-11 days - Finance Head
  LEVEL4 = "LEVEL4"  // 12+ days - CFO/CEO
}

export interface Verification {
  status: "PENDING" | "APPROVED" | "REJECTED";
  comments: string;
  verifiedBy: string;
  verificationDate: Date | null;
}

export interface Onboarding {
  status: "PENDING" | "APPROVED" | "REJECTED";
  remarks: string;
  onboardedBy: string;
  onboardingDate: Date | null;
}

export interface Payment {
  status: "PENDING" | "APPROVED" | "REJECTED";
  comments: string;
  processedBy: string;
  paymentDate: Date | null;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadDate: Date;
}

export interface WorkflowFile {
  id: string;
  customerName: string;
  dealOrderId: string;
  amount: number;
  submissionDate: Date;
  documents: Document[];
  currentStatus: FileStatus;
  currentRole: UserRole;
  verification: Verification;
  onboarding: Onboarding;
  payment: Payment;
  escalationLevel: EscalationLevel;
  escalationDate: Date | null;
  createdBy: string;
  lastUpdated: Date;
  history: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  fileId: string;
  action: string;
  performedBy: string;
  userRole: UserRole;
  timestamp: Date;
  details: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}
