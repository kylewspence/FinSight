import { AIInsightPreview } from "./AIInsightPreview";

export function SpendingDesktop() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Spending Summary Cards */}
        // ... existing code ...
      </div>

      <AIInsightPreview 
        type="spending"
        insights={[
          {
            title: "Subscription Spending",
            description: "Monthly subscription costs increased by 25% compared to last month. Review recurring charges for potential savings.",
            impact: "high"
          },
          {
            title: "Dining Trends",
            description: "Food delivery expenses are 15% above your monthly average. Consider meal planning to reduce costs.",
            impact: "medium"
          },
          {
            title: "Utility Savings",
            description: "Energy costs are lower than previous months, showing your conservation efforts are working.",
            impact: "low"
          }
        ]}
      />

      {/* Spending Charts */}
      // ... existing code ...
    </div>
  );
} 