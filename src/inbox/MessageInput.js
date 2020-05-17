import React, { useState, useContext } from 'react'
import { Context } from '../Contexts'
import axios from 'axios';

const MessageInput = (props) => {

  const [text, setText] = useState('');
  const { state, } = useContext(Context);

  const sendMessage = async text => {
    if (text.length <= 0) return;
    const data = { text, targetType: props.chat.targetType, target: props.chat.users.filter(u => u._id !== state.auth.user._id)[0] }
    await axios.post(`/api/v1/users/${props.user._id}/messages`, data)
      .then(res => { props.successCallback(props.chat._id); setText("") });
  }

  return (
    <div className="col">
      <textarea className="form-control" id="messageTextBox" rows="3" onChange={e => { setText(e.target.value) }} value={text} />
      <div className="my-1 text-right">
        <button type='button' className='btn btn-secondary' data-dismiss='modal' onClick={() => setText('')}>Cancel</button>
        <button type='button' className='ml-1 btn btn-primary' data-dismiss='modal' onClick={() => sendMessage(text)}>Send</button>
      </div>
    </div>
  )
}

export default MessageInput