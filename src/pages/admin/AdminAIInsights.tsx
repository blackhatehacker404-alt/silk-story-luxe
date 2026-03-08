import { useAdminAI } from "@/hooks/useAdminAI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AdminAIInsights() {
  const { loading, result, callAI } = useAdminAI();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Sales Insights
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Get AI-powered analysis of your sales data, trends, and recommendations
          </p>
        </div>
        <Button onClick={() => callAI("sales-insights")} disabled={loading}>
          {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {loading ? "Analyzing..." : "Generate Insights"}
        </Button>
      </div>

      {result ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analysis Report</CardTitle>
            <CardDescription>Based on your latest 100 orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      ) : !loading ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-medium text-lg">No insights generated yet</h3>
            <p className="text-muted-foreground text-sm mt-1">Click "Generate Insights" to analyze your sales data</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">AI is analyzing your data...</span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
