
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkflow } from "../context/WorkflowContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, Save, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { UserRole } from "@/types/workflow";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const UploadDocument = () => {
  const navigate = useNavigate();
  const { addFile, currentUser } = useWorkflow();
  const [customerName, setCustomerName] = useState("");
  const [dealOrderId, setDealOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [documentNames, setDocumentNames] = useState<string[]>([""]);

  const handleDocumentNameChange = (index: number, value: string) => {
    const newDocumentNames = [...documentNames];
    newDocumentNames[index] = value;
    setDocumentNames(newDocumentNames);
  };

  const addDocument = () => {
    setDocumentNames([...documentNames, ""]);
  };

  const removeDocument = (index: number) => {
    const newDocumentNames = documentNames.filter((_, i) => i !== index);
    setDocumentNames(newDocumentNames);
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
    
    const now = new Date();
    const documents = documentNames
      .filter(name => name.trim() !== "")
      .map((name, index) => ({
        id: `doc-${Math.floor(Math.random() * 10000)}`,
        name: name.endsWith(".pdf") ? name : `${name}.pdf`,
        url: "#",
        uploadDate: now
      }));
    
    addFile({
      customerName,
      dealOrderId,
      amount: parseFloat(amount),
      submissionDate: now,
      documents,
      currentRole: UserRole.CHECKER, // Use enum value instead of string literal
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
    
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>Upload New Document</CardTitle>
              <CardDescription>
                Fill in the details and upload required documents
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Documents</Label>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={addDocument}
                >
                  <FileUp className="h-4 w-4 mr-2" /> Add Document
                </Button>
              </div>
              
              <div className="space-y-2">
                {documentNames.map((name, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={name}
                      onChange={(e) => handleDocumentNameChange(index, e.target.value)}
                      placeholder="Document name (e.g. Invoice.pdf)"
                      className="flex-1"
                    />
                    {documentNames.length > 1 && (
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon"
                        onClick={() => removeDocument(index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
              <Button type="submit" variant="default">
                <Save className="h-4 w-4 mr-2" /> Submit File
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadDocument;
