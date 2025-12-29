import React from 'react';

const companies = [
  { name: 'Bloomberg', initial: 'B' },
  { name: 'Reuters', initial: 'R' },
  { name: 'Goldman Sachs', initial: 'GS' },
  { name: 'Morgan Stanley', initial: 'MS' },
  { name: 'JP Morgan', initial: 'JPM' },
  { name: 'Citadel', initial: 'C' },
];

const TrustedBy = () => {
  return (
    <div className="py-12 border-y border-border/30">
      <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-widest font-medium">
        Trusted by traders at leading institutions
      </p>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
        {companies.map((company) => (
          <div
            key={company.name}
            className="group flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-300"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border/50 group-hover:border-primary/50 transition-colors">
              <span className="font-display font-bold text-sm text-foreground">{company.initial}</span>
            </div>
            <span className="font-display font-medium text-foreground hidden md:block">{company.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustedBy;
