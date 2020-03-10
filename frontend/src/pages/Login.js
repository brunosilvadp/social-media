import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import Noty from 'noty';

//Services
import Api from '../services/api'

//Assets
import Avatar from '../assets/images/avatar.svg'
import '../../node_modules/noty/lib/noty.css'
import '../../node_modules/noty/lib/themes/mint.css'

export default function Login(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function login(e){
        e.preventDefault();
        const response = await Api.post('sessions', {
            email,
            password
        })
        
        if(!response.data.error){
            localStorage.setItem('id', response.data.user.id);
            localStorage.setItem('username', response.data.user.name);
            localStorage.setItem('banner', response.data.user.url);
            localStorage.setItem('avatar', (response.data.user.avatar) ? response.data.user.avatar.url : Avatar);
            localStorage.setItem('token', response.data.token);
            window.location.href = "/"    
        }else{
            new Noty({
                theme    : 'mint',
                closeWith: ['click', 'button'],
                layout: 'topRight',
                timeout: 8000,
                type: 'error',
                text: response.data.error,
            }).show();
        }
        
    }

    return(
        <div className="login_page contact_list">
            <div className="container h-100">
                <div className="row justify-content-center h-100 align-items-center">
                    <div className="col-xl-8" id="title">
                        <h1 className="p-0 mb-5">Área da Cliente</h1>

                        <form onSubmit={login}>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            name="email"
                                            id="email"
                                            className="form-control"
                                            placeholder="Seu e-mail"
                                            aria-describedby="inputGroupPrepend1"
                                            onChange={(e) => setEmail(e.target.value)}
                                            required />
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroupPrepend1"><i className="fa fa-user"></i></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group col-md-12">
                                    <div className="input-group">
                                        <input 
                                            type="password"
                                            className="form-control"
                                            placeholder="Sua senha"
                                            aria-describedby="inputGroupPrepend2"
                                            name="password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            required />
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroupPrepend2"><i className="fa fa-lock"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn_main col-md-12 text-uppercase font-weight-bold font_main">Entrar</button>
                            {/* <p className="mt-1 forget"><small>Não consegue acessar sua conta? <Link to="{{ route('password.request') }}" className="text-uppercase"> Clique aqui</Link></small></p> */}
                        </form>
                        <div className="row justify-content-center m-0">
                            <div className="col-md-6 mt-4 mb-1">
                                <h6 className="no-span"><span>ou</span></h6>
                            </div>
                        </div>
                        <div className="row justify-content-center m-0 mt-2">
                            <div className="col-md-12 p-0">
                                <Link to="/cadastrar">
                                    <div className="btn btn-register font-weight-bold col-md-12 text-uppercase font_main">
                                        fazer meu cadastro
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}