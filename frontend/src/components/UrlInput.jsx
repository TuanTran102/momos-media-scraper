import React, { useState } from 'react';

const UrlInput = ({ onScrape, loading }) => {
    const [urls, setUrls] = useState('');

    const handleSubmit = () => {
        onScrape(urls);
        setUrls('');
    };

    return (
        <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Add New URLs</h2>
                <textarea
                    className="textarea textarea-bordered h-24 w-full"
                    placeholder="Enter URLs (one per line) like: https://example.com"
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                ></textarea>
                <div className="card-actions justify-end">
                    <button
                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                        onClick={handleSubmit}
                        disabled={loading || !urls.trim()}
                    >
                        {loading ? 'Scraping...' : 'Start Scrape'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UrlInput;
