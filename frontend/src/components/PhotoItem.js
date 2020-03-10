import React from 'react';


//Assets
import Trash from '../assets/images/icons/trash.svg'

export default function PhotoItem(props){
    function removePhoto(id){
    }
    return(
        <div className="col-md-4 mt-2">
            <div className="photo-item bkg-settings"  style={{background: "url("+props.path +")"} } >
                <div className="overlay-photo-item">
                    <div className="row align-items-end justify-content-end h-100">
                        <div className="col-md-12 text-right">
                            <img className="trash-icon" src={Trash} alt="Excluir" width="30" onClick={() => removePhoto(props.id)}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}