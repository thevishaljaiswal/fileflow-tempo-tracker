
import React from "react";
import { useWorkflow } from "../context/WorkflowContext";
import { UserRole } from "../types/workflow";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const UserRoleSelector: React.FC = () => {
  const { currentUser, changeCurrentUser } = useWorkflow();

  return (
    <div className="space-y-2">
      <Label htmlFor="role-select">Current Role (Switch to test different roles)</Label>
      <Select
        value={currentUser.role}
        onValueChange={(value) => changeCurrentUser(value as UserRole)}
      >
        <SelectTrigger id="role-select" className="w-full">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={UserRole.SALES}>Sales</SelectItem>
          <SelectItem value={UserRole.CHECKER}>Checker</SelectItem>
          <SelectItem value={UserRole.ONBOARDING_MANAGER}>Onboarding Manager</SelectItem>
          <SelectItem value={UserRole.PAYMENT_SUPPORT_MANAGER}>Payment Support Manager</SelectItem>
          <SelectItem value={UserRole.REPORTING_MANAGER}>Reporting Manager (Escalation L1)</SelectItem>
          <SelectItem value={UserRole.DEPARTMENT_HEAD}>Department Head (Escalation L2)</SelectItem>
          <SelectItem value={UserRole.FINANCE_HEAD}>Finance Head (Escalation L3)</SelectItem>
          <SelectItem value={UserRole.CFO_CEO}>CFO/CEO (Escalation L4)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserRoleSelector;
