import React from 'react';
import { Link } from 'react-router-dom';
import Api from '../services/api';
//Assets
import Background from '../assets/images/background.png'
import Trash from '../assets/images/icons/trash.svg'

export default function AlbumItem(props){
    async function destroyAlbum(id){
        const response = await Api.post('/albuns', {
            name: albumName
        },{
            headers: { Authorization: "Bearer " + localStorage.getItem('token') }
        })
        setAlbumItens([response.data])
    }
    return(
        <div className="col-md-3 mt-3 album-item" style={{background: "linear-gradient(0deg,rgba(0,0,0,0.3),rgba(0,0,0,0.3)), url(" + props.path + ")"} }>
            <Link to={"/albuns/" + props.albumID}>
                <div className="row album-information w-100">
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md-12 d-flex align-items-center">
                                <i className="fa fa-image c-white"></i>
                                <h2 className="ml-2 album-name c-white mb-0 pb-0">
                                    {props.name}
                                </h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <span className="quantity-photos c-white fs-13">
                                    {props.quantityPhotos}
                                </span>
                            </div>
                        </div>
                    </div>  
                    <div className="col-md-6">
                        <div className="row h-100 align-items-end">
                            <div className="col-md-12 text-right">
                                <img className="trash-icon mb-0" src={Trash} alt="Excluir" width="30" onClick={() => destroyAlbum(props.albumID)}/>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}