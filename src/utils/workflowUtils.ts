
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { EscalationLevel, FileStatus, UserRole } from "../types/workflow";

export const getTimeElapsed = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

export const getDaysSinceDate = (date: Date): number => {
  return differenceInDays(new Date(), date);
};

export const getEscalationLevel = (days: number): EscalationLevel => {
  if (days >= 12) {
    return EscalationLevel.LEVEL4; // CFO / CEO
  } else if (days >= 9) {
    return EscalationLevel.LEVEL3; // Finance Head
  } else if (days >= 6) {
    return EscalationLevel.LEVEL2; // Department Head
  } else if (days >= 3) {
    return EscalationLevel.LEVEL1; // Reporting Manager
  } else {
    return EscalationLevel.NONE;
  }
};

export const getEscalationRole = (level: EscalationLevel): UserRole => {
  switch (level) {
    case EscalationLevel.LEVEL1:
      return UserRole.REPORTING_MANAGER;
    case EscalationLevel.LEVEL2:
      return UserRole.DEPARTMENT_HEAD;
    case EscalationLevel.LEVEL3:
      return UserRole.FINANCE_HEAD;
    case EscalationLevel.LEVEL4:
      return UserRole.CFO_CEO;
    default:
      return UserRole.SALES; // Default, should not happen
  }
};

export const getStatusText = (status: FileStatus): string => {
  switch (status) {
    case FileStatus.DRAFT:
      return "Draft";
    case FileStatus.SUBMITTED:
      return "Submitted";
    case FileStatus.VERIFICATION:
      return "Verification";
    case FileStatus.ONBOARDING:
      return "Onboarding";
    case FileStatus.PAYMENT:
      return "Payment";
    case FileStatus.COMPLETED:
      return "Completed";
    case FileStatus.REJECTED:
      return "Rejected";
    default:
      return "Unknown";
  }
};

export const getStatusColor = (status: FileStatus): string => {
  switch (status) {
    case FileStatus.DRAFT:
      return "bg-gray-300";
    case FileStatus.SUBMITTED:
      return "bg-blue-500";
    case FileStatus.VERIFICATION:
      return "bg-indigo-500";
    case FileStatus.ONBOARDING:
      return "bg-cyan-500";
    case FileStatus.PAYMENT:
      return "bg-green-500";
    case FileStatus.COMPLETED:
      return "bg-emerald-500";
    case FileStatus.REJECTED:
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const getRoleName = (role: UserRole): string => {
  switch (role) {
    case UserRole.SALES:
      return "Sales";
    case UserRole.CHECKER:
      return "Checker";
    case UserRole.ONBOARDING_MANAGER:
      return "Onboarding Manager";
    case UserRole.PAYMENT_SUPPORT_MANAGER:
      return "Payment Support Manager";
    case UserRole.REPORTING_MANAGER:
      return "Reporting Manager";
    case UserRole.DEPARTMENT_HEAD:
      return "Department Head";
    case UserRole.FINANCE_HEAD:
      return "Finance Head";
    case UserRole.CFO_CEO:
      return "CFO/CEO";
    default:
      return "Unknown";
  }
};

export const checkEscalationNeeded = (
  status: FileStatus,
  submissionDate: Date,
  currentEscalationLevel: EscalationLevel
): {
  needsEscalation: boolean;
  newLevel: EscalationLevel;
} => {
  const daysSinceSubmission = getDaysSinceDate(submissionDate);
  const newLevel = getEscalationLevel(daysSinceSubmission);
  
  // If the file is not in a valid status for escalation, return false
  if (
    status === FileStatus.DRAFT ||
    status === FileStatus.COMPLETED ||
    status === FileStatus.REJECTED
  ) {
    return { needsEscalation: false, newLevel: EscalationLevel.NONE };
  }
  
  // If the escalation level has increased, we need to escalate
  if (newLevel !== EscalationLevel.NONE && newLevel !== currentEscalationLevel) {
    return { needsEscalation: true, newLevel };
  }
  
  return { needsEscalation: false, newLevel: currentEscalationLevel };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDate = (date: Date | null): string => {
  if (!date) return "N/A";
  
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};
