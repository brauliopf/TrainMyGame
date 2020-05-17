import React, { useState } from 'react'
import axios from 'axios';

export default function MessageInput(props) {

  const [text, setText] = useState("");

  const sendMessage = async text => {
    const data = { text: text, targetType: "User", target: props.coach._id }
    await axios.post(`/api/v1/users/${props.coach._id}/messages`, data)
      .then(res => setText(""))
  }

  return (
    <div className="modal fade" id="MessageInput" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">DM to {props.coach.name}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <textarea className="form-control" id="messageTextBox" rows="3" onChange={e => { setText(e.target.value) }} value={text} />
            <div className="mt-2 text-right">
              <button type='button' className='btn btn-secondary' data-dismiss='modal' onClick={() => setText('')}>Cancel</button>
              <button type='button' className='ml-1 btn btn-primary' data-dismiss='modal' onClick={() => sendMessage(text)}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}