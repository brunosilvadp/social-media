import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

//Assets
import '../assets/css/navigation/main.css';
import Notification from '../assets/images/icons/notification.svg';
import api from '../services/api';

export default function Navigation(){
    const [quantityNotifications, setQuantityNotifications] = useState(0)
    const [notifications, setNotifications] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [offset, setOffset] = useState(0);
    const [quantityRegisters, setQuantityRegister] = useState(0);

    async function loadNotifications(){
        const response = await api.get(`/notifications/${offset}`, {
            headers: { Authorization: "Bearear " + localStorage.getItem('token')}
        })
        setNotifications([...notifications, ...response.data.notification])
        if(offset === 0) setQuantityRegister(response.data.quantityRegisters);
        setOffset(offset + 10);
        if(!showNotification)setShowNotification(true);
    }

    useEffect(() => {
        async function loadQuantityNotifications(){
            const response = await api.get('/quantity-notifications', {
                headers: {
                    Authorization: "Bearear " + localStorage.getItem('token')
                }
            })
            setQuantityNotifications(((response.data.length) ? response.data[0].quantity_notifications : 0));
        }
        loadQuantityNotifications();
    }, [])

    async function checkedNotification(id){
        
        setNotifications(notifications.map(notification => {
            if(notification._id === id && !notification.checked){
                notification.checked = true;
                setQuantityNotifications(quantityNotifications - 1);
                return notification;
            }else{
                return notification
            }
        }))
        
        setShowNotification(false);
        await api.put('/notifications', {
            id
        }, {
            headers: {Authorization: "Bearear " + localStorage.getItem('token')}
        })
    }

    let url = (type, contentID)  => {
        if(type === 'message'){
            return `/mensagens/${contentID}`;
        }else if(type === 'post'){
            return `/post/${contentID}`;
        }else{
            return `/albuns/${contentID}`;
        }
    }

    document.body.addEventListener('click', () => {
        setShowNotification(false);
    }); 

    return(
        <>
        <div id="navigation">
            <div className="container">
                <div className="row justify-content-center position-relative">
                    <ul className="horizontal-list position-relative">
                        <li>
                            <Link to="/">Meu Feed</Link>
                        </li>
                        <li>
                            <Link to="/minhas-amigas">Minhas Amigas</Link>
                        </li>
                        <li>
                            <Link to="/mensagens">Mensagens</Link>
                        </li>
                        <li>
                            <Link to="/albuns">Álbuns</Link>
                        </li>
                        <li className="position-relative">
                            <button className="remove-attributes-button" onClick={() => (!showNotification) ? loadNotifications() : setShowNotification(false)}>
                                <img src={Notification} alt="Notificações" title="Notificações" width="30" height="30" className="mb-0"/>
                                {
                                    <span className={"quantity-notifications position-absolute " + ((quantityNotifications > 0) ? "new-notifications" : '')}>{quantityNotifications}</span>
                                }
                            </button>
                        </li>
                    </ul>
                    <div id="content-notifications" className={(showNotification) ? "active" : ""}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <span className="fs-13">Notificações</span>
                                    </div>
                                </div>
                                {
                                    (notifications.length > 0)
                                    ?
                                        <>
                                        {notifications.map((notification) => (
                                            <Link key={notification._id} to={url(notification.type, notification.content_id)} onClick={() => checkedNotification(notification._id)}>
                                                <div className={"item-notification row py-2" + ((!notification.checked) ? " not-viewed" : "")}>
                                                    <div className="col-md-12">
                                                        <p className="mb-0 fs-15" >{notification.notification}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                        {
                                            (parseInt(quantityRegisters) > parseInt(offset)) 
                                            ?
                                                <div className="row justify-content-center py-2">
                                                    <div className="col-md-12 text-center">
                                                        <button onClick={() => loadNotifications()} className="load-more-notifications remove-attributes-button cursor-pointer"type="button">Carregar mais</button>
                                                    </div>
                                                </div>
                                            :
                                            null
                                        }
                                        
                                        </>
                                    :
                                    <div className="row">
                                        <div className="col-md-12">
                                            <p className="mb-0 fs-15" >Você não possui nenhuma notificação</p>
                                        </div>
                                    </div>
                                }
                            </div>
                </div>
            </div>
        </div>
        </>
    );
}