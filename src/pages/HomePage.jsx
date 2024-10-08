import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext'; 


const HomePage = () => { // Accept user prop
  const { user, logout } = useAuth();
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (jobTitle, location) => {
      try {
          const response = await fetch(`http://localhost:4000/api/jobs/search?title=${encodeURIComponent(jobTitle)}&location=${encodeURIComponent(location)}`, {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token if user needs to be authenticated
              },
          });
  
          const data = await response.json();
  
          if (response.ok) {
              console.log(data)
              setSearchResults(data.jobs); // Assuming the response contains a 'jobs' array
          } else {
              setSearchResults([]); // Clear search results if there's an error
              console.error(data.message); // Log error message for debugging
          }
      } catch (err) {
          console.error('Error fetching jobs:', err); // Log error message for debugging
          setSearchResults([]);
      }
  };
  

    return (
        <div className="bg-[#E9E9E9]">
            <SearchBar onSearch={handleSearch} />
            {user && ( // Conditionally render user greeting
                <div className="text-center mt-4">
                    <h2 className="text-lg font-bold">Welcome back, {user.name}!</h2>
                </div>
            )}
            <div className="max-w-7xl mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto">
                {searchResults.length > 0 ? (
                    searchResults.map(job => (
                        <div key={job._id} className="rounded-lg p-4 shadow-md border border-black">
                            <h3 className="font-bold text-lg">{job.title}</h3>
                            <p className="text-gray-600">{job.company}</p>
                            <p className="text-gray-500">{job.location}</p>
                            <p className="mt-2">{job.description}</p>
                            <button
                                className="text-black px-6 py-2 rounded-md ml-2 mt-4 hover:bg-white transition-all border border-black font-bold text-md"
                            >
                                View job details
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-black-300">No jobs found. Please adjust your search.</p>
                )}
            </div>
            <div className="text-center mt-10">
                <a 
                    href="/" 
                    className="mt-2 text-center text-[#2B2B2B]"
                >
                    Post your resume
                </a>
                <span className="text-[#B3B4BD]"> - It only takes a few seconds</span>
                
                <p className="mt-2">
                    <a 
                        href="/" 
                        className="mt-2 text-center text-[#2B2B2B]"
                    >
                        Post a job on HireHub
                    </a>
                </p>
                
                <p className="mt-2 text-sm text-[#B3B4BD]">
                    What's trending on HireHub
                </p>
            </div>
        </div>
    );
};

export default HomePage;
