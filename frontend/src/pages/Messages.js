import React, { useState, useEffect }from 'react';

//Services
import Api from '../services/api'
import Crypto from '../services/crypto'
//Components
// import MessageItem from '../components/MessageItem';

//Assets
import Avatar from '../assets/images/avatar.svg';
import '../assets/css/message/main.css'
import Send from '../assets/images/icons/send.svg' 
import Menu from '../assets/images/icons/menu.svg' 
import Close from '../assets/images/icons/close.svg' 

export default function Messages({match}){
    const [viewportWidth, setViewportWidth] = useState();
    const [usersList, setUsersList] = useState([]);
    const [messagesList, setMessagesList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [chatActive, setChatActive] = useState((match.params.id) ? match.params.id : 0);
    const [messageSend, setMessageSend] = useState('');
    const [showChatListing, setShowChatListing] = useState(false);
    const [userDestinatary, setUserDestinatary] = useState('');

    useEffect(() => {
        async function loadMessagesList(){
            const response = await Api.get('/messages/' + ((match.params.id) ? match.params.id : 0), {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                }
            })
            
            if(response.data.length || match.params.id){
                let messages = [...response.data.message].map((item) => {
                    // return {user_destinatary: item._id, message: (item.message) ? Crypto.decrypt(item.message.message) : ''};
                    return {user_destinatary: item._id};
                })
                setMessagesList([...messages])
            }
            setUsersList([...response.data.users])
        }
        loadMessagesList();
        setScrollMessageContent();
    }, []);

    useEffect(() => {
        async function loadMessages(){
            const response = await Api.get(`/list-messages/${chatActive}` , {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                }
            })
            
            let messages = [...response.data.messages].map((item) => {
                return {user: item.user_send, message: (item.message) ? Crypto.decrypt(item.message) : ''};
            })
            setMessages([...messages])
            setUserDestinatary(response.data.name)
            setScrollMessageContent();
        }
        if(chatActive){
            loadMessages();
        }
    }, [chatActive]);
    
    useEffect(() => {
        setViewportWidth(window.innerWidth)
    }, [window.innerWidth]);
    

    function setScrollMessageContent(){
        const messageContent = document.getElementById("message-content");
        messageContent.scroll(0, messageContent.scrollHeight)
    }

    async function storeMessage(e){
        e.preventDefault();
        if(messageSend)
        {
            await Api.post('/messages', {
                user_destinatary: chatActive, 
                message: messageSend
            }, {
                headers: { 
                    Authorization: "Bearer " + localStorage.getItem('token') 
                }
            })
            await setMessages([...messages, {user: localStorage.getItem('id'), message: messageSend}])
            setScrollMessageContent();
            setMessageSend('');
        }
    }

    async function handleChangeChat(userID){
        setChatActive(userID);
        if(viewportWidth < 992){
            setShowChatListing(false);
        }
    }

    return (
        <>
        <div id="messages">
            <div className={"overlay" + ((showChatListing) ? ' active' : '')}></div>
            <div className="container">
                <div className="row mt-5 align-items-center">
                    <div className="col-8 col-md-8 col-lg-12">
                        <h1>Minhas mensagens</h1>
                    </div>
                    {
                        (viewportWidth < 992)
                        ?
                        <div id="open-listing-chat" className="col-4 col-md-4 text-right">
                            <img src={Menu} alt="Chat" width="20" height="20" className="mb-0" onClick={() => setShowChatListing(true)}/>
                        </div>
                        :
                        null
                    }
                </div>
                <div id="chat-block" className="row mt-4">
                    {
                        (viewportWidth < 992)
                        ?
                        <>
                            <div id="chat-listing" className={"chat-listing-mobile col-md-4" + ((showChatListing) ? " active move-to-right" : "")}>
                                <div className="row text-right">
                                    <div className="col-md-12">
                                        <img src={Close} alt="Fechar" width="20" height="20" className="mb-2 mt-2" onClick={() => setShowChatListing(false)}/>
                                    </div>
                                </div>
                                {
                                    usersList.map((user, index, usersList) => (
                                        <div key={user.id} className={"row chat-item align-items-center " + ((parseInt(chatActive) === user.id) ? "active" : '')} onClick={() => handleChangeChat(user.id)}>
                                            <div className="col-4 col-md-3 text-center">
                                                <img src={(user.avatar) ? user.avatar.url : Avatar} alt={user.name} className="of-cover mb-0 br-50" width="60" height="60"/>
                                            </div>
                                            <div className="col-8 col-md-9">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <span className="fs-15 friend-name">{user.name}</span>
                                                    </div>
                                                    {/* <div className="col-md-12">
                                                        <span className="fs-15" ><img src={Check} alt="Mensagem" className="mb-0" width="15" height="15"/> {messagesList.filter(ml => parseInt(ml.user_destinatary) === user.id)[0].message}</span>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            
                            </>
                        :
                            <div id="chat-listing" className={"col-md-4" + ((showChatListing) ? " active move-to-right" : "")}>
                                {
                                    (usersList.length)
                                    ?
                                    usersList.map((user, index, usersList) => (
                                        <div key={user.id} className={"row chat-item align-items-center " + ((parseInt(chatActive) === user.id) ? "active" : '')} onClick={() => handleChangeChat(user.id)}>
                                            <div className="col-4 col-md-3 text-center">
                                                <img src={(user.avatar) ? user.avatar.url : Avatar} alt={user.name} className="of-cover mb-0 br-50" width="60" height="60"/>
                                            </div>
                                            <div className="col-8 col-md-9">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <span className="fs-15 friend-name">{user.name}</span>
                                                    </div>
                                                    {/* <div className="col-md-12">
                                                        <span className="fs-15" ><img src={Check} alt="Mensagem" className="mb-0" width="15" height="15"/> { messagesList.filter(ml => parseInt(ml.user_destinatary) === user.id)[0].message }</span>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    :
                                    console.log(usersList)
                                }
                            </div>
                        }
                    
                    <div className="col-12 col-sm-12 col-md-12 col-lg-8 p-0">
                        <div id="message-block">
                            <div id="message-content">
                                { 
                                    (!chatActive)
                                    ?
                                        <p>{(usersList.length) ? "Selecione uma conversa" : "Você não possui nenhuma conversa!"}</p>
                                    :
                                    
                                    messages.map((message, index, messages) => (
                                        <div key={index} id="" className={"message" + ((parseInt(message.user) !== parseInt(localStorage.getItem('id'))) ? '-left' : '')}>
                                            <div className="message-body">
                                                <p className="fs-13 m-0 username-message c-gray">{(parseInt(message.user) === parseInt(localStorage.getItem('id'))) ? localStorage.username : userDestinatary}</p>
                                                <div className="message-content">
                                                    <p className="fs-15">{message.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    ))
                                }
                            </div>
                            {
                                (chatActive)
                                ?
                                    <div id="send-message">
                                        <form id="send-message-form" className="form-row align-items-center" onSubmit={storeMessage}>
                                            <div className="col-10 col-md-11">
                                                <input type="text" className="w-100" placeholder="Digite sua mensagem" value={messageSend} onChange={(e) => setMessageSend(e.target.value)}/>
                                            </div>
                                            <div className="col-2 col-md-1 text-center">
                                                <button className="send-message">
                                                    <img src={Send} alt="Enviar" title="Enviar" width="20" height="20" className="mb-0"/>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                :
                                null
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}