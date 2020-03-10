import React, {useState} from 'react';
import Noty from 'noty';

//Services
import Api from '../services/api';

//Assets
import '../../node_modules/noty/lib/noty.css'
import '../../node_modules/noty/lib/themes/mint.css'
import '../assets/css/register/main.css'
export default function Register(){
    const [registeredSuccessfully, setRegisteredSuccessfully] = useState(false)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [policyPrivacies, setPolicyPrivacies] = useState(false);
    const [promotion, setPromotion] = useState(false);
    const [newsletter, setNewsletter] = useState(false);
    
    async function handleRegister(e){
        e.preventDefault();
        if(password !== confirmPassword){
            errorNoty('As senhas não coincidem!')
        }else if(password.length < 8) {
            errorNoty('A senha deve conter no mínimo 8 caracteres!')
        }else{
            const response = await Api.post('/users', {
                name,
                email,
                city,
                password,
                policyPrivacies,
                promotion,
                newsletter
            })
            if(response.data.error){
                errorNoty(response.data.error)
            }else{
                setRegisteredSuccessfully(true);
            }
        }
    }

    function errorNoty(msg){
        new Noty({
            theme    : 'mint',
            closeWith: ['click', 'button'],
            layout: 'topRight',
            timeout: 8000,
            type: 'error',
            text: msg,
        }).show();
    }

    document.addEventListener("DOMContentLoaded", function() {
        var elements = document.getElementsByTagName("INPUT");
        for (var i = 0; i < elements.length; i++) {
            elements[i].oninvalid = function(e) {
                e.target.setCustomValidity("");
                if (!e.target.validity.valid) {
                    e.target.setCustomValidity("Esse campo é obrigatório");
                }
            };
            elements[i].oninput = function(e) {
                e.target.setCustomValidity("");
            };
        }
    })

    return(
        <>
        <section className="header_general register_header">
            <div className="container h-100">
                <div className="row h-100 align-items-center">
                    <div className="col-md-12 text-center">
                        <h1 className="">Cadastre-se na rede social</h1>
                    </div>
                </div>
            </div>
        </section>
        {
            (registeredSuccessfully)
            ?
                <section>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-6">
                                <div id="registered-successfully">
                                    <div className="row">
                                        <div className="col-md-12 text-center">
                                            <div className="header-registered-successfully">
                                                <h2>Olá {name}</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 text-center">
                                            <div className="body-registered-successfully">
                                                <p className="mb-0">É preciso que você confirme se esse é o seu endereço de e-mail através de um link que enviamos ao e-mail cadastrado.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 text-center">
                                            <div className="footer-registered-successfully">
                                                <span><small>Rede Social</small></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            :
                <section className="contact_list">
                    <div className="container">
                        <div className="row justify-content-center h-100 align-items-center">
                            <div className="col-xl-8" id="item_contact">
                                <form onSubmit={handleRegister}>
                                    <div className="form-row">
                                        <div className="form-group col-md-12">
                                            <div className="input-group">
                                                <input type="text"
                                                    className="form-control"
                                                    id="user-name"
                                                    placeholder="Nome"
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
                                                    id="user-password"
                                                    placeholder="Senha"
                                                    aria-describedby="inputGroupPrepend1"
                                                    required
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
                                                    required
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
                                                <input type="checkbox" className="fill-control-input" name='policy_privacies' required onInvalid={() => errorNoty('Você precisa estar de acordo com a política de privacidade')} onChange={(e) => setPolicyPrivacies((policyPrivacies) ? true : false)}/>
                                                <span className="fill-control-indicator"></span>
                                                <span className="fill-control-description">Eu concordo com a política de privacidade e os termos de uso do site</span>
                                            </label>
                                            <label className="custom-control fill-checkbox">
                                                <input type="checkbox" className="fill-control-input" name="promotion" onChange={(e) => setPromotion((promotion) ? true : false)}/>
                                                <span className="fill-control-indicator"></span>
                                                <span className="fill-control-description">Desejo receber promoções e informações de empresas parceiras</span>
                                            </label>
                                            <label className="custom-control fill-checkbox">
                                                <input type="checkbox" className="fill-control-input" name="newsletter" onChange={(e) => setNewsletter((newsletter) ? true : false)}/>
                                                <span className="fill-control-indicator"></span>
                                                <span className="fill-control-description">Desejo receber a newsletter da rede social</span>
                                            </label>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn_main col-md-12">INSCREVER-ME</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
        }
        </>
    );
}