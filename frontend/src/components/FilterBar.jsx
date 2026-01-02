import React from 'react';

const FilterBar = ({ search, setSearch, type, setType, onRefresh }) => {
    return (
        <div className="navbar bg-base-100 rounded-box shadow-lg mb-4 gap-2 flex-wrap">
            <div className="flex-1">
                <div className="form-control w-full max-w-xs">
                    <input
                        type="text"
                        placeholder="Search URL..."
                        className="input input-bordered w-full md:w-auto"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-none gap-2">
                <select
                    className="select select-bordered"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="">All Types</option>
                    <option value="IMAGE">Images</option>
                    <option value="VIDEO">Videos</option>
                </select>
                <button className="btn btn-ghost btn-circle" onClick={onRefresh} title="Refresh">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
            </div>
        </div>
    );
};

export default FilterBar;
