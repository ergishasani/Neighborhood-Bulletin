// src/pages/SearchResults.jsx

import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getPosts } from "../../firebase/firestore";
import PostCard from "../../components/PostCard";
import Loader from "../../components/Loader";
import "../../styles/pages/_search.scss";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Pull the "q" param and keep a controlled input for refinement
  const initialQuery = searchParams.get("q")?.trim() || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update document title on query change
  useEffect(() => {
    document.title = initialQuery
        ? `Search: ${initialQuery}`
        : "Search Posts";
  }, [initialQuery]);

  // Fetch & filter whenever the URL query changes
  useEffect(() => {
    const fetchAndFilter = async () => {
      if (!initialQuery) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { success, data, error: fetchError } = await getPosts();
        if (!success) throw new Error(fetchError);

        const q = initialQuery.toLowerCase();
        const filtered = data.filter((post) =>
            (post.title || "").toLowerCase().includes(q) ||
            (post.content || "").toLowerCase().includes(q)
        );

        setResults(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilter();
  }, [initialQuery]);

  // Handler for the inline search form
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      setSearchParams({ q: trimmed });
    } else {
      setSearchParams({});
      navigate("/search");
    }
  };

  // Render states
  if (loading) return <Loader />;

  return (
      <div className="search-results">
        <div className="container">

          {/* Inline search form */}
          <form onSubmit={handleSearch} className="search-form">
            <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          {/* Empty‐query prompt */}
          {!initialQuery && (
              <div className="no-query">
                <p>Enter a keyword above to search posts.</p>
              </div>
          )}

          {/* Error state */}
          {error && (
              <div className="error-message">
                <p>Oops, something went wrong: {error}</p>
              </div>
          )}

          {/* Results */}
          {initialQuery && !error && (
              <>
                <h1>
                  {results.length} result{results.length !== 1 && "s"} for “{initialQuery}”
                </h1>

                {results.length > 0 ? (
                    <div className="posts-grid">
                      {results.map((post) => (
                          <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                ) : (
                    <div className="no-results">
                      <p>No posts match your search. Try another term.</p>
                    </div>
                )}
              </>
          )}
        </div>
      </div>
  );
}
