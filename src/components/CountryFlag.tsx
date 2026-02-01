import { COUNTRY_MAP } from '@/constants/countryMap';
import Flag from 'react-world-flags';

export function CountryFlag({ code }: { code: string }) {
  const title = COUNTRY_MAP[code] || code;

  return (
    <div className="relative group flex justify-center">
      <Flag code={code} style={{ width: 24, height: 16 }} aria-label={title} />

      <span
        className="
          absolute bottom-full mb-1
          hidden group-hover:block
          whitespace-nowrap
          rounded bg-black px-2 py-1
          text-xs text-white
        "
      >
        {title}
      </span>
    </div>
  );
}
