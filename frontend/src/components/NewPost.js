import React from 'react';


//Assets
import '../assets/css/new-post/main.css';
export default function NewPost(){
    return(
        <div id="new-post">
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-12">
                        <h1>Compartilhe algo</h1>
                        <textarea name="post" id="post" cols="30" rows="5" className="w-100"></textarea>
                    </div>
                </div>
                <div className="row text-right mt-2 mb-3">
                    <div className="col-md-12">
                        <button className="btn btn_main">Compartilhar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}