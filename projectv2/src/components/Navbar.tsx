import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export function Navbar() {
  return (
    <header className="w-full px-6 py-4 border-b border-border bg-background flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-background p-4 border-r border-border">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Menu</h2>
            <nav className="space-y-2">
              <Link
                to="/dashboard"
                className="block text-sm text-muted-foreground hover:text-foreground hover:underline">
                Dashboard
              </Link>
              <Link
                to="/ai-insights"
                className="block text-sm text-muted-foreground hover:text-foreground hover:underline">
                AI Insights
              </Link>
              <Link
                to="/settings"
                className="block text-sm text-muted-foreground hover:text-foreground hover:underline">
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <img
          src="/logo-finsight.png"
          alt="FinSight"
          className="h-14 w-auto"
        />
      </div>
      <nav className="space-x-4 text-sm">
        <Link to="/dashboard" className="text-muted-foreground hover:text-foreground hover:underline">
          Dashboard
        </Link>
        <Link to="/ai-insights" className="text-muted-foreground hover:text-foreground hover:underline">
          AI Insights
        </Link>
        <Link to="/settings" className="text-muted-foreground hover:text-foreground hover:underline">
          Settings
        </Link>
      </nav>
    </header>
  );
} 