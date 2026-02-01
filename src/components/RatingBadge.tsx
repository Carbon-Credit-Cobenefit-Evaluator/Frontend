export default function RatingBadge({ score }: RatingBadgeProps) {
  function getRatingStyle(rating?: number) {
    if (rating && rating >= 80) {
      return {
        bg: 'bg-emerald-500',
        text: 'text-white',
        rating: 'A',
      };
    }

    if (rating && rating >= 60) {
      return {
        bg: 'bg-lime-400',
        text: 'text-slate-900',
        rating: 'B',
      };
    }

    if (rating && rating >= 40) {
      return {
        bg: 'bg-orange-400',
        text: 'text-slate-900',
        rating: 'C',
      };
    }

    return {
      bg: 'bg-red-500',
      text: 'text-white',
      rating: 'D',
    };
  }

  const { bg, text, rating } = getRatingStyle(score);

  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-full ${bg}`}
    >
      <span className={`text-lg font-bold ${text}`}>{rating}</span>
    </div>
  );
}
