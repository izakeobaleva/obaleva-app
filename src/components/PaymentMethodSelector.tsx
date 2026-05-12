import { CreditCard, Banknote, QrCode } from 'lucide-react';

interface PaymentMethodSelectorProps {
  value: 'dinheiro' | 'cartao' | 'pix';
  onChange: (method: 'dinheiro' | 'cartao' | 'pix') => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const methods = [
    { id: 'dinheiro', label: 'Dinheiro', icon: Banknote },
    { id: 'cartao', label: 'Cartão', icon: CreditCard },
    { id: 'pix', label: 'PIX', icon: QrCode },
  ] as const;

  return (
    <div className="flex gap-3">
      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => onChange(method.id)}
          className={`flex-1 py-3 rounded-lg border-2 transition-all min-h-[56px] ${
            value === method.id
              ? 'border-amarelo-oba bg-yellow-100 text-black'
              : 'border-gray-300 text-gray-600 hover:border-purple-300'
          } flex items-center justify-center gap-2`}
        >
          <method.icon size={20} />
          <span className="font-medium">{method.label}</span>
        </button>
      ))}
    </div>
  );
}