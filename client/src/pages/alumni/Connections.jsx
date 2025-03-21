import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Connections = () => {
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));

                const response = await axios.get('http://localhost:3000/api/connections/get-connections', {
                    params: {
                        userId: user.profileId,
                        userType: user.role,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setConnections(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchConnections();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Connections</h1>
            <div className="flex flex-col gap-4">
                {connections.map((connection) => (
                    <div key={connection._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
                        <div>
                            <h3 className="text-lg font-medium text-gray-700">
                                {connection.user1Id === user.profileId ? connection.user2Id : connection.user1Id}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {connection.user1Id === user.profileId ? connection.user2Type : connection.user1Type}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Connections;