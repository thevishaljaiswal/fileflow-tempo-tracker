
import React from "react";
import { WorkflowFile } from "../types/workflow";
import { formatCurrency, getStatusColor, getEscalationLevel, getDaysSinceDate } from "../utils/workflowUtils";
import { getEscalationText } from "../utils/mockData";
import { FileWarning, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface FileListProps {
  files: WorkflowFile[];
  onSelect: (file: WorkflowFile) => void;
  selectedFileId?: string;
}

const FileList: React.FC<FileListProps> = ({ files, onSelect, selectedFileId }) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 border border-dashed rounded-lg">
        <p>No files found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => {
        const daysElapsed = getDaysSinceDate(file.submissionDate);
        const currentEscalationLevel = getEscalationLevel(daysElapsed);
        const isEscalated = file.escalationLevel !== "NONE";
        
        return (
          <div
            key={file.id}
            onClick={() => onSelect(file)}
            className={cn(
              "p-3 border rounded-lg cursor-pointer transition-all",
              selectedFileId === file.id
                ? "bg-blue-50 border-blue-300"
                : "hover:bg-gray-50 border-gray-200"
            )}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{file.customerName}</h4>
                <p className="text-sm text-gray-500">{file.dealOrderId}</p>
                <div className="mt-1 flex items-center space-x-2">
                  <div className={`${getStatusColor(file.currentStatus)} h-2 w-2 rounded-full`}></div>
                  <span className="text-xs font-medium">{file.currentStatus}</span>
                  <span className="text-xs text-gray-500">
                    {formatCurrency(file.amount)}
                  </span>
                </div>
              </div>
              
              {isEscalated && (
                <Badge variant="destructive" className="flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span className="text-xs">Escalated</span>
                </Badge>
              )}
            </div>
            
            {isEscalated && (
              <div className="mt-2 text-xs text-red-600 flex items-center">
                <FileWarning className="h-3 w-3 mr-1" />
                {getEscalationText(file.escalationLevel)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FileList;
