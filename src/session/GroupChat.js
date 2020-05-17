import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../Contexts';
import { useParams } from "react-router";
import axios from 'axios'
import classnames from 'classnames';

const GroupChat = (props) => {

  const { state, dispatch } = useContext(Context);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const { id } = useParams();

  // Effect
  useEffect(() => {
    getMessages(props.chat)
      .then(msgs => setMessages(msgs))
      .then(() => scrollToBottom("chat"))
      .catch(err => console.log(`Error loading chat messages: `, err))
  }, [props.chat])

  // Auxiliary
  const onClickSend = async () => {
    sendMessage(text, { 'targetType': 'Session', target: id })
      .then(success => {
        if (success) {
          loadMessages();
          setText("");
        }
      })
  }

  const loadMessages = async () => {
    getMessages(props.chat)
      .then(msgs => setMessages(msgs))
      .then(() => scrollToBottom("chat"))
  }

  const scrollToBottom = (id) => {
    const chatDiv = document.getElementById(id);
    chatDiv.scrollTop = chatDiv.scrollHeight;
  }

  const sendMessage = async (text, target) => { // text, { targetType, [user, session] }
    if (!state.auth.isAuthenticated) { dispatch({ type: 'MODAL_ON', component: 'authModal' }); return false; }
    const res = await axios.post(`/api/v1/sessions/${target.id}/messages`, { text, ...target })
    return res.data.message;
  };

  const getMessages = async (chatId) => {
    const res = await axios.get(`/api/v1/chats/${chatId}/messages`)
    return res.data;
  };

  return (
    <div id="group_chat" className="card card-body mt-2">
      <strong>Public comments</strong><hr />
      <div className="mt-4 overflow-auto" style={{ minHeight: '300px' }} id="chat">
        {messages.data && messages.data.length > 0 &&
          messages.data.map(msg => (
            <div key={msg._id} className={classnames('msg my-4', { 'text-right': state.auth.isAuthenticated && msg.sender.id === state.auth.user._id })}>
              <div className="font-weight-bold">
                {`${msg.sender.name}`}
              </div>
              <div className="mt-1">
                <span className="p-2" style={{ background: "#FFF1A6" }}>{msg.text}</span>
              </div>
            </div>
          ))}
      </div>
      <div>
        <textarea className="form-control" id="messageTextBox" rows="3" onChange={e => { setText(e.target.value) }} value={text} />
        <div className="mt-2 text-right">
          <button
            onClick={() => { onClickSend() }}
            type='button' className='ml-1 btn btn-primary'> Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default GroupChat