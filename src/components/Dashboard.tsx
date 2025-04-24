
import React, { useState, useEffect } from "react";
import { useWorkflow } from "../context/WorkflowContext";
import FileList from "./FileList";
import FileDetails from "./FileDetails";
import UserRoleSelector from "./UserRoleSelector";
import NewFileForm from "./NewFileForm";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import { WorkflowFile } from "@/types/workflow";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { currentUser, getFilesForUser } = useWorkflow();
  const [selectedFile, setSelectedFile] = useState<WorkflowFile | null>(null);
  const [files, setFiles] = useState<WorkflowFile[]>([]);
  const [showNewFileForm, setShowNewFileForm] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    refreshFiles();
  }, [currentUser]);

  const refreshFiles = () => {
    setFiles(getFilesForUser());
    setSelectedFile(null);
  };

  const handleSelectFile = (file: WorkflowFile) => {
    setSelectedFile(file);
    setShowNewFileForm(false);
  };

  const handleNewFile = () => {
    setSelectedFile(null);
    setShowNewFileForm(true);
  };

  const handleFileCreated = () => {
    setShowNewFileForm(false);
    refreshFiles();
  };

  const getPendingFiles = () => {
    return files.filter(file => 
      file.currentStatus !== "COMPLETED" && file.currentStatus !== "REJECTED"
    );
  };

  const getCompletedFiles = () => {
    return files.filter(file => file.currentStatus === "COMPLETED");
  };

  const getRejectedFiles = () => {
    return files.filter(file => file.currentStatus === "REJECTED");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">File Movement Workflow</h2>
          <UserRoleSelector />
        </div>
        
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Files</h3>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={refreshFiles}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            
            {currentUser.role === "SALES" && (
              <Button 
                size="sm" 
                variant="default" 
                onClick={handleNewFile}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                New File
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="pending" className="w-1/3">
              Pending
            </TabsTrigger>
            <TabsTrigger value="completed" className="w-1/3">
              Completed
            </TabsTrigger>
            <TabsTrigger value="rejected" className="w-1/3">
              Rejected
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="m-0">
            <FileList 
              files={getPendingFiles()} 
              onSelect={handleSelectFile} 
              selectedFileId={selectedFile?.id} 
            />
          </TabsContent>
          
          <TabsContent value="completed" className="m-0">
            <FileList 
              files={getCompletedFiles()} 
              onSelect={handleSelectFile} 
              selectedFileId={selectedFile?.id} 
            />
          </TabsContent>
          
          <TabsContent value="rejected" className="m-0">
            <FileList 
              files={getRejectedFiles()} 
              onSelect={handleSelectFile} 
              selectedFileId={selectedFile?.id} 
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              {showNewFileForm 
                ? "Create New File" 
                : selectedFile 
                  ? `File Details: ${selectedFile.customerName} (${selectedFile.dealOrderId})` 
                  : "Select a file to view details"}
            </CardTitle>
            <CardDescription>
              {showNewFileForm 
                ? "Fill out the form to create a new file" 
                : selectedFile 
                  ? `Current Status: ${selectedFile.currentStatus}` 
                  : "Or create a new file if you are in the Sales role"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showNewFileForm ? (
              <NewFileForm onFileCreated={handleFileCreated} onCancel={() => setShowNewFileForm(false)} />
            ) : selectedFile ? (
              <FileDetails file={selectedFile} onUpdated={refreshFiles} />
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>Select a file from the list to view its details</p>
                {currentUser.role === "SALES" && (
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={handleNewFile}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" /> Create New File
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
