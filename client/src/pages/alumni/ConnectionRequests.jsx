import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';

const ConnectionRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));

                const response = await axios.get('http://localhost:3000/api/connections/get-requests', {
                    params: {
                        userId: user.profileId,
                        userType: user.role,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setRequests(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleAccept = async (requestId) => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.post('http://localhost:3000/api/connections/accept-request', {
                requestId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert(response.data.message);
            setRequests(requests.filter(request => request._id !== requestId));
        } catch (err) {
            alert(err.message || 'Error accepting request.');
        }
    };

    const handleReject = async (requestId) => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.delete(`http://localhost:3000/api/connections/reject-request/${requestId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert(response.data.message);
            setRequests(requests.filter(request => request._id !== requestId));
        } catch (err) {
            alert(err.message || 'Error rejecting request.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Connection Requests</h1>
            <div className="flex flex-col gap-4">
                {requests.map((request) => (
                    <div key={request._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
                        <div>
                            <h3 className="text-lg font-medium text-gray-700">{request.senderId}</h3>
                            <p className="text-sm text-gray-500">{request.senderType}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="p-2 text-green-500 hover:text-green-700"
                                onClick={() => handleAccept(request._id)}
                            >
                                <FaCheck className="w-5 h-5" />
                            </button>
                            <button
                                className="p-2 text-red-500 hover:text-red-700"
                                onClick={() => handleReject(request._id)}
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConnectionRequests;