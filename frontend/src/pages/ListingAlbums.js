import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Api from '../services/api';
//Components
// import AlbumItem from '../components/AlbumItem'

//Assets
import '../assets/css/album/listing.css'
import Close from '../assets/images/icons/close.svg' 
import NoImage from '../assets/images/no-image.png'
import Trash from '../assets/images/icons/trash.svg'

export default function ListinAlbums(){
    const [showInputAlbumName, setShowInputAlbumName] = useState(false);
    const [albumName, setAlbumName] = useState('');
    const [albumItens, setAlbumItens] = useState([]);
    
    useEffect(() => {
        async function loadAlbums(){
            const response = await Api.get('/albuns', {
                headers: { Authorization: "Bearer " + localStorage.getItem('token') }
            });
            setAlbumItens([...response.data]);
        }
        loadAlbums();
    }, [])

    async function storeAlbum(e){
        e.preventDefault();
        const response = await Api.post('/albuns', {
            name: albumName
        },{
            headers: { Authorization: "Bearer " + localStorage.getItem('token') }
        })
        setAlbumItens([response.data, ...albumItens]);
        setShowInputAlbumName(false)
        setAlbumName('')
    }

    async function destroyAlbum(id){
        const response = await Api.delete(`/albuns/${id}`,{
            headers: { Authorization: "Bearer " + localStorage.getItem('token') }
        })
        if(response.data === 201){
            setAlbumItens(albumItens.filter(album => (id !== album.id)))
        }
    }
    return(
        <div id="listing-albums">
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-12">
                        <h1>Meus Álbuns</h1>
                    </div>
                </div>
                <div className="add-new-album row mt-2">
                    <div className="col-md-12 d-flex align-items-center">
                        <hr/>
                        <span className={"text-left-sm text-right" + ((showInputAlbumName) ? " d-none" : "")} onClick={() => setShowInputAlbumName(true)}>
                            <i className="fa fa-plus"></i> Adicionar novo
                        </span>
                        {
                            (showInputAlbumName)
                            ?
                                <form id="store-album" onSubmit={storeAlbum} className="row">
                                    <input
                                    type="text"
                                    name="album_name"
                                    id="album_name"
                                    value={albumName}
                                    onChange={(e) => setAlbumName(e.target.value)}
                                    placeholder="Digite o nome do álbum"
                                    />
                                    <button type="submit" id="submit-store-album" className="remove-attributes-button cursor-pointer">
                                        <i className="fa fa-plus"/>
                                    </button>
                                    <img src={Close} alt="Fechar" title="Fechar" width="20" height="20" className="ml-2 mb-0 cursor-pointer" onClick={() => setShowInputAlbumName(false)}/>
                                </form>
                            : 
                                null
                        }
                    </div>
                </div>
                <div className="row mt-4 justify-content-center">
                    {
                        (albumItens.length > 0)
                        ?
                        albumItens.map(album => {
                            return (
                                <div key={album.id} className="col-md-3 mt-3 album-item" style={{background: "linear-gradient(0deg,rgba(0,0,0,0.3),rgba(0,0,0,0.3)), url(" + ((album.path) ? `${process.env.REACT_APP_STORAGE_LOCATION}/${album.path}` : NoImage) + ")" }}>
                                    <Link to={"/albuns/" + album.id}>
                                        <div className="row album-information w-100">
                                            <div className="col-md-6">
                                                <div className="row">
                                                    <div className="col-md-12 d-flex align-items-center">
                                                        <i className="fa fa-image c-white"></i>
                                                        <h2 className="ml-2 album-name c-white mb-0 pb-0">
                                                            {album.name}
                                                        </h2>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <span className="quantity-photos c-white fs-13">
                                                            {(album.quantityphotos) ? album.quantityphotos : 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>  
                                        </div>
                                    </Link>
                                    <div className="trash-box row position-absolute destroy-album cursor-pointer">
                                        <div className="col-md-12">
                                            <div className="row h-100 align-items-end">
                                                <div className="col-md-12 text-right">
                                                    <img className="trash-icon mb-0" src={Trash} alt="Excluir" width="30" onClick={() => destroyAlbum(album.id)}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <p>Você ainda não possui nenhum álbum</p>
                    }
                </div>
            </div>
        </div>
    );
}