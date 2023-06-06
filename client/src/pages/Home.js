import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import ProfileList from '../components/ProfileList';

import { QUERY_PROFILES } from '../utils/queries';

const Home = () => {
  const { loading, data } = useQuery(QUERY_PROFILES);
  const profiles = data?.profiles || [];

  const [message, setMessage] = useState('');
  const [messagesReceived, setMessagesReceived] = useState([]);

  const socket = io('http://localhost:3001'); // Replace with your server URL

  const sendMessage = () => {
    socket.emit('message_from_client', message);
    setMessage('');
  };

  useEffect(() => {
    socket.on('message_from_server', (data) => {
      setMessagesReceived(data);
    });
  }, [socket]);

  return (
    <main>
      <div className="flex-row justify-center text-center">
        <div className="col-12 col-md-10 my-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            // <ProfileList
            //   profiles={profiles}
            //   title="Here's the current roster of friends..."
            // />
            <>
              <input className='text-center border-2 mr-2'
                placeholder="Message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className='bg-gradient-to-r from-cyan-300 text- to-zinc-600 text-white px-4 py-2 mr-5 border-none rounded-md ml-12 hover:animate-pulse' onClick={sendMessage}>Send Message</button>
              <div>
                {messagesReceived}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
