import Link from 'next/link';
import RatingBadge from './RatingBadge';
import { getFlagEmoji } from '@/utils/flagEmoji';
import { CountryFlag } from './CountryFlag';

// const CountryFlag = ({ countryCode }: { countryCode: string }) => {
//   return <div style={{ fontSize: '2rem' }}>{getFlagEmoji(countryCode)}</div>;
// };

export default function ProjectCard({
  registry,
  project_id,
  project_type,
  name,
  vintage,
  // sdg,
  // image,
  score,
  country_code,
  status,
}: Project) {
  return (
    <Link href={`projects/${project_id}`}>
      <div className="flex p-3 gap-4 rounded-2xl shadow-sm text-sm text-center items-center justify-between hover:bg-slate-50 transition-all duration-100">
        <div className=" flex w-1/12 items-center justify-center">
          <RatingBadge score={score} />
        </div>
        <div className="w-1/3 text-left font-bold capitalize">
          <div className="">{name}</div>
          <div className=" font-extralight text-sm">{project_id}</div>
        </div>
        <div className="w-1/12 capitalize">{project_type}</div>
        <div className="w-1/12 capitalize">{registry}</div>
        <div className="w-1/12 text-left capitalize">{vintage}</div>
        <div className="w-1/12 flex justify-center items-center">
          <CountryFlag code={country_code || ''} />
        </div>
        {/* <div className="w-1/12 capitalize">{country_code}</div> */}
        <div className="w-1/12 uppercase">{status}</div>
        {/* <div className="w-1/12 text-left">{last_run_at}</div> */}
        {/* <hr className=" text-gray-300 mb-2" /> */}
      </div>
    </Link>
  );
}
