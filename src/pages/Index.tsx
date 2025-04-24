
import { WorkflowProvider } from "../context/WorkflowContext";
import Dashboard from "../components/Dashboard";

const Index = () => {
  return (
    <WorkflowProvider>
      <Dashboard />
    </WorkflowProvider>
  );
};

export default Index;
