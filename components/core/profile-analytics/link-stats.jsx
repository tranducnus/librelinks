/* eslint-disable @next/next/no-img-element */
import { BarChart } from 'lucide-react';
import Loader from '@/components/utils/loading-spinner';
import { getApexDomain } from '@/utils/helpers';
import { GOOGLE_FAVICON_URL } from '@/utils/constants';
import { useState } from 'react';
import StarSVG from '@/components/utils/star-svg';
import Link from 'next/link';

const LinkStats = ({ linkData, isLoading }) => {
  const [showAll, setShowAll] = useState(false);

  // Access data array from linkData object if available, otherwise use empty array
  const linksArray = linkData?.data || [];

  // If linksArray is empty or not an array, we'll get an empty array to work with
  const sortedLinks = Array.isArray(linksArray)
    ? linksArray.sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    : [];

  // Limit displayed links based on showAll state
  const displayedLinks = showAll ? sortedLinks : sortedLinks.slice(0, 3);

  const handleShowMore = () => {
    setShowAll(true);
  };

  const handleShowLess = () => {
    setShowAll(false);
  };

  return (
    <>
      <div className="mt-10 w-full">
        <h3 className="text-xl font-semibold">Top performing links</h3>
        <div className="rounded-xl mt-4 border bg-white h-auto p-4">
          <div className="">
            <h3 className="font-semibold text-md px-3 pb-1">My Links</h3>
            <p className="text-gray-500 text-sm px-3 mb-2">Get useful insights on each link</p>
          </div>
          <div className="h-full w-full">
            {!isLoading ? (
              <>
                {displayedLinks?.length > 0 ? (
                  displayedLinks.map((link, index) => (
                    <div key={index} className="flex items-center p-2 rounded-lg">
                      <div className="h-8 w-8">
                        <img
                          src={`${GOOGLE_FAVICON_URL}${getApexDomain(link.url)}`}
                          alt={link.title}
                          className="h-8 w-8 blur-0 rounded-full sm:h-8 lg:w-8"
                          loading="lazy"
                        />
                      </div>
                      <div className="ml-4">
                        <p className="truncate w-[100px] text-md text-slate-900 font-medium leading-none md:w-auto lg:w-auto">
                          {link.title}
                        </p>
                      </div>
                      <div className="flex items-center ml-auto gap-2 font-medium">
                        <BarChart className="text-gray-500" size={17} />
                        <h4 className="text-md text-gray-500">{link.clicks || 0} clicks</h4>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col gap-2 w-[180px] mx-auto py-6">
                    <StarSVG />
                    <h2 className="text-center">
                      No links available{' '}
                      <span role="img" aria-label="face holding back tears">
                        🥹
                      </span>
                    </h2>
                  </div>
                )}
                {sortedLinks?.length > 3 && (
                  <div className="flex justify-center mt-2">
                    {showAll ? (
                      <button className="text-blue-500 font-medium" onClick={handleShowLess}>
                        Show Less
                      </button>
                    ) : (
                      <button className="text-blue-500 font-medium" onClick={handleShowMore}>
                        Show More
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Loader bgColor={'black'} textColor={'black'} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkStats;
