import { useState, useEffect } from 'react'
import MediaTable from './components/MediaTable';
import UrlInput from './components/UrlInput';
import FilterBar from './components/FilterBar';
import { fetchMediaItems } from './utils/api';

function App() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadMedia = async () => {
    try {
      const res = await fetchMediaItems({ page, search, type });
      setMedia(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [page, search, type]);

  const handleRefresh = () => {
    loadMedia();
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8 text-primary">Media Scraper</h1>

      <div className="grid gap-8">
        <div>
          <FilterBar
            search={search} setSearch={setSearch}
            type={type} setType={setType}
            onRefresh={handleRefresh}
          />

          <MediaTable media={media} />

          <div className="join grid grid-cols-2 max-w-xs mx-auto mt-6">
            <button
              className="join-item btn btn-outline"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </button>
            <button
              className="join-item btn btn-outline"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
          <div className='text-center mt-2 text-sm text-gray-500'>
            Page {page} of {totalPages || 1}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
