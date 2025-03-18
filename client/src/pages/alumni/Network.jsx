import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'lucide-react'; // Import the connection icon

const Network = () => {
    const [alumni, setAlumni] = useState([]); // State for alumni data
    const [students, setStudents] = useState([]); // State for students data
    const [loading, setLoading] = useState(true); // State for loading
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from localStorage
                if (!token) {
                    throw new Error('No token found. Please log in.');
                }

                // Fetch alumni data
                const alumniResponse = await axios.get('http://localhost:3000/api/alumni/all-alumni', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Fetch students data
                const studentsResponse = await axios.get('http://localhost:3000/api/student/all-students', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Log the responses for debugging
                console.log('Alumni Response:', alumniResponse.data);
                console.log('Students Response:', studentsResponse.data);

                // Set the fetched data to state
                setAlumni(alumniResponse.data.data); // Array of alumni data
                setStudents(studentsResponse.data.data); // Array of students data
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Network</h1>

            {/* Flex Container for Alumni and Students Sections */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Alumni Section */}
                <div className="flex-1 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Alumni</h2>
                    <div className="flex flex-col gap-4">
                        {alumni.map((alum, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {alum?.username?.charAt(0)?.toUpperCase() || 'A'} {/* Fallback to 'A' if username is missing */}
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-700">{alum?.username || 'Unknown Alumni'}</h3>
                                        <p className="text-sm text-gray-500">{alum?.bio || 'No bio available'}</p>
                                    </div>
                                </div>
                                <button
                                    className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                                    onClick={() => console.log(`Connect with ${alum?.username || 'Unknown Alumni'}`)}
                                >
                                    <Link className="w-5 h-5" /> {/* Connection Icon */}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Students Section */}
                <div className="flex-1 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Students</h2>
                    <div className="flex flex-col gap-4">
                        {students.map((student, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {student?.username?.charAt(0)?.toUpperCase() || 'S'} {/* Fallback to 'S' if username is missing */}
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-700">{student?.username || 'Unknown Student'}</h3>
                                        <p className="text-sm text-gray-500">{student?.bio || 'No bio available'}</p>
                                    </div>
                                </div>
                                <button
                                    className="p-2 text-gray-500 hover:text-green-500 transition-colors"
                                    onClick={() => console.log(`Connect with ${student?.username || 'Unknown Student'}`)}
                                >
                                    <Link className="w-5 h-5" /> {/* Connection Icon */}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Network;