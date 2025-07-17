import React, { useState } from 'react';
import { MessageSquare, Send, Lightbulb, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const FeedbackSection = () => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://n8n-maaz.duckdns.org/webhook-test/Get-Feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedback: feedback.trim(),
          timestamp: new Date().toISOString(),
          source: 'Market Canvas AI',
          url: window.location.href
        }),
      });

      if (response.ok) {
        toast({
          title: "Thank you for your feedback!",
          description: "We'll use your suggestions to make Market Canvas AI even better.",
        });
        setFeedback('');
      } else {
        throw new Error('Failed to send feedback');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast({
        title: "Error sending feedback",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestions = [
    "Portfolio tracking features",
    "More advanced technical indicators", 
    "Real-time alerts and notifications",
    "Mobile app version",
    "Cryptocurrency analysis",
    "International markets (NASDAQ, NYSE)"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setFeedback(prev => prev ? `${prev}, ${suggestion}` : suggestion);
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Help Us Improve</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your feedback shapes the future of Market Canvas AI. What features would you like to see next?
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Feedback Form */}
            <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Share Your Ideas
                </CardTitle>
                <CardDescription>
                  Tell us what features or improvements you'd love to see
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Textarea
                    placeholder="I would love to see... (e.g., portfolio tracking, crypto analysis, mobile alerts)"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[120px] resize-none border-primary/20 focus:border-primary/40"
                  />
                  <Button 
                    type="submit" 
                    disabled={!feedback.trim() || isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    <Send className={`h-4 w-4 mr-2 ${isSubmitting ? 'animate-pulse' : ''}`} />
                    {isSubmitting ? 'Sending...' : 'Send Feedback'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Suggestions */}
            <Card className="border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent" />
                  Popular Requests
                </CardTitle>
                <CardDescription>
                  Click on any suggestion to add it to your feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="justify-start text-left h-auto py-3 px-4 border-muted hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full opacity-60"></div>
                        <span>{suggestion}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-card/50 border border-border rounded-xl p-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Building the Future Together
              </h3>
              <p className="text-muted-foreground">
                Every suggestion helps us create a better trading experience. 
                Join our community of traders shaping the next generation of market analysis tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection;