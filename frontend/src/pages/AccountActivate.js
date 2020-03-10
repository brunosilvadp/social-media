import React, {useEffect, useState} from 'react';
import api from '../services/api';

//Assets
import Loading from '../assets/images/icons/loading-upload.gif' 
import '../assets/css/account-activate/main.css'
export default function AccountDesactivate(){
    const [validation, setValidation] = useState("");
    const [showButtonToLoginPage, setShowButtonToLoginPage] = useState(false);
    useEffect(() => {
        async function accountActivate(){
            await api.put('users/activate', {
                verification: new URLSearchParams(window.location.search).get('verification')
            }).then((response) => {
                setValidation("Conta ativada com sucesso!");
                setShowButtonToLoginPage(true);
            }).catch((error) => {
                setValidation("Houve um problema ao ativar sua conta, verifique se ela já não está ativa.");
            })
        }
        accountActivate();
    }, [])
    return(
        <>
            <section className="header_general register_header">
                <div className="container h-100">
                    <div className="row h-100 align-items-center">
                        <div className="col-md-12 text-center">
                            <h1 className="">Ativação de conta</h1>
                        </div>
                    </div>
                </div>
            </section>
            <section id="account-activate">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div id="account-activate-content">
                                <div className="row">
                                    <div className="col-md-12 text-center">
                                        <div className="header-account-activate">
                                            <h2>Social Media</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 text-center">
                                        <div className="body-account-activate">
                                            <p>{validation}</p>
                                            {
                                                (showButtonToLoginPage)
                                                ?
                                                    <button type="button" className="btn btn_gray col-md-6 text-uppercase" onClick={() => window.location.href = "/login"}>Ir para a página de login</button>
                                                :
                                                    null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}