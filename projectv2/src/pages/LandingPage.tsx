import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Smart Financial Tracker</h1>
        <nav className="space-x-4">
          <Button asChild variant="ghost">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/login">Sign In</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-8">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">
            Take control of your money.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Smart Financial Tracker uses AI to analyze your spending,
            investments, and taxes — all in one dashboard. Upload your
            statements, get insights, and make smarter financial decisions.
          </p>
        </div>
        <Button size="lg" asChild>
          <Link to="/signup">Get Started</Link>
        </Button>
      </main>

      <footer className="text-center text-sm text-muted-foreground py-6">
        {/* © {new Date().getFullYear()} Smart Financial Tracker. All rights
        reserved. */}
      </footer>
    </div>
  );
};

export default LandingPage;
