import { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: number;
}

export function RatingStars({ value, onChange, readonly = false, size = 24 }: RatingStarsProps) {
  const [hover, setHover] = useState(0);

  const handleClick = (rating: number) => {
    if (!readonly && onChange) onChange(rating);
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`focus:outline-none ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          aria-label={`Avaliar ${star} estrelas`}
        >
          <Star
            size={size}
            fill={(hover || value) >= star ? '#F4D03F' : 'none'}
            stroke="#F4D03F"
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}