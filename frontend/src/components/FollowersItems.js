import React from 'react';


import Avatar from '../assets/images/avatar.png';
export default function FollowersItems(){
    return(
        <div className="col-6 col-md-4 mt-2 divisor-bottom text-center-sm">
            <div className="row align-items-center">
                <div className="col-md-4">
                    <img className="friend-avatar of-cover" src={Avatar} alt="" width="90" height="90"/>
                </div>
                <div className="col-md-8">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="friend-name mb-0 pb-2">
                                Yasmin Lanza
                            </h2>
                        </div>
                        <div className="col-md-12">
                            <span className="quantity-friends c-gray fs-15">
                                12 amigas
                            </span>
                        </div>
                        <div className="col-md-12">
                            <span className="remove-friend c-gray fs-15">
                                Desfazer amizade
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}