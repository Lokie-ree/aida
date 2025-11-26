import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

interface WorkflowStatusProps {
  workflowId: string;
}

export function WorkflowStatus({ workflowId }: WorkflowStatusProps) {
  const status = useQuery(api.rag.getAlignmentStatus, { workflowId });

  if (!status) {
    return (
      <Card data-testid="alignment-workflow-status">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3 py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Initializing analysis...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusType = (status as any)?.type || "unknown";
  const statusData = status as any;

  if (statusType === "inProgress") {
    const stepName = statusData.stepName || "Processing";
    const progress = statusData.progress || 0;
    
    return (
      <Card data-testid="alignment-workflow-status" data-status="in-progress">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Analysis in Progress
          </CardTitle>
          <CardDescription>
            Analyzing your content against Louisiana Student Standards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Step:</span>
              <span className="font-medium" data-testid="alignment-step-name">{stepName}</span>
            </div>
            <Progress value={progress} className="h-2" data-testid="alignment-progress" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>This may take a minute...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (statusType === "completed") {
    return (
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Analysis Complete!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (statusType === "error" || statusType === "failed") {
    const errorMessage = statusData.error || "An error occurred during analysis";
    
    return (
      <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <XCircle className="h-5 w-5" />
            Analysis Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center text-muted-foreground py-4">
          Unknown status: {statusType}
        </div>
      </CardContent>
    </Card>
  );
}

