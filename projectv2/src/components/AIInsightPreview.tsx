import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Insight {
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
}

interface AIInsightPreviewProps {
  type: "investment" | "spending";
  insights: Insight[];
}

export function AIInsightPreview({ type, insights }: AIInsightPreviewProps) {
  const getImpactColor = (impact: Insight["impact"]) => {
    switch (impact) {
      case "low":
        return "text-blue-500";
      case "medium":
        return "text-yellow-500";
      case "high":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getImpactIcon = (impact: Insight["impact"]) => {
    switch (impact) {
      case "low":
        return <Info className={cn("h-5 w-5", getImpactColor(impact))} />;
      case "medium":
        return <TrendingUp className={cn("h-5 w-5", getImpactColor(impact))} />;
      case "high":
        return <AlertTriangle className={cn("h-5 w-5", getImpactColor(impact))} />;
      default:
        return null;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          AI {type === "investment" ? "Investment" : "Spending"} Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 rounded-lg border p-4"
            >
              <div className="mt-1">{getImpactIcon(insight.impact)}</div>
              <div>
                <h4 className="font-medium">{insight.title}</h4>
                <p className="text-sm text-gray-500">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 