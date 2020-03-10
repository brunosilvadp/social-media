import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom'
import Noty from 'noty';

//Services
import Api from '../services/api'

//Assets
import '../assets/css/followers/main.css';
import Avatar from '../assets/images/avatar.svg';

export default function Followers(){
    const [followers, setFollowers] = useState([]);
    const [followersFriendQuantity, setFollowersFriendQuantity] = useState([]);
    
    useEffect(() => {
        async function loadFollowers(){
            const response = await Api.get('/followers', {
                headers: { Authorization: "Bearer " + localStorage.getItem('token') }
            })
            setFollowers([...response.data.follower]);
            setFollowersFriendQuantity([...response.data.friendQuantity]);
        }
        loadFollowers();
    }, [])

    async function handleUnfollow(userID){
        await Api.put('/followers', {
            user_followed: userID
        },
        {
            headers: { Authorization: "Bearer " + localStorage.getItem('token') }
        }).then((response) => {
            setFollowers(followers.filter(follower => follower.id !== userID));
        }).catch((error) => {
            new Noty({
                theme    : 'mint',
                closeWith: ['click', 'button'],
                layout: 'topRight',
                timeout: 8000,
                type: 'error',
                text: 'Houve um problema ao desfazer a amizade.',
            }).show();
        })
    }
    return (
        <>
        <div id="followers">
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-12">
                        <h1>Lista de amigas</h1>
                    </div>
                </div>
                <div className="row mt-4 justify-content-center">
                    {
                        (followers.length > 0)
                        ?
                        followers.map((follower, index) => {
                            return (index === 0)
                            ?
                                <div key={follower.id} className="col-6 col-md-4 mt-2 divisor-bottom text-center-sm">
                                    <div className="row align-items-center">
                                        <div className="col-md-4">
                                            <img className="friend-avatar of-cover" src={(follower.avatar) ? follower.avatar.url : Avatar} alt="" width="90" height="90"/>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <h2 className="friend-name mb-0 pb-2">
                                                        {follower.name}
                                                    </h2>
                                                </div>
                                                <div className="col-md-12">
                                                    <Link to={`/mensagens/${follower.id}`}>
                                                        <span className="quantity-friends c-gray fs-15">
                                                            Enviar mensagem
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            :
                                <div key={follower.id} className="col-6 col-md-4 mt-2 divisor-bottom text-center-sm">
                                    <div className="row align-items-center">
                                        <div className="col-md-4">
                                            <img className="friend-avatar of-cover" src={(follower.avatar) ? follower.avatar.url : Avatar} alt="" width="90" height="90"/>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <h2 className="friend-name mb-0 pb-2">
                                                        {follower.name}
                                                    </h2>
                                                </div>
                                                <div className="col-md-12">
                                                    <span className="quantity-friends c-gray fs-15">
                                                        {followersFriendQuantity[index] ? `${followersFriendQuantity[index].count} amiga(s)` : 'Nenhuma amiga'} 
                                                    </span>
                                                </div>
                                                <div className="col-md-12">
                                                    <Link to={`/mensagens/${follower.id}`}>
                                                        <span className="quantity-friends c-gray fs-15">
                                                            Enviar mensagem
                                                        </span>
                                                    </Link>
                                                </div>
                                                <div className="col-md-12">
                                                    <button className="remove-attributes-button cursor-pointer" onClick={() => handleUnfollow(follower.id)}>
                                                        <span className="remove-friend c-gray fs-15"> Desfazer amizade </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        })
                        :
                            <p>Você não está seguindo ninguém no momento!</p>
                    }
                </div>
            </div>
        </div>
        </>
    );
}