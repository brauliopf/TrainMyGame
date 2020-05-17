import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../Contexts'
import axios from 'axios'

const Chat = () => {

  const [messages, setMessages] = useState({});
  const [chat, setChat] = useState({});
  const history = useHistory();
  const { state, dispatch } = useContext(Context);

  const isEmpty = obj => {
    return Object.keys(obj).length === 0;
  }

  useEffect(() => {
    state.auth.isAuthenticated && loadChatMessages();
  }, [])

  const loadChatMessages = () => {
    if (isEmpty(chat)) return;
    await axios.get(`/api/v1/chats`).then(msgs => setMessages(msgs.data));
  }

  const getChatUserName = chat => {
    const users = chat.users.filter(u => u._id !== state.auth.user._id).map(u => u.name)
    return users;
  }

  return (
    <div className="row my-4" id='coach'>
      <span className="col h4">Messages</span>
      <button onClick={() => getChats().then(data => { setChats(data.data); })}>Load</button>

      {/* REMOVE THIS AT THE END */}
      <div className="w-100" />

      <div className="col-12 col-md-4 mb-2" id="inbox-listing">
        <ul className="list-group">
          {chats.map((chat) => {
            return (
              <li key={chat._id} className="list-group-item">
                <div className="chat-users"><i className="fas fa-cat" />
                  <button onClick={() => setActiveChat(chat)} data-toggle="collapse" data-target="#inboxNav"> {getChatUserName(chat)}</button>
                </div>
              </li>)
          }
          )}
        </ul>
      </div>
    </div>
  )
}

export default Inbox;