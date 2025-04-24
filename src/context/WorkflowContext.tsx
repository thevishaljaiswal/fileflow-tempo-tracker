
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  WorkflowFile,
  UserRole,
  FileStatus,
  EscalationLevel,
  ActivityLog
} from "../types/workflow";
import { generateMockData } from "../utils/mockData";
import { toast } from "@/components/ui/use-toast";

interface WorkflowContextType {
  files: WorkflowFile[];
  currentUser: { id: string; name: string; role: UserRole };
  addFile: (file: Omit<WorkflowFile, "id" | "history" | "lastUpdated" | "escalationLevel" | "escalationDate" | "currentStatus">) => void;
  updateFile: (fileId: string, updates: Partial<WorkflowFile>) => void;
  approveFile: (fileId: string, comments: string, role: UserRole) => void;
  rejectFile: (fileId: string, comments: string, role: UserRole) => void;
  getFileById: (id: string) => WorkflowFile | undefined;
  getFilesForUser: () => WorkflowFile[];
  changeCurrentUser: (role: UserRole) => void;
  logActivity: (fileId: string, action: string, details: string) => void;
}

const defaultUser = { id: "1", name: "Sales User", role: UserRole.SALES };

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<WorkflowFile[]>([]);
  const [currentUser, setCurrentUser] = useState(defaultUser);

  useEffect(() => {
    // Initialize with mock data
    setFiles(generateMockData());
  }, []);

  const addFile = (fileData: Omit<WorkflowFile, "id" | "history" | "lastUpdated" | "escalationLevel" | "escalationDate" | "currentStatus">) => {
    const newId = `file-${Math.floor(Math.random() * 10000)}`;
    const now = new Date();
    
    const newFile: WorkflowFile = {
      ...fileData,
      id: newId,
      currentStatus: FileStatus.SUBMITTED,
      escalationLevel: EscalationLevel.NONE,
      escalationDate: null,
      lastUpdated: now,
      history: [{
        id: `activity-${Math.floor(Math.random() * 10000)}`,
        fileId: newId,
        action: "File Created",
        performedBy: currentUser.name,
        userRole: currentUser.role,
        timestamp: now,
        details: "File was created and submitted"
      }]
    };

    setFiles(prev => [...prev, newFile]);
    toast({
      title: "File Created",
      description: `File ${newId} has been created successfully`,
    });

    return newId;
  };

  const updateFile = (fileId: string, updates: Partial<WorkflowFile>) => {
    setFiles(prev => 
      prev.map(file => 
        file.id === fileId 
        ? { 
            ...file, 
            ...updates, 
            lastUpdated: new Date() 
          } 
        : file
      )
    );
  };

  const logActivity = (fileId: string, action: string, details: string) => {
    const newActivity: ActivityLog = {
      id: `activity-${Math.floor(Math.random() * 10000)}`,
      fileId,
      action,
      performedBy: currentUser.name,
      userRole: currentUser.role,
      timestamp: new Date(),
      details
    };

    setFiles(prev => 
      prev.map(file => 
        file.id === fileId 
        ? { 
            ...file, 
            history: [...file.history, newActivity],
            lastUpdated: new Date()
          } 
        : file
      )
    );
  };

  const approveFile = (fileId: string, comments: string, role: UserRole) => {
    const file = files.find(f => f.id === fileId);
    
    if (!file) return;
    
    let newStatus = file.currentStatus;
    let nextRole = file.currentRole;
    let details = "";
    
    // Update based on current role
    switch (role) {
      case UserRole.CHECKER:
        newStatus = FileStatus.ONBOARDING;
        nextRole = UserRole.ONBOARDING_MANAGER;
        details = `Verification approved by ${currentUser.name}`;
        
        updateFile(fileId, {
          currentStatus: newStatus,
          currentRole: nextRole,
          verification: {
            ...file.verification,
            status: "APPROVED",
            comments,
            verifiedBy: currentUser.name,
            verificationDate: new Date()
          }
        });
        break;
        
      case UserRole.ONBOARDING_MANAGER:
        newStatus = FileStatus.PAYMENT;
        nextRole = UserRole.PAYMENT_SUPPORT_MANAGER;
        details = `Onboarding approved by ${currentUser.name}`;
        
        updateFile(fileId, {
          currentStatus: newStatus,
          currentRole: nextRole,
          onboarding: {
            ...file.onboarding,
            status: "APPROVED",
            remarks: comments,
            onboardedBy: currentUser.name,
            onboardingDate: new Date()
          }
        });
        break;
        
      case UserRole.PAYMENT_SUPPORT_MANAGER:
        newStatus = FileStatus.COMPLETED;
        details = `Payment approved by ${currentUser.name}`;
        
        updateFile(fileId, {
          currentStatus: newStatus,
          payment: {
            ...file.payment,
            status: "APPROVED",
            comments,
            processedBy: currentUser.name,
            paymentDate: new Date()
          }
        });
        break;
        
      // Handle escalation approvals
      case UserRole.REPORTING_MANAGER:
      case UserRole.DEPARTMENT_HEAD:
      case UserRole.FINANCE_HEAD:
      case UserRole.CFO_CEO:
        details = `Escalation approved by ${currentUser.name} (${role})`;
        
        // Determine next stage based on current status
        if (file.currentStatus === FileStatus.VERIFICATION) {
          newStatus = FileStatus.ONBOARDING;
          nextRole = UserRole.ONBOARDING_MANAGER;
          
          updateFile(fileId, {
            currentStatus: newStatus,
            currentRole: nextRole,
            verification: {
              ...file.verification,
              status: "APPROVED",
              comments: comments + ` (Escalation approved by ${role})`,
              verifiedBy: currentUser.name,
              verificationDate: new Date()
            },
            escalationLevel: EscalationLevel.NONE,
            escalationDate: null
          });
        } else if (file.currentStatus === FileStatus.ONBOARDING) {
          newStatus = FileStatus.PAYMENT;
          nextRole = UserRole.PAYMENT_SUPPORT_MANAGER;
          
          updateFile(fileId, {
            currentStatus: newStatus,
            currentRole: nextRole,
            onboarding: {
              ...file.onboarding,
              status: "APPROVED",
              remarks: comments + ` (Escalation approved by ${role})`,
              onboardedBy: currentUser.name,
              onboardingDate: new Date()
            },
            escalationLevel: EscalationLevel.NONE,
            escalationDate: null
          });
        } else if (file.currentStatus === FileStatus.PAYMENT) {
          newStatus = FileStatus.COMPLETED;
          
          updateFile(fileId, {
            currentStatus: newStatus,
            payment: {
              ...file.payment,
              status: "APPROVED",
              comments: comments + ` (Escalation approved by ${role})`,
              processedBy: currentUser.name,
              paymentDate: new Date()
            },
            escalationLevel: EscalationLevel.NONE,
            escalationDate: null
          });
        }
        break;
    }
    
    logActivity(fileId, "File Approved", details);
    
    toast({
      title: "File Approved",
      description: `File has been approved and moved to ${newStatus} stage`,
      variant: "default",
    });
  };

  const rejectFile = (fileId: string, comments: string, role: UserRole) => {
    const file = files.find(f => f.id === fileId);
    
    if (!file) return;
    
    let details = "";
    
    // Update based on current role
    switch (role) {
      case UserRole.CHECKER:
        details = `Verification rejected by ${currentUser.name}`;
        
        updateFile(fileId, {
          currentStatus: FileStatus.REJECTED,
          verification: {
            ...file.verification,
            status: "REJECTED",
            comments,
            verifiedBy: currentUser.name,
            verificationDate: new Date()
          }
        });
        break;
        
      case UserRole.ONBOARDING_MANAGER:
        details = `Onboarding rejected by ${currentUser.name}`;
        
        updateFile(fileId, {
          currentStatus: FileStatus.REJECTED,
          onboarding: {
            ...file.onboarding,
            status: "REJECTED",
            remarks: comments,
            onboardedBy: currentUser.name,
            onboardingDate: new Date()
          }
        });
        break;
        
      case UserRole.PAYMENT_SUPPORT_MANAGER:
        details = `Payment rejected by ${currentUser.name}`;
        
        updateFile(fileId, {
          currentStatus: FileStatus.REJECTED,
          payment: {
            ...file.payment,
            status: "REJECTED",
            comments,
            processedBy: currentUser.name,
            paymentDate: new Date()
          }
        });
        break;
        
      // Handle escalation rejections
      case UserRole.REPORTING_MANAGER:
      case UserRole.DEPARTMENT_HEAD:
      case UserRole.FINANCE_HEAD:
      case UserRole.CFO_CEO:
        details = `Escalation rejected by ${currentUser.name} (${role})`;
        
        updateFile(fileId, {
          currentStatus: FileStatus.REJECTED,
          escalationLevel: EscalationLevel.NONE,
          escalationDate: null
        });
        break;
    }
    
    logActivity(fileId, "File Rejected", details);
    
    toast({
      title: "File Rejected",
      description: "File has been rejected",
      variant: "destructive",
    });
  };

  const getFileById = (id: string) => {
    return files.find(file => file.id === id);
  };

  const getFilesForUser = () => {
    // If user is in escalation chain, they see escalated files for their level
    if ([UserRole.REPORTING_MANAGER, UserRole.DEPARTMENT_HEAD, UserRole.FINANCE_HEAD, UserRole.CFO_CEO].includes(currentUser.role)) {
      const escalationLevelMap = {
        [UserRole.REPORTING_MANAGER]: EscalationLevel.LEVEL1,
        [UserRole.DEPARTMENT_HEAD]: EscalationLevel.LEVEL2,
        [UserRole.FINANCE_HEAD]: EscalationLevel.LEVEL3,
        [UserRole.CFO_CEO]: EscalationLevel.LEVEL4,
      };
      
      return files.filter(file => 
        file.escalationLevel === escalationLevelMap[currentUser.role as keyof typeof escalationLevelMap]
      );
    }
    
    // Regular roles see files assigned to their role
    return files.filter(file => file.currentRole === currentUser.role);
  };

  const changeCurrentUser = (role: UserRole) => {
    // This is just for demo, in a real app we would have a proper auth system
    const roleNames = {
      [UserRole.SALES]: "Sales User",
      [UserRole.CHECKER]: "Checker User",
      [UserRole.ONBOARDING_MANAGER]: "Onboarding Manager",
      [UserRole.PAYMENT_SUPPORT_MANAGER]: "Payment Support Manager",
      [UserRole.REPORTING_MANAGER]: "Reporting Manager",
      [UserRole.DEPARTMENT_HEAD]: "Department Head",
      [UserRole.FINANCE_HEAD]: "Finance Head",
      [UserRole.CFO_CEO]: "CFO/CEO",
    };
    
    setCurrentUser({
      id: role.toLowerCase(),
      name: roleNames[role],
      role
    });
    
    toast({
      title: "User Changed",
      description: `Now acting as ${roleNames[role]}`,
    });
  };

  const value = {
    files,
    currentUser,
    addFile,
    updateFile,
    approveFile,
    rejectFile,
    getFileById,
    getFilesForUser,
    changeCurrentUser,
    logActivity
  };

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
};

export const useWorkflow = (): WorkflowContextType => {
  const context = useContext(WorkflowContext);
  
  if (context === undefined) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  
  return context;
};
