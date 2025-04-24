
import React, { useState } from "react";
import { 
  WorkflowFile, 
  FileStatus,
  UserRole 
} from "../types/workflow";
import { useWorkflow } from "../context/WorkflowContext";
import { 
  formatCurrency, 
  formatDate, 
  getRoleName,
  getStatusText,
  getEscalationRole
} from "../utils/workflowUtils";
import { getEscalationText } from "../utils/mockData";
import { 
  Check, 
  X, 
  FileText, 
  AlertCircle, 
  AlertTriangle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileDetailsProps {
  file: WorkflowFile;
  onUpdated: () => void;
}

const FileDetails: React.FC<FileDetailsProps> = ({ file, onUpdated }) => {
  const { currentUser, approveFile, rejectFile } = useWorkflow();
  const [comments, setComments] = useState("");
  
  const handleApprove = () => {
    if (
      file.escalationLevel !== "NONE" && 
      [UserRole.REPORTING_MANAGER, UserRole.DEPARTMENT_HEAD, UserRole.FINANCE_HEAD, UserRole.CFO_CEO].includes(currentUser.role)
    ) {
      // Handle escalation approval
      approveFile(file.id, comments, currentUser.role);
    } else {
      // Handle normal approval based on stage
      approveFile(file.id, comments, currentUser.role);
    }
    onUpdated();
  };
  
  const handleReject = () => {
    if (
      file.escalationLevel !== "NONE" && 
      [UserRole.REPORTING_MANAGER, UserRole.DEPARTMENT_HEAD, UserRole.FINANCE_HEAD, UserRole.CFO_CEO].includes(currentUser.role)
    ) {
      // Handle escalation rejection
      rejectFile(file.id, comments, currentUser.role);
    } else {
      // Handle normal rejection based on stage
      rejectFile(file.id, comments, currentUser.role);
    }
    onUpdated();
  };
  
  const canApproveOrReject = () => {
    if (file.currentStatus === FileStatus.COMPLETED || file.currentStatus === FileStatus.REJECTED) {
      return false;
    }
    
    // Check if user is part of escalation chain and this file is escalated to their level
    if (file.escalationLevel !== "NONE") {
      const escalationRole = getEscalationRole(file.escalationLevel);
      return currentUser.role === escalationRole;
    }
    
    // Check if user is the current assigned role
    return currentUser.role === file.currentRole;
  };
  
  const renderStatusBadge = (status: string) => {
    if (status === "APPROVED") {
      return <Badge className="bg-green-500">Approved</Badge>;
    } else if (status === "REJECTED") {
      return <Badge variant="destructive">Rejected</Badge>;
    } else {
      return <Badge variant="outline">Pending</Badge>;
    }
  };
  
  const isEscalated = file.escalationLevel !== "NONE";
  
  return (
    <div className="space-y-6">
      {/* Basic File Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>File Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Customer Name</TableCell>
                  <TableCell>{file.customerName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Deal/Order ID</TableCell>
                  <TableCell>{file.dealOrderId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Amount</TableCell>
                  <TableCell>{formatCurrency(file.amount)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Status</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">
                        {getStatusText(file.currentStatus)}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Submission Date</TableCell>
                  <TableCell>{formatDate(file.submissionDate)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Current Role</TableCell>
                  <TableCell>{getRoleName(file.currentRole)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Status & Timeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isEscalated && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-center text-red-600 font-medium">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    File Escalated
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    {getEscalationText(file.escalationLevel)}
                  </p>
                </div>
              )}

              <div className="relative">
                <div className="absolute left-1.5 top-0 bottom-0 w-px bg-gray-200"></div>
                
                <div className="mb-4 relative">
                  <div className="flex items-center">
                    <div className="z-10 flex items-center justify-center w-7 h-7 bg-blue-600 rounded-full">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Submitted</p>
                      <p className="text-xs text-gray-500">{formatDate(file.submissionDate)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4 relative">
                  <div className="flex items-center">
                    <div className={`z-10 flex items-center justify-center w-7 h-7 rounded-full ${
                      file.verification.status === "APPROVED" 
                        ? "bg-green-500"
                        : file.verification.status === "REJECTED"
                        ? "bg-red-500"
                        : "bg-gray-300"
                    }`}>
                      {file.verification.status === "APPROVED" ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : file.verification.status === "REJECTED" ? (
                        <X className="h-4 w-4 text-white" />
                      ) : (
                        <span className="text-xs text-white">2</span>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <p className="text-sm font-medium">Verification</p>
                        <div className="ml-2">
                          {renderStatusBadge(file.verification.status)}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {file.verification.verificationDate 
                          ? formatDate(file.verification.verificationDate)
                          : "Pending verification"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4 relative">
                  <div className="flex items-center">
                    <div className={`z-10 flex items-center justify-center w-7 h-7 rounded-full ${
                      file.onboarding.status === "APPROVED" 
                        ? "bg-green-500"
                        : file.onboarding.status === "REJECTED"
                        ? "bg-red-500"
                        : "bg-gray-300"
                    }`}>
                      {file.onboarding.status === "APPROVED" ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : file.onboarding.status === "REJECTED" ? (
                        <X className="h-4 w-4 text-white" />
                      ) : (
                        <span className="text-xs text-white">3</span>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <p className="text-sm font-medium">Onboarding</p>
                        <div className="ml-2">
                          {renderStatusBadge(file.onboarding.status)}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {file.onboarding.onboardingDate 
                          ? formatDate(file.onboarding.onboardingDate)
                          : "Pending onboarding"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="flex items-center">
                    <div className={`z-10 flex items-center justify-center w-7 h-7 rounded-full ${
                      file.payment.status === "APPROVED" 
                        ? "bg-green-500"
                        : file.payment.status === "REJECTED"
                        ? "bg-red-500"
                        : "bg-gray-300"
                    }`}>
                      {file.payment.status === "APPROVED" ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : file.payment.status === "REJECTED" ? (
                        <X className="h-4 w-4 text-white" />
                      ) : (
                        <span className="text-xs text-white">4</span>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <p className="text-sm font-medium">Payment</p>
                        <div className="ml-2">
                          {renderStatusBadge(file.payment.status)}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {file.payment.paymentDate 
                          ? formatDate(file.payment.paymentDate)
                          : "Pending payment"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="documents">
        <TabsList className="w-full">
          <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
          <TabsTrigger value="verifications" className="flex-1">Verifications</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Attached Documents</CardTitle>
              <CardDescription>Documents uploaded with this file</CardDescription>
            </CardHeader>
            <CardContent>
              {file.documents.length > 0 ? (
                <div className="space-y-2">
                  {file.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        <span>{doc.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(doc.uploadDate)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No documents attached</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="verifications">
          <Card>
            <CardHeader>
              <CardTitle>Stage Verifications</CardTitle>
              <CardDescription>Details of verifications at each stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Verification</h4>
                    {renderStatusBadge(file.verification.status)}
                  </div>
                  
                  <p className="text-sm mt-2">
                    {file.verification.comments || "No comments provided"}
                  </p>
                  
                  {file.verification.verificationDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Verified by {file.verification.verifiedBy} on {formatDate(file.verification.verificationDate)}
                    </p>
                  )}
                </div>
                
                <div className="border rounded p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Onboarding</h4>
                    {renderStatusBadge(file.onboarding.status)}
                  </div>
                  
                  <p className="text-sm mt-2">
                    {file.onboarding.remarks || "No remarks provided"}
                  </p>
                  
                  {file.onboarding.onboardingDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Onboarded by {file.onboarding.onboardedBy} on {formatDate(file.onboarding.onboardingDate)}
                    </p>
                  )}
                </div>
                
                <div className="border rounded p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Payment</h4>
                    {renderStatusBadge(file.payment.status)}
                  </div>
                  
                  <p className="text-sm mt-2">
                    {file.payment.comments || "No comments provided"}
                  </p>
                  
                  {file.payment.paymentDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Processed by {file.payment.processedBy} on {formatDate(file.payment.paymentDate)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Timeline of all actions on this file</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {file.history.map((activity) => (
                    <div key={activity.id} className="border-b pb-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{activity.action}</div>
                        <Badge variant="outline" className="text-xs">
                          {getRoleName(activity.userRole)}
                        </Badge>
                      </div>
                      <p className="text-sm mt-1">{activity.details}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        By {activity.performedBy} on {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      {canApproveOrReject() && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isEscalated 
                ? "Escalation Action Required" 
                : "Action Required"}
            </CardTitle>
            <CardDescription>
              {isEscalated
                ? `This file has been escalated to you (${getRoleName(currentUser.role)}) due to delays.`
                : `Please review and take action as ${getRoleName(currentUser.role)}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter your comments or remarks..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleReject}>
              <X className="h-4 w-4 mr-2" /> Reject
            </Button>
            <Button onClick={handleApprove}>
              <Check className="h-4 w-4 mr-2" /> Approve
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default FileDetails;
