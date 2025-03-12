import React, { useState } from "react";

const SearchBox = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === "") return;

    // Open ChatGPT search with query
    const encodedQuery = encodeURIComponent(query);
    window.open(`https://chat.openai.com/?q=${encodedQuery}`, "_blank");
  };

  return (
<div className="fixed z-50 flex justify-center items-center top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2">

      <form onSubmit={handleSearch} className="flex gap-2 w-96">
        <input
          type="text"

          placeholder="Ask ChatGPT..."
          required
          className="input w-full bg-white/10 backdrop-blur-lg shadow-lg p-4 border border-white/20 text-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="btn bg-white/10 backdrop-blur-lg shadow-lg p-4 border border-white/20 text-white"
        >
          🔍
        </button>
      </form>
    </div>
  );
};

export default SearchBox;
