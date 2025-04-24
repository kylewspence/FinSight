import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TokenCounter = () => {
  const [tokenCount, setTokenCount] = useState(0);

  useEffect(() => {
    const handleApiCall = (event: CustomEvent) => {
      if (event.detail?.tokens) {
        setTokenCount(prev => prev + event.detail.tokens);
      }
    };

    window.addEventListener('apiCall', handleApiCall as EventListener);
    
    return () => {
      window.removeEventListener('apiCall', handleApiCall as EventListener);
    };
  }, []);

  return (
    <Card className="fixed top-4 right-4 z-50">
      <CardContent className="p-2">
        <div className="text-sm font-medium">
          Tokens Used: {tokenCount.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenCounter; 