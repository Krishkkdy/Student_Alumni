import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaCheck, FaTimes } from 'react-icons/fa';
import ConnectionRequests from './ConnectionRequests';
import Connections from './Connections';

const Network = () => {
    const [alumni, setAlumni] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [connections, setConnections] = useState([]);
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found. Please log in.');
                }

                const user = JSON.parse(localStorage.getItem('user'));

                // Fetch alumni and students
                const alumniResponse = await axios.get('http://localhost:3000/api/alumni/all-alumni', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const studentsResponse = await axios.get('http://localhost:3000/api/student/all-students', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Fetch connections and requests
                const connectionsResponse = await axios.get('http://localhost:3000/api/connections/get-connections', {
                    params: { userId: user.profileId, userType: user.role },
                    headers: { Authorization: `Bearer ${token}` },
                });

                const requestsResponse = await axios.get('http://localhost:3000/api/connections/get-requests', {
                    params: { userId: user.profileId, userType: user.role },
                    headers: { Authorization: `Bearer ${token}` },
                });

                setAlumni(alumniResponse.data.data);
                setStudents(studentsResponse.data.data);
                setConnections(connectionsResponse.data.data);
                setRequests(requestsResponse.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAlumniClick = (id) => {
        navigate(`/profile/alumni/${id}`);
    };

    const handleStudentClick = (id) => {
        navigate(`/profile/student/${id}`);
    };

    const handleConnect = async (receiverId, receiverType) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found. Please log in.');
            }

            const user = JSON.parse(localStorage.getItem('user'));
            const senderId = user.profileId;
            const senderType = user.role;

            const response = await axios.post(
                'http://localhost:3000/api/connections/send-request',
                { senderId, senderType, receiverId, receiverType },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert(response.data.message);
            // Refresh requests after sending a new one
            const requestsResponse = await axios.get('http://localhost:3000/api/connections/get-requests', {
                params: { userId: senderId, userType: senderType },
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(requestsResponse.data.data);
        } catch (err) {
            alert(err.message || 'Error sending request.');
        }
    };

    const getConnectionStatus = (userId, userType) => {
        // Check if already connected
        const isConnected = connections.some(
            (conn) =>
                (conn.user1Id === userId && conn.user1Type === userType) ||
                (conn.user2Id === userId && conn.user2Type === userType)
        );
        if (isConnected) return 'Connected';

        // Check if a request is pending
        const isPending = requests.some(
            (req) =>
                (req.senderId === userId && req.senderType === userType) ||
                (req.receiverId === userId && req.receiverType === userType)
        );
        if (isPending) return 'Pending';

        return 'Connect';
    };

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
         {/* <ConnectionRequests/>
            <Connections/> */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Alumni Section */}
                <div className="flex-1 bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-[80vh] overflow-y-scroll">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Alumni</h2>
                    <div className="flex flex-col gap-4">
                        {alumni.map((alum) => (
                            <div
                                key={alum._id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {alum?.username?.charAt(0)?.toUpperCase() || 'A'}
                                    </div>
                                    <div className="ml-4">
                                        <h3
                                            className="text-lg font-medium text-gray-700 cursor-pointer hover:text-blue-500"
                                            onClick={() => handleAlumniClick(alum._id)}
                                        >
                                            {alum?.username || 'Unknown Alumni'}
                                        </h3>
                                        <p className="text-sm text-gray-500">{alum?.bio || 'No bio available'}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {alum?.skills?.map((skill, skillIndex) => (
                                                <span
                                                    key={skillIndex}
                                                    className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {alum?.interests?.map((interest, interestIndex) => (
                                                <span
                                                    key={interestIndex}
                                                    className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full"
                                                >
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className={`p-2 ${
                                        getConnectionStatus(alum._id, 'Alumni') === 'Connected'
                                            ? 'text-green-500'
                                            : getConnectionStatus(alum._id, 'Alumni') === 'Pending'
                                            ? 'text-yellow-500'
                                            : 'text-gray-500 hover:text-blue-500'
                                    } transition-colors`}
                                    onClick={() => handleConnect(alum._id, 'Alumni')}
                                    disabled={getConnectionStatus(alum._id, 'Alumni') !== 'Connect'}
                                >
                                    {getConnectionStatus(alum._id, 'Alumni') === 'Connected' ? (
                                        <FaCheck className="w-5 h-5" />
                                    ) : getConnectionStatus(alum._id, 'Alumni') === 'Pending' ? (
                                        <FaTimes className="w-5 h-5" />
                                    ) : (
                                        <FaUserPlus className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Students Section */}
                <div className="flex-1 bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-[80vh] overflow-y-scroll">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Students</h2>
                    <div className="flex flex-col gap-4">
                        {students.map((student) => (
                            <div
                                key={student._id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {student?.username?.charAt(0)?.toUpperCase() || 'S'}
                                    </div>
                                    <div className="ml-4">
                                        <h3
                                            className="text-lg font-medium text-gray-700 cursor-pointer hover:text-green-500"
                                            onClick={() => handleStudentClick(student._id)}
                                        >
                                            {student?.username || 'Unknown Student'}
                                        </h3>
                                        <p className="text-sm text-gray-500">{student?.bio || 'No bio available'}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {student?.skills?.map((skill, skillIndex) => (
                                                <span
                                                    key={skillIndex}
                                                    className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {student?.interests?.map((interest, interestIndex) => (
                                                <span
                                                    key={interestIndex}
                                                    className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full"
                                                >
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className={`p-2 ${
                                        getConnectionStatus(student._id, 'Student') === 'Connected'
                                            ? 'text-green-500'
                                            : getConnectionStatus(student._id, 'Student') === 'Pending'
                                            ? 'text-yellow-500'
                                            : 'text-gray-500 hover:text-green-500'
                                    } transition-colors`}
                                    onClick={() => handleConnect(student._id, 'Student')}
                                    disabled={getConnectionStatus(student._id, 'Student') !== 'Connect'}
                                >
                                    {getConnectionStatus(student._id, 'Student') === 'Connected' ? (
                                        <FaCheck className="w-5 h-5" />
                                    ) : getConnectionStatus(student._id, 'Student') === 'Pending' ? (
                                        <FaTimes className="w-5 h-5" />
                                    ) : (
                                        <FaUserPlus className="w-5 h-5" />
                                    )}
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