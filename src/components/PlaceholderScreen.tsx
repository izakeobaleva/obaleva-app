import { Search, Menu, type LucideIcon } from 'lucide-react';

interface PlaceholderScreenProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

export function PlaceholderScreen({ icon: Icon, title, description, features }: PlaceholderScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-[#1A1528]/90 to-[#1A1528]/70 backdrop-blur-xl rounded-3xl p-8 text-center border border-[#F4D03F]/20">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4 animate-pulse">
            <Icon size={40} className="text-[#F4D03F]" />
          </div>
          <h2 className="text-white text-2xl font-bold">{title}</h2>
          <p className="text-[#A0A0B0] mt-2">{description}</p>
          <ul className="text-[#A0A0B0] text-sm mt-3 space-y-1">
            {features.map((feature, idx) => (
              <li key={idx}>• {feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}