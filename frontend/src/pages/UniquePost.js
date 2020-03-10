import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
//Services
import Api from '../services/api'

//Assets
import Send from '../assets/images/icons/send.svg' 
import Avatar from '../assets/images/avatar.svg' 
import '../assets/css/timeline/main.css';
import Close from '../assets/images/icons/close-white.svg' 
export default function UniquePost({match}){
    
    const [post, setPost ] = useState([]);
    const [commentsList, setCommentsList] = useState([])
    const [comment, setComment] = useState('');
    const [moreOptionsActive, setMoreOptionsActive] = useState();
    const [commentsQuantity, setCommentsQuantity] = useState(0);
    const [lightboxSource, setLightboxSource] = useState('');

    document.onkeydown = (evt) => {
        evt = evt || window.event;
        if (evt.keyCode == 27 && lightboxSource) {
            setLightboxSource('');
        }
    };

    useEffect(() => {
        async function loadPost(){
            const response = await Api.get(`/show/posts/${match.params.id}`, {
                    headers: { Authorization: "Bearer " + localStorage.getItem('token') }
                });
                setPost([...response.data.post]);
                setCommentsList([...response.data.comments]);
                setCommentsQuantity(response.data.post[0].comments_quantity)
            }
        loadPost();
    }, [match.params.id])

    function handleMoreOptions(id){
        setMoreOptionsActive(id);
    }

    async function storeComment(e){
        e.preventDefault();
        const response = await Api.post(`/comments`, {
            comment,
            postId: post[0].id,
            type: 'post'
        }, {
            headers: { 
                Authorization: "Bearer " + localStorage.getItem('token') 
            }
        })
        setCommentsQuantity(commentsQuantity + 1)
        setCommentsList([...commentsList, response.data]);
        setComment('');
    }

    async function destroyPost(id){
        await Api.delete(`/posts/${id}`,{
            headers: { 
                Authorization: "Bearer " + localStorage.getItem('token') 
            }
        })
        window.location.href = '/'
    }

    async function destroyComment(id){
        await Api.delete(`/comments/${post[0].id}/${id}`,{
            headers: { 
                Authorization: "Bearer " + localStorage.getItem('token') 
            }
        })
        setCommentsQuantity(commentsQuantity - 1);
        setCommentsList(commentsList.filter(comment => comment._id !== id));

    }

    async function editComment(id){
        await Api.delete(`/posts/${id}`,{
            headers: { 
                Authorization: "Bearer " + localStorage.getItem('token') 
            }
        })
        window.location.href = '/'
    }
    
    return(
        <> 
            {
                (!post.length > 0)
                ?
                    null
                :
                <div id="timeline">
                    <div className="container">
                        <div className="row">
                        <div id="post" className="box-post w-100 mt-3">
                    <div className="col-md-12 ">
                    {
                        (post.length > 0 && localStorage.getItem('id') === post[0].User.id)
                        ?
                            <div className="row justify-content-end">
                                <button className="remove-attributes-button cursor-pointer" onClick={() => destroyPost(post[0].id)}><i className="fa fa-trash c-gray fs-20" title="Excluir"></i></button>
                            </div>
                        :
                        <>
                            <div className="row justify-content-end">
                                <i className="fa fa-ellipsis-h c-gray" onClick={() => handleMoreOptions(post[0].id)}></i>
                            </div>
                            <div className="row mt-2 justify-content-end">
                                <div className="more-details">
                                    <ul>
                                        {/* <li className="text-left">
                                            <Link to="#">Ver Perfil</Link>
                                        </li> */}
                                        <li className="text-left">
                                            <Link to={(post.length) ? `/mensagens/${post[0].User.id}` : '#'}>Enviar Mensagem</Link>
                                        </li>
                                        <li className="text-left">
                                            <Link to="#">Deixar de Seguir</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>    
                        </>
                    }
                    
                <div className="row align-items-center">
                    <div className="col-4 col-sm-3 col-md-2 col-lg-2">
                        <img src={(post.length && post[0].User.avatar) ? post[0].User.avatar.url : Avatar} alt="" width="150" height="150" className="post-avatar rounded-circle mb-0" />
                    </div>
                    <div className="col-8 col-sm-9 col-md-10 col-lg-10">
                        <p className="person-name mb-0">{(post.length) ? post[0].User.name : ''}</p>
                        {/* <p className="date-post mb-0">3 horas atrás</p> */}
                    </div>
                </div> 
                <div className="row mt-3 bb-1-gray content-post">
                    <div className="col-md-12">
                        <p>{post[0].subtitle}</p>
                        {
                            (post[0].path != null)
                            ?
                                <img src={post[0].url} width="100%" height="300" className="of-cover" onClick={() => setLightboxSource(post[0].url)}/>
                            :
                            null
                        }
                    </div>
                </div>  
                <div className="row my-3">
                    {/* <div className="col-3 col-md-2 col-lg-1 text-center-sm ">
                        <i className="fa fa-heart-o c-primary"></i> <span className="c-gray">{(post[0].quantityLikes) ? post[0].quantityLikes : 0}</span>
                    </div> */}
                    <div className="col-3 col-md-2 col-lg-2 text-center-sm cursor-pointer">
                        <i className="fa fa-commenting-o"></i> <span className="c-gray">{commentsQuantity}</span>
                    </div>
                    <div className="col-6 col-md-8 col-lg-10 text-center-sm  text-right">
                        <span className="c-gray cursor-pointer" >Comentar <i className="fa fa-edit"></i></span>
                    </div>
                </div> 
                <div id="comments-block" className={"row align-items-center active"}>
                    <div className="col-md-12 p-0">
                        <div id="list-comments" className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    {
                                        commentsList.map((comment, index) => (
                                            <div key={index} className="comment row align-items-center mt-2 pb-2 bb-1">
                                                <div className="col-3 col-md-1 text-center">
                                                    <img src={(comment.avatar) ? comment.avatar : Avatar} width="40" height="40" className="br-50 of-cover mb-0"/>
                                                </div>
                                                <div className="col-9 col-md-10">
                                                    <p className="fs-15 m-0">{comment.comment}</p>
                                                </div>
                                                <div className="col-md-1 text-center">
                                                    {
                                                        (parseInt(localStorage.getItem('id')) === comment.user)
                                                        ?
                                                            <>
                                                                    <button className="remove-attributes-button cursor-pointer" onClick={() => destroyComment(comment._id)}><i className="fa fa-trash c-gray fs-20" title="Excluir"></i></button>
                                                                    <button className="remove-attributes-button cursor-pointer ml-2" onClick={() => editComment(comment._id)}><i className="fa fa-pencil c-gray fs-20" title="Editar"></i></button>
                                                            </>
                                                        :
                                                            (parseInt(localStorage.getItem('id')) === post[0].User.id)
                                                            ?
                                                                <button className="remove-attributes-button cursor-pointer" onClick={() => destroyComment(comment._id)}><i className="fa fa-trash c-gray fs-20" title="Excluir"></i></button>
                                                            :
                                                            null
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <form className="new-comment row align-items-center" onSubmit={storeComment}>
                            <div className="col-10 col-md-11">
                                <input type="text" 
                                    name="new_comment" 
                                    id="new_comment" 
                                    className="w-100" 
                                    placeholder="Escreva um comentário"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    />
                            </div>
                            <div className="col-2 col-md-1 text-center">
                                <button>
                                    <img src={Send} alt="Comentar" title="Comentar" width="20" height="20" className="mb-0"/>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
                        </div>
                    </div>
                </div>
                
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