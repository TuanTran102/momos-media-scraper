import React from 'react';

const MediaTable = ({ media }) => {
    return (
        <div className="overflow-x-auto bg-base-100 rounded-box shadow-xl">
            <table className="table table-zebra w-full">

                <thead>
                    <tr>
                        <th>Preview</th>
                        <th>Type</th>
                        <th>URL</th>
                        <th>Source</th>
                    </tr>
                </thead>
                <tbody>
                    {media.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <div className="avatar">
                                    <div className="mask mask-squircle w-24 h-24">
                                        {item.type === 'VIDEO' ? (
                                            <video src={item.url} controls className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={item.url} alt="Media" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className={`badge ${item.type === 'VIDEO' ? 'badge-secondary' : 'badge-primary'} badge-outline`}>
                                    {item.type}
                                </div>
                            </td>
                            <td className="max-w-xs truncate">
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="link link-hover text-sm">
                                    {item.url}
                                </a>
                            </td>
                            <td className="max-w-xs truncate">
                                <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xs">
                                    View Source
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {media.length === 0 && (
                <div className="text-center p-10 text-gray-500">
                    No media found. Try scraping some URLs!
                </div>
            )}
        </div>
    );
};

export default MediaTable;
