import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, AlertCircle, TrendingUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface ScorecardData {
  overallScore: number;
  breakdown: Array<{
    standardCode?: string;
    standardText?: string;
    score: number;
    alignment?: "strong" | "moderate" | "weak" | "none";
    notes?: string;
  }>;
  gaps: string[];
  recommendations: string[];
}

interface ScorecardResultsProps {
  scorecard: ScorecardData;
}

export function ScorecardResults({ scorecard }: ScorecardResultsProps) {
  const { overallScore, breakdown, gaps, recommendations } = scorecard;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    if (score >= 40) return "outline";
    return "destructive";
  };

  const getAlignmentBadgeVariant = (alignment: string): "default" | "secondary" | "destructive" | "outline" => {
    if (alignment === "strong") return "default";
    if (alignment === "moderate") return "secondary";
    if (alignment === "weak") return "outline";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Alignment Scorecard
          </CardTitle>
          <CardDescription>
            Overall alignment score with Louisiana Student Standards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-2xl font-bold" style={{ color: `var(--color-${getScoreColor(overallScore).split('-')[1]})` }}>
                {overallScore}%
              </div>
              <p className="text-sm text-muted-foreground">Overall Alignment</p>
            </div>
            <Badge variant={getScoreBadgeVariant(overallScore)} className="text-lg px-4 py-2">
              {overallScore >= 80 ? "Strong" : overallScore >= 60 ? "Moderate" : overallScore >= 40 ? "Weak" : "Poor"}
            </Badge>
          </div>
          <Progress value={overallScore} className="h-3" />
        </CardContent>
      </Card>

      {/* Breakdown Table */}
      {breakdown && breakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Standards Breakdown</CardTitle>
            <CardDescription>
              Detailed alignment analysis for each standard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Standard</TableHead>
                  <TableHead>Alignment</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {breakdown.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {item.standardCode || `Standard ${index + 1}`}
                      {item.standardText && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {item.standardText}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getAlignmentBadgeVariant(item.alignment || "none")}>
                        {item.alignment ? item.alignment.charAt(0).toUpperCase() + item.alignment.slice(1) : "None"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={getScoreColor(item.score)}>{item.score}%</span>
                        <Progress value={item.score} className="h-2 w-20" />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.notes || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Gaps */}
      {gaps && gaps.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
              <AlertCircle className="h-5 w-5" />
              Alignment Gaps
            </CardTitle>
            <CardDescription>
              Areas where content does not align with standards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {gaps.map((gap, index) => (
                <li key={index} className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{gap}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              Recommendations
            </CardTitle>
            <CardDescription>
              Suggestions to improve alignment with Louisiana Standards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

