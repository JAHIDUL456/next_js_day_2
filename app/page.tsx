'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { GrView } from "react-icons/gr";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

// Types
type BlogPost = {
  id: number;
  title: string;
  content: string;
  status: string;
};

type Category = {
  id: number;
  title: string;
};

type DataType = BlogPost | Category;

export default function Home() {
  const [data, setData] = useState<DataType[]>([]);
  const [type, setType] = useState<'blog_posts' | 'categories' | ''>('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 10;

  const fetchData = async (endpoint: 'blog_posts' | 'categories') => {
    setLoading(true);
    setType(endpoint);
    setCurrentPage(1); // reset page on new fetch

    try {
      const response = await axios.get(`https://api.fake-rest.refine.dev/${endpoint}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const del = (id: number) => {
    setData(data.filter(item => item.id !== id));
  };

  const views = (text: string) => {
    alert(text);
  };

  // Pagination logic
  const totalPages = Math.ceil(data.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentData = data.slice(startIndex, startIndex + postsPerPage);

  const goToPrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className='bg-[#1D202A]'>
      <div className='text-white max-w-6xl mx-auto p-6 flex'>

        {/* Sidebar */}
        <div className='bg-gray-700 w-1/4 rounded-sm p-4 h-[30rem] sticky top-10'>
          <h1 className='text-2xl font-bold mb-6 text-center'>API Handling</h1>
          <div className='flex flex-col gap-2 items-center'>
            <button onClick={() => fetchData('blog_posts')} className='bg-white text-black font-semibold p-2 px-3 rounded-md mb-2'>Blog Post</button>
            <button onClick={() => fetchData('categories')} className='bg-white text-black font-semibold p-2 rounded-md'>Categories</button>
          </div>
        </div>

        {/* Table */}
        <div className='text-white w-full p-2 ml-5'>
          {data.length === 0 && !loading && (
            <p className='text-2xl font-bold text-center'>Press the button to view data</p>
          )}

          {loading && (
            <p className='text-2xl font-bold text-center'>Loading...</p>
          )}

          {!loading && currentData.length > 0 && (
            <>
              <table className='w-full table-auto border-2 border-gray-700'>
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-2">Id</th>
                    <th className="px-4 py-2 border-2">Title</th>
                    {type === 'blog_posts' && <th className="px-4 py-2 border-2">Content</th>}
                    {type === 'blog_posts' && <th className="px-4 py-2 border-2">Status</th>}
                    <th className="px-4 py-2 border-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((item, i) => (
                    <tr key={i}>
                      <td className='px-4 py-2 border-2'>{item.id}</td>
                      <td className='px-4 py-2 border-2'>{item.title}</td>
                      {type === 'blog_posts' && (
                        <>
                          <td className='px-4 py-2 border-2'>{(item as BlogPost).content}</td>
                          <td className='px-4 py-2 border-2'>{(item as BlogPost).status}</td>
                        </>
                      )}
                      <td className='px-4 py-2 border-2 flex gap-2 justify-center'>
                        <button onClick={() => views(type === 'blog_posts' ? (item as BlogPost).content : item.title)}><GrView /></button>
                        <button><FaRegEdit /></button>
                        <button onClick={() => del(item.id)}><MdOutlineDelete /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className='flex justify-center mt-4 gap-4'>
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Previous
                </button>
                <span className='text-xl font-semibold'>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
