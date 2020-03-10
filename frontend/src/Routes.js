import React from 'react';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';

//Services
import api from './services/api'

//Pages
import Main from './pages/Main';
import Followers from './pages/Followers';
import Messages from './pages/Messages';
import ListingAlbums from './pages/ListingAlbums';
import Album from './pages/Album';
import Erro from './pages/Erro';
import Login from './pages/Login';
import Register from './pages/Register';
import EditProfile from './pages/EditProfile';
import UniquePost from './pages/UniquePost';
import AccountActivate from './pages/AccountActivate';

//Components
import Header from './components/Header';
import Top from './components/Top';
import Navigation from './components/Navigation';

//Assets
import './assets/css/style.css';
import './assets/css/custom.css'
import './assets/css/bootstrap.min.css'
import '../node_modules/noty/lib/noty.css'
import '../node_modules/noty/lib/themes/mint.css'
export default function Routes(){
    const isAuthenticated = async () => {
        await api.get('/authenticated', {
            headers: {
                Authorization: 'Bearear ' + localStorage.getItem('token')
            }
        }).then(() => {
            return true;
        })
        .catch(() => {
            localStorage.clear();
            return false;
        })
    }
    return(
        <>
        <BrowserRouter>
            <Header />
            <div id="content">
                    {
                        (localStorage.getItem('token'))
                        ?
                            <>
                                <Top />
                                <Navigation />
                            </>
                        :
                        null
                    }
                    <Route path="/" exact render={() => (localStorage.getItem('token') && isAuthenticated()) ? <Main />: (<Redirect to={{pathname: '/login'}} />) }/>
                    <Route path="/post/:id" exact render={({match}) => (localStorage.getItem('token') && isAuthenticated()) ? <UniquePost match={match} />: (<Redirect to={{pathname: '/login'}} />) }/>
                    <Route path="/minhas-amigas" render={() => (localStorage.getItem('token') && isAuthenticated()) ? <Followers />: (<Redirect to={{pathname: '/login'}} />) } />
                    <Route path="/mensagens" exact render={({match}) => (localStorage.getItem('token') && isAuthenticated()) ? <Messages match={match} />: (<Redirect to={{pathname: '/login'}} />) } />
                    <Route path="/mensagens/:id" render={({match}) => (localStorage.getItem('token') && isAuthenticated()) ? <Messages match={match} />: (<Redirect to={{pathname: '/login'}} />) } />
                    <Route path="/albuns" exact render={() => (localStorage.getItem('token') && isAuthenticated()) ? <ListingAlbums />: (<Redirect to={{pathname: '/login'}} />) } />
                    <Route path="/albuns/:id" render={({match}) => (localStorage.getItem('token') && isAuthenticated()) ? <Album match={match} />: (<Redirect to={{pathname: '/login'}} />) } />
                    <Route path="/editar-perfil" render={() => (localStorage.getItem('token') && isAuthenticated()) ? <EditProfile />: (<Redirect to={{pathname: '/login'}} />) } />
                    <Route path="/404" component={Erro}/>
                    <Route path="/ativar/conta" component={AccountActivate}/>
                    <Route path="/login" render={() => (localStorage.getItem('token')) ? (<Redirect to={{pathname: '/'}} />) : <Login /> } />
                    <Route path="/cadastrar" render={() => (localStorage.getItem('token')) ? (<Redirect to={{pathname: '/'}} />) : <Register /> } />
            </div>
        </BrowserRouter>
        </>
    );
}