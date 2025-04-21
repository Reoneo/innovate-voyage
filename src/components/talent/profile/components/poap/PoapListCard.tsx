
import React from 'react';
import { Badge, Users, Copy, Star } from 'lucide-react';

interface PoapListCardProps {
  imageUrl: string;
  title: string;
  dropId: string | number;
  poapId: string | number;
  mintedBy: string;
  stats?: { count?: number; holders?: number; copies?: number };
  href?: string;
}

const PoapListCard: React.FC<PoapListCardProps> = ({
  imageUrl,
  title,
  dropId,
  poapId,
  mintedBy,
  stats = { count: 1, holders: 1, copies: 1 },
  href,
}) => {
  // Get the first 8 chars of the minter by default.
  const mintedByShort = mintedBy ? mintedBy.slice(0, 8) + '...' : '';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 w-full min-w-[325px] max-w-[430px] mx-auto border border-gray-100">
        {/* Left: POAP Image */}
        <div className="flex-shrink-0 flex items-center justify-center bg-[#f7f6fa] w-40 h-40 md:w-60 md:h-60">
          <img
            src={imageUrl}
            alt={title}
            className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full border-4 border-white shadow"
          />
        </div>
        {/* Right: Details */}
        <div className="flex flex-col flex-1 px-5 py-6 min-w-0">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 truncate">{title}</h3>
          <div className="flex space-x-8 mb-2">
            <div>
              <span className="font-semibold text-xs text-gray-500">DROP ID:</span>
              <span className="text-sm ml-2 text-gray-700">{dropId}</span>
            </div>
            <div>
              <span className="font-semibold text-xs text-gray-500">POAP ID:</span>
              <span className="text-sm ml-2 text-gray-700">{poapId}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 uppercase mb-3">
            MINTED BY: <span className="font-semibold text-gray-700">{mintedByShort}</span>
          </div>
          {/* Stats line */}
          <div className="flex items-center space-x-5 mt-auto">
            <div className="flex items-center text-gray-700 text-sm">
              <Badge className="w-[18px] h-[18px] mr-2 text-violet-500" strokeWidth={2} />
              {stats.count ?? 1}
            </div>
            <div className="flex items-center text-gray-700 text-sm">
              <Users className="w-[18px] h-[18px] mr-2 text-sky-500" strokeWidth={2} />
              {stats.holders ?? 1}
            </div>
            <div className="flex items-center text-gray-700 text-sm">
              <Copy className="w-[18px] h-[18px] mr-2 text-pink-400" strokeWidth={2} />
              {stats.copies ?? 1}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default PoapListCard;
