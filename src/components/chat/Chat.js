import React, { useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../helpers/AuthContext';
import {FaComment, FaComments, FaChevronDown} from 'react-icons/fa';
import {toast} from 'react-toastify';
import './style.css';

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API}/users/`,
})

function Chat(props) {
    const {authState} = useContext(AuthContext);
    const username = useRef(null);
    const roomId = props.roomId;
    const photo = useRef(null);

    const diffToast = (msg) => {
        toast(msg);
    }
    const send_msg = e =>{
        e.preventDefault();
        // Get message
        const msg = e.target.elements.msg.value;
        const user = username.current;
        const photoUrl = photo.current;
        outputMessage({user: '___me___' , msg: e.target.elements.msg.value, photo: photo.current});

        // Emit message to server
        authState.socket.emit('chatMessage', {roomId, msg, user, photoUrl});
        e.target.elements.msg.value = '';
        e.target.elements.msg.focus();
    }

    // data = {user: , msg: }
    const outputMessage = (data) => {
        if(data.user === '___me___'){
            const div = document.createElement('div');
            const div1 = document.createElement('div');
            const p = document.createElement('p');
            const img = document.createElement('img');
            div.classList.add('message-box');
            div1.classList.add('user-photo');
            p.classList.add('message');
            p.innerHTML = `<span class='username'>${username.current}</span>${data.msg}`;
            img.src = data.photo;
            div1.appendChild(img);
            div.appendChild(div1);
            div.appendChild(p);
            const chatMessage = document.querySelector('.chat-box-message');
            chatMessage.appendChild(div);
            chatMessage.scrollTop = chatMessage.scrollHeight;
        }
        else {
            const div = document.createElement('div');
            const div1 = document.createElement('div');
            const p = document.createElement('p');
            const img = document.createElement('img');
            div.classList.add('message-box','user_message');
            div1.classList.add('user-photo');
            p.classList.add('message');
            p.innerHTML = `<span class='username'>${data.user}</span>${data.msg}`;
            img.src = data.photo;
            div1.appendChild(img);
            div.appendChild(div1);
            div.appendChild(p);
            const chatMessage = document.querySelector('.chat-box-message');
            chatMessage.appendChild(div);
            chatMessage.scrollTop = chatMessage.scrollHeight;
        }
    }

    const hideMessage = (e) => {
        const chatbox = document.getElementsByClassName('chat-box');
        chatbox[0].classList.remove('hidden');
    }
    const showMessage = (e) => {
        const chatbox = document.getElementsByClassName('chat-box');
        chatbox[0].classList.add('hidden');
    }

    useEffect(() => {
        // get username
        if(localStorage.getItem('accessToken')){
            api.get('auth', {
                headers: {accessToken: localStorage.getItem('accessToken')}
                }).then((res) => {
                username.current = res.data.username;
            });

            api.get('photo', {
                headers: { accessToken: localStorage.getItem("accessToken")},
                }).then(res => {
                    if(res.data.error) diffToast(res.data.error);
                    else {
                        photo.current = res.data.photo;
                }
            })
        }
        
        

        authState.socket.on('message', data => {
            outputMessage(data);
        });        
      },[]);

    return (
        <div id='chat-container'>
            
            <button id='show-chat' onClick={hideMessage}>
                <span className='toggleMessage'><FaComment/></span>
            </button>
            <div className='chat-box hidden'>
                <div className='chat-box-header'>
                    <button className='close'><span><FaComments/></span></button>
                    <span onClick={showMessage}><FaChevronDown/></span>
                </div>
                <div className='chat-box-message'>
                    {/* <div className='message-box '>
                        <div className='user-photo'><img src={user}></img></div>
                        <p className='message'><span className='username'>Thanh vi</span>Hello</p>
                    </div>
                    <div className='message-box user_message'>
                        <div className='user-photo'><img src={user}></img></div>
                        <p className='message'><span className='username'>Thanh vi</span>Hi</p>
                    </div> */}
                </div>
                <div className='chat-box-footer'>
                    <form onSubmit={send_msg}>
                        <input type='text' id='msg' placeholder='Write a message'>
                            
                        </input>
                        <button type='submit'>Send</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Chat
