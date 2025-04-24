import { AIInsightPreview } from "./AIInsightPreview";

export function TransactionsDesktop() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Transaction Summary Cards */}
        // ... existing code ...
      </div>

      <AIInsightPreview 
        type="spending"
        insights={[
          {
            title: "Unusual Activity",
            description: "Detected a large transaction of $500 at Electronics Store. This is 3x your typical spending in this category.",
            impact: "high"
          },
          {
            title: "Duplicate Charge",
            description: "Possible duplicate charge detected from Streaming Service on March 15th and 16th.",
            impact: "medium"
          },
          {
            title: "Recurring Payment Change",
            description: "Your monthly phone bill increased by $10 compared to previous months.",
            impact: "low"
          }
        ]}
      />

      {/* Transactions Table */}
      // ... existing code ...
    </div>
  );
} 