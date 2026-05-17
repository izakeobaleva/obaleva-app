import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface PlaceholderScreenProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ icon: Icon, title, description, features }) => {
  return (
    <div className="max-w-md mx-auto px-4 pb-28 mt-8">
      <div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-white/10">
        <Icon size={48} className="text-[#F4D03F] mx-auto mb-4" />
        <h2 className="text-white text-xl font-bold">{title}</h2>
        <p className="text-gray-400 mt-2">{description}</p>
        <ul className="mt-4 space-y-1">
          {features.map((feature, idx) => (
            <li key={idx} className="text-gray-400 text-sm">• {feature}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};