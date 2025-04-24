import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, BookOpen } from 'lucide-react';

const HelpSupport = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">Help & Support</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Need help? Our support team is here to assist you.
            </p>
            <Button className="w-full">Send Message</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              FAQ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Find answers to common questions about using our platform.
            </p>
            <Button className="w-full" variant="outline">View FAQs</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Learn how to make the most of our features and tools.
            </p>
            <Button className="w-full" variant="outline">Read Docs</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpSupport; 