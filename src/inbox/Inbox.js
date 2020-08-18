import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../Contexts'
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import classnames from 'classnames'
import $ from 'jquery'
import MessageInput from './MessageInput'

const Inbox = () => {

  const { state, } = useContext(Context);
  const user = (state.auth.isAuthenticated && state.auth.user) || {}
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeChat, setActiveChat] = useState({});
  const history = useHistory();

  // *** Effect
  useEffect(() => {
    if (isEmpty(user)); //history.push('/')
    else {
      getChats()
        .then(data => setChats(data.data));
    }
  }, [state, history])


  useEffect(() => {
    !isEmpty(activeChat) && loadMessages(activeChat._id)
  }, [activeChat]);

  // *** Auxiliary
  const scrollToBottom = (id) => {
    const chatDiv = document.getElementById(id);
    chatDiv.scrollTop = chatDiv.scrollHeight;
  }

  const getChatUserName = chat => {
    if (isEmpty(chat)) return "Chat"
    const users = chat.users.filter(u => u._id !== state.auth.user._id).map(u => u.name)
    return users;
  }

  const isEmpty = obj => {
    return Object.keys(obj).length === 0;
  }

  const getChats = async () => {
    const res = await axios.get(`/api/v1/chats`)
    return res.data;
  };

  const getMessages = async (chatId) => {
    const res = await axios.get(`/api/v1/chats/${chatId}/messages`)
    return res.data
  };

  const loadMessages = chatId => {
    getMessages(chatId)
      .then(msgs => setMessages(msgs.data))
      .then(() => scrollToBottom("messages"))
      .catch(err => console.log(`Error loading chat messages: `, err))
  }

  // console.log("return", messages)
  return (
    <div id="coach" style={{marginTop: '10px'}}>
      <div className="row">
        <p className="col h3">Messages</p>
      </div>

      <div className="row" id="inbox">
        <div className="col" id="inboxMenu">

          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6 bg-light border">

              <div className="" id="chatListing">
                <nav className="navbar navbar-expand-sm d-block">
                  <div className="w-100 d-flex justify-content-between" onClick={() => {
                    if (window.innerWidth > 576) return;
                    $("#chatNavbar").collapse('toggle')
                  }
                  }>
                    <div className="navbar-brand">Chats</div>
                    {window.innerWidth < 576 &&
                      <div className="show" type="button" data-toggle="collapse" data-target="#chatNavbar">
                        <span className="navbar-toggler-icon"><i className="fas fa-caret-down fa-2x" /></span>
                      </div>
                    }
                  </div>

                  <div className="w-100">
                    <div className="collapse navbar-collapse" id="chatNavbar">
                      <ul className="navbar-nav d-flex flex-column">
                        {chats.map((chat) => {
                          return (
                            <li key={chat._id} className="nav-item"
                              style={{ "cursor": "pointer" }}
                              onClick={() => $("#chatNavbar").collapse('hide')}>
                              <div className="chat-users nav-link" onClick={() => setActiveChat(chat)}>
                                {getChatUserName(chat)}
                              </div>
                            </li>)
                        })}
                      </ul>
                    </div>
                  </div>
                </nav>
              </div>
            </div>

            <div className="col d-flex flex-column justify-content-between border" id="activeChat" style={
              { "height": window.innerWidth > 576 ? window.innerHeight - 150 : window.innerHeight - 200 }
            }>
              <div className="row bg-light h-100 overflow-auto" id="messages">
                {!isEmpty(messages) &&
                  <div className="w-100" id="messages">
                    <div className="">{messages.map(msg => (
                      <div key={msg._id} className={classnames('msg mx-5 my-4', { 'text-right': msg.sender.id === state.auth.user._id })}>
                        <div className="font-weight-bold">
                          {`${msg.sender.name}`}
                        </div>
                        <div className="mt-1">
                          <span className="p-2" style={{ background: "#FFF1A6" }}>{msg.text}</span>
                        </div>
                      </div>
                    ))}</div>
                  </div>
                }
              </div>
              {!isEmpty(activeChat) &&
                <div className="row bg-secondary pt-3" id="messageInput">
                  <MessageInput chat={activeChat} user={activeChat.users.filter(u => u._id !== state.auth.user._id).map(u => u)} successCallback={loadMessages} />
                </div>
              }
            </div>
          </div >
        </div >
      </div >
    </div >
  )
}

export default Inbox;