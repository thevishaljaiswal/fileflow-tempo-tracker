
import {
  WorkflowFile,
  UserRole,
  FileStatus,
  EscalationLevel
} from "../types/workflow";

export const generateMockData = (): WorkflowFile[] => {
  const baseDate = new Date();
  
  // Create a date N days ago
  const daysAgo = (days: number) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - days);
    return date;
  };
  
  return [
    // Normal workflow example
    {
      id: "file-1001",
      customerName: "Acme Corporation",
      dealOrderId: "DEAL-2023-001",
      amount: 25000,
      submissionDate: daysAgo(7),
      documents: [
        {
          id: "doc-1",
          name: "Invoice.pdf",
          url: "#",
          uploadDate: daysAgo(7)
        },
        {
          id: "doc-2",
          name: "Contract.pdf",
          url: "#",
          uploadDate: daysAgo(7)
        }
      ],
      currentStatus: FileStatus.VERIFICATION,
      currentRole: UserRole.CHECKER,
      verification: {
        status: "PENDING",
        comments: "",
        verifiedBy: "",
        verificationDate: null
      },
      onboarding: {
        status: "PENDING",
        remarks: "",
        onboardedBy: "",
        onboardingDate: null
      },
      payment: {
        status: "PENDING",
        comments: "",
        processedBy: "",
        paymentDate: null
      },
      escalationLevel: EscalationLevel.NONE,
      escalationDate: null,
      createdBy: "Sales User",
      lastUpdated: daysAgo(7),
      history: [
        {
          id: "activity-1",
          fileId: "file-1001",
          action: "File Created",
          performedBy: "Sales User",
          userRole: UserRole.SALES,
          timestamp: daysAgo(7),
          details: "File was created and submitted"
        }
      ]
    },
    
    // File with escalation example
    {
      id: "file-1002",
      customerName: "TechStart Inc.",
      dealOrderId: "DEAL-2023-002",
      amount: 15000,
      submissionDate: daysAgo(10),
      documents: [
        {
          id: "doc-3",
          name: "Invoice.pdf",
          url: "#",
          uploadDate: daysAgo(10)
        }
      ],
      currentStatus: FileStatus.VERIFICATION,
      currentRole: UserRole.CHECKER,
      verification: {
        status: "PENDING",
        comments: "",
        verifiedBy: "",
        verificationDate: null
      },
      onboarding: {
        status: "PENDING",
        remarks: "",
        onboardedBy: "",
        onboardingDate: null
      },
      payment: {
        status: "PENDING",
        comments: "",
        processedBy: "",
        paymentDate: null
      },
      escalationLevel: EscalationLevel.LEVEL2,
      escalationDate: daysAgo(3),
      createdBy: "Sales User",
      lastUpdated: daysAgo(3),
      history: [
        {
          id: "activity-2",
          fileId: "file-1002",
          action: "File Created",
          performedBy: "Sales User",
          userRole: UserRole.SALES,
          timestamp: daysAgo(10),
          details: "File was created and submitted"
        },
        {
          id: "activity-3",
          fileId: "file-1002",
          action: "Escalation",
          performedBy: "System",
          userRole: UserRole.SALES,
          timestamp: daysAgo(5),
          details: "File escalated to Reporting Manager due to delay (Level 1)"
        },
        {
          id: "activity-4",
          fileId: "file-1002",
          action: "Escalation",
          performedBy: "System",
          userRole: UserRole.SALES,
          timestamp: daysAgo(3),
          details: "File escalated to Department Head due to delay (Level 2)"
        }
      ]
    },
    
    // File in payment stage
    {
      id: "file-1003",
      customerName: "Northern Supplies Ltd.",
      dealOrderId: "DEAL-2023-003",
      amount: 32500,
      submissionDate: daysAgo(15),
      documents: [
        {
          id: "doc-4",
          name: "Invoice.pdf",
          url: "#",
          uploadDate: daysAgo(15)
        },
        {
          id: "doc-5",
          name: "Contract.pdf",
          url: "#",
          uploadDate: daysAgo(15)
        },
        {
          id: "doc-6",
          name: "Terms.pdf",
          url: "#",
          uploadDate: daysAgo(15)
        }
      ],
      currentStatus: FileStatus.PAYMENT,
      currentRole: UserRole.PAYMENT_SUPPORT_MANAGER,
      verification: {
        status: "APPROVED",
        comments: "All documents verified and complete",
        verifiedBy: "Checker User",
        verificationDate: daysAgo(12)
      },
      onboarding: {
        status: "APPROVED",
        remarks: "Onboarding process completed successfully",
        onboardedBy: "Onboarding Manager",
        onboardingDate: daysAgo(8)
      },
      payment: {
        status: "PENDING",
        comments: "",
        processedBy: "",
        paymentDate: null
      },
      escalationLevel: EscalationLevel.NONE,
      escalationDate: null,
      createdBy: "Sales User",
      lastUpdated: daysAgo(8),
      history: [
        {
          id: "activity-5",
          fileId: "file-1003",
          action: "File Created",
          performedBy: "Sales User",
          userRole: UserRole.SALES,
          timestamp: daysAgo(15),
          details: "File was created and submitted"
        },
        {
          id: "activity-6",
          fileId: "file-1003",
          action: "Verification Approved",
          performedBy: "Checker User",
          userRole: UserRole.CHECKER,
          timestamp: daysAgo(12),
          details: "All documents verified and complete"
        },
        {
          id: "activity-7",
          fileId: "file-1003",
          action: "Onboarding Approved",
          performedBy: "Onboarding Manager",
          userRole: UserRole.ONBOARDING_MANAGER,
          timestamp: daysAgo(8),
          details: "Onboarding process completed successfully"
        }
      ]
    },
    
    // Completed file example
    {
      id: "file-1004",
      customerName: "Global Services Inc.",
      dealOrderId: "DEAL-2023-004",
      amount: 47000,
      submissionDate: daysAgo(30),
      documents: [
        {
          id: "doc-7",
          name: "Invoice.pdf",
          url: "#",
          uploadDate: daysAgo(30)
        },
        {
          id: "doc-8",
          name: "Contract.pdf",
          url: "#",
          uploadDate: daysAgo(30)
        }
      ],
      currentStatus: FileStatus.COMPLETED,
      currentRole: UserRole.PAYMENT_SUPPORT_MANAGER,
      verification: {
        status: "APPROVED",
        comments: "All documentation in order",
        verifiedBy: "Checker User",
        verificationDate: daysAgo(28)
      },
      onboarding: {
        status: "APPROVED",
        remarks: "Customer successfully onboarded",
        onboardedBy: "Onboarding Manager",
        onboardingDate: daysAgo(25)
      },
      payment: {
        status: "APPROVED",
        comments: "Payment processed successfully",
        processedBy: "Payment Manager",
        paymentDate: daysAgo(20)
      },
      escalationLevel: EscalationLevel.NONE,
      escalationDate: null,
      createdBy: "Sales User",
      lastUpdated: daysAgo(20),
      history: [
        {
          id: "activity-8",
          fileId: "file-1004",
          action: "File Created",
          performedBy: "Sales User",
          userRole: UserRole.SALES,
          timestamp: daysAgo(30),
          details: "File was created and submitted"
        },
        {
          id: "activity-9",
          fileId: "file-1004",
          action: "Verification Approved",
          performedBy: "Checker User",
          userRole: UserRole.CHECKER,
          timestamp: daysAgo(28),
          details: "All documentation in order"
        },
        {
          id: "activity-10",
          fileId: "file-1004",
          action: "Onboarding Approved",
          performedBy: "Onboarding Manager",
          userRole: UserRole.ONBOARDING_MANAGER,
          timestamp: daysAgo(25),
          details: "Customer successfully onboarded"
        },
        {
          id: "activity-11",
          fileId: "file-1004",
          action: "Payment Processed",
          performedBy: "Payment Manager",
          userRole: UserRole.PAYMENT_SUPPORT_MANAGER,
          timestamp: daysAgo(20),
          details: "Payment processed successfully"
        }
      ]
    }
  ];
};

export const getEscalationText = (level: EscalationLevel): string => {
  switch (level) {
    case EscalationLevel.LEVEL1:
      return "Escalated to Reporting Manager (3-5 days delay)";
    case EscalationLevel.LEVEL2:
      return "Escalated to Department Head (6-8 days delay)";
    case EscalationLevel.LEVEL3:
      return "Escalated to Finance Head (9-11 days delay)";
    case EscalationLevel.LEVEL4:
      return "Escalated to CFO/CEO (12+ days delay)";
    default:
      return "No Escalation";
  }
};
