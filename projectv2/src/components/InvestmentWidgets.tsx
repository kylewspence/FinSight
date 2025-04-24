import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Settings, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const InvestmentWidgets = () => {
  return (
    <div className="space-y-4">
      {/* AI Insights */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Market Update</p>
                <p className="text-sm text-muted-foreground">
                  Tech sector showing strong growth potential. Consider rebalancing your portfolio.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Settings className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Portfolio Health</p>
                <p className="text-sm text-muted-foreground">
                  Your portfolio is well-diversified with a good balance of growth and stability.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
          <div className="space-y-2">
            <Button className="w-full" variant="outline" asChild>
              <Link to="/help-support">
                <HelpCircle className="mr-2 h-4 w-4" />
                Get Help
              </Link>
            </Button>
            <Button className="w-full" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentWidgets; 