import { useState, useEffect } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ContentInputForm, type ContentInputData } from "./ContentInputForm";
import { WorkflowStatus } from "./WorkflowStatus";
import { ScorecardResults, type ScorecardData } from "./ScorecardResults";
import { StandardsDisplay } from "./StandardsDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, FileText, AlertCircle } from "lucide-react";
import { spacing } from "@/lib/spacing";

function AlignmentScorecard() {
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<ScorecardData | null>(null);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<"ela" | "math" | "science" | "social_studies">("ela");
  const [standardsError, setStandardsError] = useState<string | null>(null);
  const [standards, setStandards] = useState<any[] | null>(null);
  const [isLoadingStandards, setIsLoadingStandards] = useState(false);

  const analyzeContent = useAction(api.rag.analyzeContentAlignment);
  const getStandards = useAction(api.ragService.getStandards);
  const workflowStatus = useQuery(
    api.rag.getAlignmentStatus,
    workflowId ? { workflowId } : "skip"
  );
  const recentAnalyses = useQuery(api.testHelpers.getRecentAnalyses);
  
  // Load standards when grade level and subject are selected
  useEffect(() => {
    if (selectedGradeLevel && selectedSubject) {
      setIsLoadingStandards(true);
      setStandardsError(null);
      getStandards({
        gradeLevel: selectedGradeLevel,
        subject: selectedSubject,
      })
        .then((result) => {
          if (Array.isArray(result)) {
            setStandards(result);
            if (result.length === 0) {
              setStandardsError("No Louisiana standards found for this grade and subject. Our standards database is being set up.");
            } else {
              setStandardsError(null);
            }
          } else {
            setStandardsError("We're having trouble loading the Louisiana standards. Our team has been notified.");
            setStandards(null);
          }
        })
        .catch((error) => {
          const errorMessage = error instanceof Error ? error.message : String(error || "Unknown error");
          setStandardsError(`We encountered an issue loading the standards. If this persists, please contact support.`);
          setStandards(null);
        })
        .finally(() => {
          setIsLoadingStandards(false);
        });
    } else {
      setStandards(null);
      setStandardsError(null);
    }
  }, [selectedGradeLevel, selectedSubject, getStandards]);

  // Monitor workflow status and extract result when completed
  useEffect(() => {
    if (workflowStatus && (workflowStatus as any)?.type === "completed") {
      const result = (workflowStatus as any)?.result;
      if (result) {
        setCurrentAnalysis(result as ScorecardData);
      }
    }
  }, [workflowStatus]);

  const handleSubmit = async (data: ContentInputData) => {
    try {
      setSelectedGradeLevel(data.gradeLevel);
      setSelectedSubject(data.subject);
      setCurrentAnalysis(null);
      setStandardsError(null);
      const result = await analyzeContent({
        content: data.content,
        gradeLevel: data.gradeLevel,
        subject: data.subject,
        standardCodes: data.standardCodes,
      });
      setWorkflowId(result.workflowId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error || "Unknown error");
      console.error("Error starting analysis:", errorMessage);
      setStandardsError(`We couldn't start the alignment analysis. Please try again, or contact support if the issue continues.`);
    }
  };

  const handleNewAnalysis = () => {
    setWorkflowId(null);
    setCurrentAnalysis(null);
  };

  const isAnalyzing = workflowId !== null && workflowStatus && (workflowStatus as any)?.type === "inProgress";
  const isCompleted = workflowStatus && (workflowStatus as any)?.type === "completed";

  return (
    <div className={`min-h-screen bg-background ${spacing.container} ${spacing.containerY}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold font-heading">Alignment Scorecard</h1>
          <p className="text-muted-foreground">
            Analyze your AI-generated content against Louisiana Student Standards
          </p>
        </div>

        <Tabs defaultValue="analyze" className="space-y-6">
          <TabsList>
            <TabsTrigger value="analyze">
              <FileText className="mr-2 h-4 w-4" />
              Analyze Content
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" />
              Recent Analyses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            {/* Standards Loading Warning */}
            {standardsError && (
              <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <CardTitle className="text-yellow-900 dark:text-yellow-100">
                      Standards Database Loading
                    </CardTitle>
                  </div>
                  <CardDescription className="text-yellow-800 dark:text-yellow-200">
                    {standardsError}
                    <br />
                    <span className="text-sm mt-2 block">
                      The Louisiana Student Standards database is currently being set up. This feature will be available shortly. Contact support if you need immediate access.
                    </span>
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {/* Input Form */}
            {!workflowId && !currentAnalysis && (
              <ContentInputForm onSubmit={handleSubmit} isSubmitting={false} />
            )}

            {/* Workflow Status */}
            {workflowId && (
              <WorkflowStatus workflowId={workflowId} />
            )}

            {/* Results */}
            {currentAnalysis && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Analysis Results</h2>
                  <Button onClick={handleNewAnalysis} variant="outline">
                    New Analysis
                  </Button>
                </div>
                <ScorecardResults scorecard={currentAnalysis} />
              </div>
            )}

            {/* Standards Display */}
            {standards && standards.length > 0 && (
              <StandardsDisplay standards={standards} />
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {recentAnalyses === undefined ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground py-8">
                    Loading recent analyses...
                  </div>
                </CardContent>
              </Card>
            ) : recentAnalyses.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground py-8">
                    No recent analyses. Start analyzing content to see your history here.
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Recent Analyses</h2>
                {recentAnalyses.map((analysis: any) => (
                  <Card key={analysis._id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {analysis.subject.toUpperCase()} - Grade {analysis.gradeLevel}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">
                            {analysis.scorecard?.overallScore || 0}%
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(analysis._creationTime).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {analysis.content.substring(0, 150)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCurrentAnalysis(analysis.scorecard);
                          setWorkflowId(null);
                        }}
                        className="w-full"
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AlignmentScorecard;

