
import React, { useState } from "react";
import { useWorkflow } from "../context/WorkflowContext";
import { FileStatus, UserRole } from "../types/workflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, Save, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface NewFileFormProps {
  onFileCreated: () => void;
  onCancel: () => void;
}

const NewFileForm: React.FC<NewFileFormProps> = ({ onFileCreated, onCancel }) => {
  const { addFile, currentUser } = useWorkflow();
  const [customerName, setCustomerName] = useState("");
  const [dealOrderId, setDealOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [documentsCount, setDocumentsCount] = useState(1);
  const [documentNames, setDocumentNames] = useState<string[]>([""]); // Start with one empty document

  const handleDocumentNameChange = (index: number, value: string) => {
    const newDocumentNames = [...documentNames];
    newDocumentNames[index] = value;
    setDocumentNames(newDocumentNames);
  };

  const addDocument = () => {
    setDocumentNames([...documentNames, ""]);
    setDocumentsCount(documentsCount + 1);
  };

  const removeDocument = (index: number) => {
    const newDocumentNames = [...documentNames];
    newDocumentNames.splice(index, 1);
    setDocumentNames(newDocumentNames);
    setDocumentsCount(documentsCount - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !dealOrderId || !amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Create documents array
    const now = new Date();
    const documents = documentNames
      .filter(name => name.trim() !== "")
      .map((name, index) => ({
        id: `doc-${Math.floor(Math.random() * 10000)}`,
        name: name.endsWith(".pdf") ? name : `${name}.pdf`,
        url: "#",
        uploadDate: now
      }));
    
    // Create the new file
    addFile({
      customerName,
      dealOrderId,
      amount: parseFloat(amount),
      submissionDate: now,
      documents,
      currentRole: UserRole.CHECKER, // First stage after sales is checker
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
      createdBy: currentUser.name
    });
    
    onFileCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dealOrderId">Deal/Order ID *</Label>
            <Input
              id="dealOrderId"
              value={dealOrderId}
              onChange={(e) => setDealOrderId(e.target.value)}
              placeholder="e.g. DEAL-2023-001"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (USD) *</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Documents</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addDocument}
            >
              <FileUp className="h-4 w-4 mr-1" /> Add Document
            </Button>
          </div>
          
          <div className="space-y-2">
            {documentNames.map((name, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={name}
                  onChange={(e) => handleDocumentNameChange(index, e.target.value)}
                  placeholder="Document name (e.g. Invoice.pdf)"
                />
                {documentNames.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeDocument(index)}
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" /> Submit File
        </Button>
      </div>
    </form>
  );
};

export default NewFileForm;
