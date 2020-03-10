import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

//Services
import api from '../services/api';

//Assets
import Loading from '../assets/images/icons/loading.gif'
import Avatar from '../assets/images/avatar.svg';
import Close from '../assets/images/icons/close.svg' 
import Follower from '../assets/images/icons/follower.svg' 
export default function Header(){

    
    const [sidebarActive, setSidebarActive] = useState(false);
    const [search, setSearch] = useState('');
    const [followers, setFollowers] = useState([]);
    const [listUsers, setListUsers] = useState([]);
    const [showInputSearch, setShowInputSearch] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    function handleCloseSearchField(){
        setShowLoading(false);
        setShowInputSearch(false)
        setSearch('');
        setListUsers([]);
    }

    function logout(){
        localStorage.clear();
        window.location.href = '/login'
    }

    async function handleFollow(userID){
        await api.post('/followers', {
            user_followed: userID
        }, {
            headers: { 
                Authorization: "Bearer " + localStorage.getItem('token') 
            }
        })

        setListUsers(listUsers.filter(user => user.id !== userID))
    }

    useEffect(() => {
        async function loadUsers(){
            setShowLoading(true);
            const response = await api.get(`/users/find/${search}`, {
                headers: { 
                    Authorization: "Bearer " + localStorage.getItem('token') 
                }
            });
            setListUsers([...response.data.users])
            if(response.data.follower){
                setFollowers([...response.data.follower]);
            } 
            setShowLoading(false);
        }

        if(search){
            loadUsers();
        }else{
            setListUsers([]);
        }
    }, [search])

    return(
        <>
        <div className="overlay"></div>
        <div id="sidebar_mobile" className="wrapper">
            <nav id="sidebar" className={(sidebarActive) ? ' active' : ''}>
                <div id="dismiss" onClick={() => setSidebarActive(false)}>
                    <i className="fa fa-times"></i>
                </div>
                <ul className="list-unstyled components">
                    <li className="pr-2 pl-2 mt-4" id="search_header">
                        <div className="input-group">
                            <input 
                                type="text"
                                placeholder="Buscar"
                                value={search}
                                className="form-control"
                                onChange={(e) => {
                                    if(!showInputSearch) setShowInputSearch(true)
                                    setSearch(e.target.value)
                                }}
                            />
                            <div className="input-group-append">
                                <button className="btn btn-secondary p-0" type="button">
                                    <i className="fa fa-search"></i>
                                </button>
                            </div>
                        </div>
                        <div id="list-users-mobile" className={(showInputSearch) ? "active" : ""}>
                            <div className="row align-items-center">
                                <div className="col-md-12">
                                    {
                                        (listUsers.length > 0)
                                        ?
                                        listUsers.map(user => (
                                            <div key={user.id} className="user-item d-flex align-items-center py-2">
                                                <div className="col-3 col-sm-3 col-md-3 text-center">
                                                    <img src={(user.avatar) ? user.avatar.url : Avatar} alt={user.name} width="40" height="40" className="br-50 of-cover"/>
                                                </div>
                                                <div className="col-6 col-sm-6 col-md-6 pl-0">
                                                    <p className="m-0">
                                                        {user.name}
                                                    </p>
                                                </div>
                                                <div className="col-3 col-sm-3 col-md-3">
                                                    <button className="remove-attributes-button cursor-pointer btn-follow p-0" onClick={() => handleFollow(user.id)}>
                                                        <img src={Follower} alt="Seguir" title="Seguir" width="100%"/>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <div className="d-flex align-items-center py-2">
                                            <div className="col-md-12">
                                                <p className="m-0 fs-15">Nenhum usuário encontrado</p>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
        <nav className="navbar navbar-expand-xl pt-0 pb-0 navbar-light bg-white fixed-top w-100" id="mainNav">
            <div className="container">
                <div className="row w-100">
                    <button className="navbar-brand remove-attributes-button js-scroll-trigger cursor-pointer">
                        <img src="" alt="" title="" className="brand" />
                    </button>
                    <button type="button" id="sidebarCollapse" className="btn btn-sidebar" onClick={() => setSidebarActive(true)}>
                        <i className="fa fa-align-left" aria-hidden="true"></i>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarResponsive">
                        <ul className="navbar-nav ml-auto">
                            {
                                (localStorage.getItem('token'))
                                ?
                                <li className="nav-item">
                                    <button className="remove-attributes-button nav-link js-scroll-trigger cursor-pointer" onClick={() => logout()}>Sair</button>
                                </li>
                                :
                                null
                            }
                            <li className="pr-2 pl-5" id="search_header">
                                <a className="btn btn-search" href="#search" onClick={() => setShowInputSearch(true)}><i className="fa fa-search"></i></a>
                                <input
                                    type="text"
                                    name="search"
                                    id="search-input"
                                    placeholder="Pesquisar"
                                    autoComplete="off"
                                    value={search}
                                    className={((showInputSearch) ? "active" : "" ) + " bbr-0 bb-0"}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <img src={Loading} alt="Carregando" id="loading-icon" className={(showLoading) ? "active" : ""}/>
                                <div id="list-users" className={(showInputSearch) ? "active" : ""}>
                                    <div className="row align-items-center">
                                        <div className="col-md-12">
                                            {
                                                (listUsers.length > 0)
                                                ?
                                                listUsers.map(user => (
                                                    <div key={user.id} className="user-item d-flex align-items-center py-2">
                                                        <div className="col-md-3 text-center">
                                                            <img src={(user.avatar) ? user.avatar.url : Avatar} alt={user.name} width="50" height="50" className="br-50 of-cover"/>
                                                        </div>
                                                        <div className="col-md-6 pl-0">
                                                            <p className="m-0">
                                                                {user.name}
                                                            </p>
                                                        </div>
                                                        <div className="col-md-3">
                                                            {
                                                                (followers.some(follower => follower.user_followed === user.id))
                                                                ?
                                                                    <span className="remove-attributes-button">Seguindo</span>
                                                                :
                                                                    <button className="remove-attributes-button cursor-pointer btn-follow" onClick={() => handleFollow(user.id)}>Seguir</button>
                                                            }
                                                        </div>
                                                    </div>
                                                ))
                                                :
                                                (search === '')
                                                ?
                                                    null
                                                :
                                                <div className="d-flex align-items-center py-2">
                                                    <div className="col-md-12">
                                                        <p className="m-0 fs-15">Nenhuma usuária encontrada</p>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li id="close-search-input" className={(showInputSearch) ? "active" : ""}>
                                <img src={Close} alt="" width="20" height="20" className="mb-0" onClick={() => handleCloseSearchField()}/>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
        </>
    ); 
}