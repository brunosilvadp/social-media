import React from 'react';

//Components
import Post from '../components/Post'

export default function Timeline({ match }){
    return(
        <div id="timeline" className="mt-5">
            <div className="container">
                <div className="row">
                    { 
                        posts.map(post => (
                                <Post key={post.id} id={post.id} avatar={post.avatar} name={post.name} content={post.content}/>
                            )) 
                    }
                </div>
            </div>
        </div>
    );
}