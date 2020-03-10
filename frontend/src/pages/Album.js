import React, { useState, useEffect, createRef }from 'react';
import { Link } from 'react-router-dom';
import Noty from 'noty';

//Services
import api from '../services/api';

//Assets
import '../assets/css/album/main.css'
import Trash from '../assets/images/icons/trash.svg'
import Close from '../assets/images/icons/close-white.svg' 
import Loading from '../assets/images/icons/loading-upload.gif' 
export default function Album({ match }){
    const [photos, setPhotos] = useState([]);
    const [quantityPhotos, setQuantityPhotos] = useState(0);
    const [albumName, setAlbumName] = useState('');
    const myRef = createRef();
    const [lightboxSource, setLightboxSource] = useState('');
    const [loadingUploadPhoto, setLoadingUploadPhoto] = useState(false);
    useEffect(() => {
        async function loadPhotos(){
            const response = await api.get(`/albunsItems/${match.params.id}`, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token') }
            });
            if(response.data[0].Album){
                setAlbumName(response.data[0].Album.name);
                setQuantityPhotos(response.data.length);
                setPhotos([...response.data]);
            }else{
                setAlbumName(response.data[0].name);
            }
        }
        
        loadPhotos();
    }, [])

    document.onkeydown = (evt) => {
        evt = evt || window.event;
        if (evt.keyCode == 27 && lightboxSource) {
            setLightboxSource('');
        }
    };

    async function storePhoto(e){
        if(myRef.current.files[0].size <= (4 * 1024 * 1024)){
            setLoadingUploadPhoto(!loadingUploadPhoto);
            let formData = new FormData();
            formData.append('avatar', myRef.current.files[0]);
            formData.append('album_id', match.params.id);

            const response = await api.post('/albunsItems', formData,
            {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPhotos([response.data, ...photos]);
            setQuantityPhotos(photos.length + 1)
            setLoadingUploadPhoto(false);
        }else{
            new Noty({
                theme    : 'mint',
                closeWith: ['click', 'button'],
                layout: 'topRight',
                timeout: 8000,
                type: 'error',
                text: 'Tamanho excedido. A foto deve conter no máximo 4Mb.',
            }).show();
        }
    }

    async function destroyPhoto(id) {
        await api.delete(`/albunsItems/${id}`,
        {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        setPhotos(photos.filter(photo => photo.id !== id));
        setQuantityPhotos(photos.length - 1);
    }

    return(
        <>
        <div id="album">
            <div className="container">
                <div className="row mt-5 align-items-center">
                    <div className="col-md-2">
                        <h1>Meus Álbuns</h1>
                    </div>
                    <div className="col-md-10">
                        <Link to="/albuns">
                            <span className="to-album-listing c-666">
                                    Voltar aos álbuns
                            </span>
                        </Link>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-3">
                        <div className="row align-items-center">
                            <div className="col-md-3 text-right">
                                <i className="fa fa-image c-primary"></i>
                            </div>
                            <div className="col-md-9">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h2 className="album-name mb-0 pb-0">{albumName}</h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <span className="c-666 fs-13 f-italic">{quantityPhotos}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="add-new-photo col-md-9 d-flex align-items-center">
                        <hr/>
                        <span className="text-right">
                            <form id="store-photo" onSubmit={storePhoto}>
                                <label htmlFor="new-photo" className="cursor-pointer">
                                        <i className="fa fa-plus"></i> Adicionar Fotos
                                        <input ref={myRef} type="file" className="d-none" name="new-photo" id="new-photo" accept="image/*" onChange={storePhoto} accept="image/png, image/jpeg"/>
                                </label>
                            </form>
                        </span>
                    </div>
                </div>
                <div className="row mt-4 justify-content-center">
                    {                         
                        (photos.length > 0)
                        ?
                            photos.map(photo => (
                                <div key={photo.id} className="col-md-4 mt-2">
                                    <div className="photo-item">
                                        <div className="bkg-settings h-100 photo-bkg cursor-pointer"  style={{background: "url("+ photo.url +")"} } onClick={() => setLightboxSource(photo.url)}>
                                            <div className="overlay-photo-item" onClick={() => setLightboxSource(photo.url)}/>
                                        </div>
                                        <div id="destroy-photo" className="row m-0 w-100 align-items-end justify-content-end h-100">
                                            <div className="col-md-12 text-right h-100">
                                                <img className="trash-icon cursor-pointer" src={Trash} alt="Excluir" title="Excluir" width="30" onClick={() => destroyPhoto(photo.id)}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) 
                        :
                            <p>Ainda não tenho nenhuma foto! :(</p>
                    }
                </div>
            </div>
        </div>
        {
            (loadingUploadPhoto)
            ?
                <div id="loading">
                    <img src={Loading} alt="Carregando"/>
                </div>
            :
                null
        }
        {
            (lightboxSource)
            ?
                <div id="lightbox">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 text-right">
                                <img src={Close} alt="Fechar" className="cursor-pointer" title="Fechar" width="30" height="30" onClick={() => setLightboxSource('')}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <img id="image-lightbox" src={lightboxSource} alt=""/>
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