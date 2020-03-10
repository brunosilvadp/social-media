import React, {useState}from 'react';
import { Link } from 'react-router-dom';
import Noty from 'noty';
//services
import api from '../services/api';

//ASSETS
import '../assets/css/top/main.css';
import Loading from '../assets/images/icons/loading-upload.gif' 
export default function Top(){
    
    const [avatar, setAvatar] = useState(localStorage.getItem('avatar'));
    const [banner, setBanner] = useState(localStorage.getItem('banner'));
    const [loadingAvatar, setLoadingAvatar] = useState(false)
    const [loadingBanner, setLoadingBanner] = useState(false)
    
    async function uploadAvatar(file){
        if(file.size <= (4 * 1024 * 1024)){
            setLoadingAvatar(true);
            let formData = new FormData();
            formData.append('avatar', file)
            const response = await api.put('/user/avatar', formData, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token') }
            })
            localStorage.setItem('avatar', response.data[0].avatar.url);
            setAvatar(response.data[0].avatar.url);
            setTimeout(() => setLoadingAvatar(false), 5000);
        }else{
            limitUploadExceded();
        }
    }

    async function uploadBanner(file){
        if(file.size <= (4 * 1024 * 1024)){
            setLoadingBanner(true);
            let formData = new FormData();
            formData.append('banner', file)
            const response = await api.put('/user/banner', formData, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token') }
            })
            localStorage.setItem('banner', response.data.url);
            setBanner(response.data.url);
            setTimeout(() => setLoadingBanner(false), 5000);
        }else{
            limitUploadExceded();
        }
    }

    function limitUploadExceded(){
        new Noty({
            theme    : 'mint',
            closeWith: ['click', 'button'],
            layout: 'topRight',
            timeout: 8000,
            type: 'error',
            text: 'Tamanho excedido. A foto deve conter no máximo 4Mb.',
        }).show();
    }
    return(
        <div id="top-content" style={{background: "linear-gradient(0deg,rgba(0,0,0,0.3),rgba(0,0,0,0.3)), url("+banner+")"} } className="position-relative">
            {
                (loadingBanner)
                ?
                    <div id="loading-banner">
                        <img src={Loading} alt="Carregando" width="70" className="mb-0"/>
                    </div>
                :
                    null
            }
            <div className="container h-100">
                <div className="row h-100 align-items-end">
                    <div className="col-6 col-sm-6 col-md-4 text-right">
                        <div id="user-avatar" className="bkg-settings position-relative rounded-circle" style={{background: "url("+avatar+")"} }>
                            <label htmlFor="avatar">
                                <div id="edit-avatar" className="w-100 d-flex justify-content-center align-items-center">
                                    <div className="content-edit-avatar">
                                        <p className="m-0 c-white fs-15">Editar foto <i className="fa fa-pencil ml-2 fs-15"></i></p>
                                    </div>
                                </div>
                                <input type="file" name="avat" id="avatar" className="d-none" onChange={(e) => uploadAvatar(e.target.files[0])}/>
                            </label>
                            {
                                (loadingAvatar)
                                ?
                                    <div id="upload-avatar">
                                        <img src={Loading} alt="Carregando" width="100"/>
                                    </div>
                                :
                                    null
                            }
                        </div>
                    </div>
                    <div className="col-6 col-sm-6 col-md-8">
                        <div className="row">
                            <div className="col-md-12">
                                <h1>{localStorage.getItem('username')}</h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <Link to="/editar-perfil"><p><i className="fa fa-edit"></i> Editar perfil</p></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="edit-banner" className="position-absolute">
                <label htmlFor="banner" className="mb-0">
                    <i className="fa fa-pencil cursor-pointer" title="Editar banner"></i>
                    <input type="file" name="banner" id="banner" className="d-none" onChange={(e) => uploadBanner(e.target.files[0])}/>
                </label>
            </div>
        </div>
    );
}