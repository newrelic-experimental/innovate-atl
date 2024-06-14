"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchResult from "@/app/components/SearchResult";

const translations = [
  "Buscar en cualquier idioma...", "Rechercher dans n'importe quelle langue...", "Suche in jeder Sprache...", "Cercare in qualsiasi lingua...", "Buscar en cualquier idioma...",
  "検索する任意の言語で...", "任意の语言搜索...", "Любой язык поиска...", "Buscar em qualquer idioma...", "Hae millä tahansa kielellä...",
  "Tìm kiếm bằng bất kỳ ngôn ngữ nào...", "Buscar en qualsevol idioma...", "Sök på vilket språk som helst...", "Поиск на любом языке...", "Αναζήτηση σε οποιαδήποτε γλώσσα...",
  "Buscar em qualquer idioma...", "Procurar em qualquer idioma...", "Søk på et hvilket som helst språk...", "Chercher dans n'importe quelle langue...", "Søg på ethvert sprog...",
  "Arama herhangi bir dilde...", "검색하다 어느 언어...", "Tìm kiếm bất kỳ ngôn ngữ...", "Suche in irgendeiner Sprache...", "Búsqueda en cualquier idioma...",
  "Søk i hvilket som helst språk...", "Rechercher dans toute langue...", "Hae missä tahansa kielessä...", "Buscar en cualquier idioma...", "Поиск на любой языке...",
  "Búsqueda en cualquier idioma...", "Rechercher dans n'importe quel langage...", "Căutați în orice limbă...", "Поиск на любом языке...", "Suche in jeder Sprache...",
  "Chercher dans toute langue...", "Buscar en cualquier idioma...", "任意の言語で検索する...", "Cari dalam mana-mana bahasa...", "Rechercher dans toute langue...",
  "Поиск на любой языке...", "Buscar em qualquer idioma...", "Buscar en cualquier idioma...", "Buscar en cualquier idioma...", "任意の语言で搜索...",
  "任意の言語で検索する...", "任意の言語で検索する...", "Chercher dans toute langue...", "任意の言語で検索する...", "Chercher dans n'importe quelle langue..."
];

const SearchBox: React.FC = () => {
  const [placeholder, setPlaceholder] = useState("Search in any language...");
  const [counter, setCounter] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [buttonLabel, setButtonLabel] = useState("Search");
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prevCounter => {
        const newCounter = prevCounter + 1;
        if (newCounter % 3 === 0) {
          setPlaceholder("Search in any language...");
        } else {
          const randomIndex = Math.floor(Math.random() * translations.length);
          setPlaceholder(translations[randomIndex]);
        }
        return newCounter;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const detectLanguageAndTranslate = async (text: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/detect', { text });
      const translatedText = response.data.translatedText;
      setButtonLabel(translatedText);
    } catch (error) {
      console.error('Error detecting language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(setTimeout(() => {
      detectLanguageAndTranslate(e.target.value);
    }, 600));
  };

  const handleButtonClick = () => {
    alert("Search - " + searchValue);
    setCollapsed(true);
  };

  return (
    <>
      <div className={`flex items-center justify-center ${!collapsed ? 'h-[500px]' : 'h-[100px]'} w-screen bg-[url('/atl_background.png')] transition-all duration-500 ease-in-out`}>
        <div className="w-full p-6 bg-white bg-opacity-20 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg flex flex-row items-center justify-center gap-4">
          <input
            value={searchValue}
            onChange={(e) => handleInputChange(e)}
            type="text"
            className="w-[500px] px-4 py-3 text-lg text-gray-700 placeholder-gray-500 bg-white bg-opacity-90 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={placeholder}
          />
          <div className="relative">
            <button
              onClick={handleButtonClick}
              className="px-4 py-3 text-lg text-white bg-purple-600 rounded-full shadow-lg capitalize"
            >
              {buttonLabel}
            </button>
            {isLoading && (
              <div className="absolute inset-0 rounded-full border-4 animate-pulse-border pointer-events-none"></div>
            )}
          </div>
        </div>
      </div>
      {collapsed && (
        <>
          <SearchResult
            title="Sample Title"
            summary="This is a summary of the search result. It provides a brief description of the content.  Lorem ipset nonsense but this needs to be a lot longer and I don't wanna go find that thing."
            link="https://example.com"
            location="1600 Amphitheatre Parkway, Mountain View, CA"
            locationTitle="Google Headquarters"
          />
          <SearchResult
            title="Another Title"
            summary="Here is another summary of a different search result."
            link="https://anotherexample.com"
          />
          <SearchResult
            title="Sample Title"
            summary="This is a summary of the search result. It provides a brief description of the content.  This is a summary of the search result. It provides a brief description of the content.  This is a summary of the search result. It provides a brief description of the content.  This is a summary of the search result. It provides a brief description of the content."
            link="https://example.com"
            location="1600 Amphitheatre Parkway, Mountain View, CA"
            locationTitle="See Park on Google Maps"
          />
          <SearchResult
            title="Another Title"
            summary="Here is another summary of a different search result."
            link="https://anotherexample.com"
          />
        </>
      )}
    </>
  );
}

export default SearchBox;
