import React from 'react';

interface SearchResultProps {
  title: string;
  summary: string;
  link: string;
  location?: string;
  locationTitle?: string;
}

const SearchResult: React.FC<SearchResultProps> = ({
                                                     title,
                                                     summary,
                                                     link,
                                                     location,
                                                     locationTitle,
                                                   }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block mx-auto my-4 p-6 bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out w-full text-white"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>

        {location && locationTitle ? (
          <div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                location
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {locationTitle}
            </a>
          </div>
        ) : <div />}
      </div>
      <div className="mb-4 text-gray-100 font-medium text-sm">
        <p>{summary}</p>
      </div>
    </a>
  );
};

export default SearchResult;
