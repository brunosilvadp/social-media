import React, {useState, useEffect} from 'react';
import Noty from 'noty';

//Services
import Api from '../services/api'

//Assets
import '../assets/css/edit-profile/main.css'

export default function EditProfile(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [password, setPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [promotion, setPromotion] = useState(false);
    const [newsletter, setNewsletter] = useState(false);
    const [showConfirmAccountDesactivate, setShowConfirmAccountDesactivate] = useState(false);
    
    useEffect(() => {
        async function loadData(){
            const response = await Api.get('/update-profile', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                }
            })
            setName(response.data.name);
            setEmail(response.data.email);
            setCity(response.data.city);
            setPromotion(response.data.promotion);
            setNewsletter(response.data.newsletter);
        }
        loadData();
    }, [])

    async function handleUpdateProfile(e){
        e.preventDefault();
        if(password !== confirmPassword){
            errorNoty('As senhas não coincidem!')
        }else{
            const response = await Api.put('/users', {
                name,
                email,
                city,
                password: (password) ? password : null,
                oldPassword: (oldPassword) ? oldPassword : null,
                promotion,
                newsletter
            }, 
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                }
            })
            if(response.data.error){
                errorNoty(response.data.error)
            }else{
                localStorage.setItem('username', response.data.name)
                window.location.href = "/";
            }
        }
    }

    function errorNoty(msg){
        new Noty({
            theme    : 'nest',
            closeWith: ['click', 'button'],
            layout: 'topRight',
            timeout: 8000,
            type: 'error',
            text: msg,
        }).show();
    }

    async function handleAccountDeactivation(){
        await Api.put('/user/deactivate', null, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            }
        })
        console.log('teste');
        localStorage.clear();
        window.location.href = '/login'
    }
    return(
        <>
        <section className="contact_list">
            <div className="container">
                <div className="row justify-content-center h-100 align-items-center">
                    <div className="col-xl-8" id="item_contact">
                        <form onSubmit={handleUpdateProfile}>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <div className="input-group">
                                        <input type="text"
                                            className="form-control"
                                            id="user-name"
                                            placeholder="Nome"
                                            aria-describedby="inputGroupPrepend1"
                                            required
                                            name="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}/>
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroupPrepend1"><i className="fa fa-user"></i></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group col-md-12">
                                    <div className="input-group">
                                        <input type="email"
                                            className="form-control"
                                            id="user-email"
                                            placeholder="E-mail"
                                            aria-describedby="inputGroupPrepend2"
                                            required
                                            name="email"
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} />
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroupPrepend2"><i className="fa fa-envelope"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <div className="input-group">
                                        <input type="text"
                                            className="form-control"
                                            id="user-city"
                                            placeholder="Cidade onde mora"
                                            aria-describedby="inputGroupPrepend1"
                                            required
                                            name="city"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)} />
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroupPrepend1"><i className="fa fa-map-marker"></i></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group col-md-12">
                                    <div className="input-group">
                                        <input type="password"
                                            className="form-control"
                                            id="user-old-password"
                                            placeholder="Senha antiga"
                                            aria-describedby="inputGroupPrepend1"
                                            name="oldPassword"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)} />
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroupPrepend1"><i className="fa fa-lock"></i></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group col-md-12">
                                    <div className="input-group">
                                        <input type="password"
                                            className="form-control"
                                            id="user-password"
                                            placeholder="Nova senha"
                                            aria-describedby="inputGroupPrepend1"
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)} />
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroupPrepend1"><i className="fa fa-lock"></i></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group col-md-12">
                                    <div className="input-group">
                                        <input type="password"
                                            className="form-control"
                                            id="user-password_confirmation"
                                            placeholder="Confirmar senha"
                                            aria-describedby="inputGroupPrepend1"
                                            name="password_confirmation"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)} />
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroupPrepend1"><i className="fa fa-lock"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-12">
                                    <label className="custom-control fill-checkbox">
                                        <input type="checkbox" className="fill-control-input" name="promotion" checked={promotion} onChange={(e) => setPromotion(e.target.checked)}/>
                                        <span className="fill-control-indicator"></span>
                                        <span className="fill-control-description">Desejo receber promoções e informações de empresas parceiras</span>
                                    </label>
                                    <label className="custom-control fill-checkbox">
                                        <input type="checkbox" className="fill-control-input" name="newsletter" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)}/>
                                        <span className="fill-control-indicator"></span>
                                        <span className="fill-control-description">Desejo receber a newsletter da Social Media</span>
                                    </label>
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <div className="col-md-4 text-center">
                                    <button type="button" className="btn btn_gray" onClick={() => setShowConfirmAccountDesactivate(true)}>Desativar conta</button>
                                </div>
                            </div>
                            <button type="submit" className="btn btn_main col-md-12 mt-2">Alterar dados</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
        {
            (showConfirmAccountDesactivate)
            ?
                <div id="confirm-desactivate">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-6 text-center">
                                <div className="content-desactivate">
                                    <div className="header-desactivate">
                                        <div className="row">
                                            <div className="col-md-10">
                                                <p className="mb-0">Tem certeza que deseja desativar sua conta?</p>
                                            </div>
                                            <div className="col-md-2 text-center">
                                                <i className="fa fa-close cursor-pointer" onClick={() => setShowConfirmAccountDesactivate(false)} title="Cancelar"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="body-desactivate">
                                        <h2>Vamos sentir a sua falta :(</h2>
                                        <p className="mb-0">Após a desativação da sua conta, o seu perfil será desabilitado e removido das buscas. 
                                            Algumas informações ainda podem ficar visíveis para as pessoas, como as mensagens trocadas com ela.
                                        </p>
                                        <hr/>
                                        <div className="action-buttons px-2">
                                            <div className="row justify-content-end">
                                                <button type="submit" className="btn btn_main" onClick={() => handleAccountDeactivation()}>Desativar agora</button>
                                                <button type="button" className="btn btn_gray ml-2" onClick={() => setShowConfirmAccountDesactivate(false)}>Cancelar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            :
            null
        }
        </>
    );
}