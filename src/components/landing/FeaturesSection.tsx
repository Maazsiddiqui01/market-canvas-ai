import { Brain, BarChart3, Briefcase, Bell, Eye, Settings } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Research',
    description: 'Ask natural language questions about any PSX stock and get instant, AI-generated analysis with real-time data.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Market Data',
    description: 'Live heatmaps, technical indicators, and financial analysis for 500+ stocks on the Pakistan Stock Exchange.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Briefcase,
    title: 'Portfolio Tracking',
    description: 'Track your holdings, monitor profit & loss, view sector breakdowns, and analyze performance history over time.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Bell,
    title: 'Smart Price Alerts',
    description: 'Set custom price targets and get notified instantly when your stocks hit key levels — never miss a trade.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Eye,
    title: 'Watchlist Management',
    description: 'Curate and monitor your favourite stocks with live prices, quick actions, and one-click analysis.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Settings,
    title: 'Data Export & Tools',
    description: 'Export portfolio data, search history, and analytics to CSV. Access utilities built for serious traders.',
    gradient: 'from-gray-500 to-slate-600',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 px-4 bg-background" id="features">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Trade Smarter
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From AI-driven insights to real-time alerts, Market Canvas AI gives you a professional trading edge on the Pakistan Stock Exchange.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.title}>
                <div
                  className="group relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 h-full"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
