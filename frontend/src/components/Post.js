import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import Noty from 'noty';

//Service
import Api from '../services/api';

//Assets
import Send from '../assets/images/icons/send.svg' 
import Avatar from '../assets/images/avatar.svg' 
import Close from '../assets/images/icons/close-white.svg' 

export default function Post(props){
    const [content, setContent] = useState(props.post.subtitle);
    const [editPostContent, setEditPostContent] = useState();
    const [showEditPost, setShowEditPost] = useState(false);
    const [editCommentId, setEditCommentId] = useState();
    const [moreOptionsActive, setMoreOptionsActive] = useState(false);
    const [commentsList, setCommentsList] = useState([]);
    const [showCommentsBlock, setShowCommentsBlock] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comment, setComment] = useState('');
    const [commentsQuantity, setCommentsQuantity] = useState(0);
    const [postId, setPostId] = useState();
    const [lightboxSource, setLightboxSource] = useState('');

    document.onkeydown = (evt) => {
        evt = evt || window.event;
        if (evt.keyCode == 27 && lightboxSource) {
            setLightboxSource('');
        }
    };
    
    async function handleUnfollow(userID){
        await Api.put('/followers', {
            user_followed: userID
        },
        {
            headers: { Authorization: "Bearer " + localStorage.getItem('token') }
        }).then((response) => {
            window.location.href = '/';
        }).catch((error) => {
            new Noty({
                theme    : 'mint',
                closeWith: ['click', 'button'],
                layout: 'topRight',
                timeout: 8000,
                type: 'error',
                text: 'Houve um problema ao desfazer a amizade.',
            }).show();
        })
    }

    async function handleFollow(userID){
        await Api.post('/followers', {
            user_followed: userID
        }, {
            headers: { 
                Authorization: "Bearer " + localStorage.getItem('token') 
            }
        });
        window.location.href = '/';
    }

    function handleMoreOptions(){
        setMoreOptionsActive(true);
    }

    async function loadComments(id){
        setShowCommentsBlock(true)
        const response = await Api.get(`/comments/${id}`, {
            headers: { 
                Authorization: "Bearer " + localStorage.getItem('token') 
            }
        });
        setCommentsList([...response.data])
    }

    useEffect(() => {
        setCommentsQuantity(props.post.comments_quantity);
        setPostId(props.post.id);
    }, [props.post.comments_quantity, props.post.id])

    async function storeComment(e){
        e.preventDefault();
        const response = await Api.post(`/comments`, {
            comment: newComment,
            postId,
            type: 'post'
        }, {
            headers: { 
                Authorization: "Bearer " + localStorage.getItem('token') 
            }
        })
        setCommentsList([...commentsList, response.data]);
        setCommentsQuantity(commentsQuantity + 1)
        setNewComment('');
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
        await Api.delete(`/comments/${postId}/${id}`,{
            headers: { 
                Authorization: "Bearer " + localStorage.getItem('token') 
            }
        })
        setCommentsQuantity(commentsQuantity - 1);
        setCommentsList(commentsList.filter(newComment => newComment._id !== id));

    }

    function setEditComment(id, oldComment){
        setEditCommentId(id);
        setComment(oldComment);
    }

    async function handleCommentUpdate(commentId){
        if(comment){
            const response = await Api.put('/comments', {
                comment,
                id: commentId
            }, {
                headers: { 
                    Authorization: "Bearer " + localStorage.getItem('token') 
                }
            })
            setCommentsList(commentsList.map(comment => {
                return comment._id === commentId ? {...comment, ...response.data} : comment
            }));
        }
        setEditCommentId(0);
    }

    async function handlePostUpdate(){
        if(editPostContent){
            await Api.put('/posts', {
                content: editPostContent,
                id: postId
            }, {
                headers: { 
                    Authorization: "Bearer " + localStorage.getItem('token') 
                }
            })
            setContent(editPostContent);
            
        }
        setShowEditPost(false);
    }

    document.body.addEventListener('click', () => {
        setMoreOptionsActive(false);
    }); 

    return(
        <>
        <div id="post" className="box-post w-100 mt-3">
            <div className="col-md-12">
                    {
                        (localStorage.getItem('id') == props.post.user_id)
                        ?
                            <div className="row justify-content-end">
                                {
                                    (showEditPost)
                                    ?
                                    <>
                                        <button className="remove-attributes-button cursor-pointer" onClick={() => setShowEditPost(false)}><i className="fa fa-times-circle c-gray fs-20" title="Cancelar"></i></button>
                                        <button className="remove-attributes-button cursor-pointer ml-2" onClick={() => handlePostUpdate()}><i className="fa fa-check-circle c-gray fs-20" title="Editar"></i></button>
                                    </>
                                    :
                                    <>
                                        <button className="remove-attributes-button cursor-pointer" onClick={() => destroyPost(props.post.id)}><i className="fa fa-trash c-gray fs-20" title="Excluir"></i></button>
                                        <button className="remove-attributes-button cursor-pointer ml-2" onClick={() => {
                                            setShowEditPost(true);
                                            setEditPostContent(content)
                                        }}><i className="fa fa-pencil c-gray fs-20" title="Editar"></i></button>
                                    </>
                                }
                            </div>
                        :
                        <>
                            <div className="row justify-content-end">
                                <i className="fa fa-ellipsis-h c-gray" onClick={() => handleMoreOptions()}></i>
                            </div>
                            <div className="row mt-2 justify-content-end">
                                <div id={ (moreOptionsActive) ? 'active' : '' } className="more-details">
                                    <ul>
                                        {/* <li className="text-left">
                                            <Link to="#">Ver Perfil</Link>
                                        </li> */}
                                        <li className="text-left">
                                            <Link to={`/mensagens/${props.post.user_id}`}>Enviar Mensagem</Link>
                                        </li>
                                        {
                                            (props.post.user_id !== 1 && !props.randomPosts)
                                            ?
                                                <li className="text-left">
                                                    <button className="remove-attributes-button" onClick={() => handleUnfollow(props.post.user_id)} >Deixar de Seguir</button>
                                                </li>
                                            :
                                                null
                                        }
                                        {
                                            (props.randomPosts)
                                            ?
                                                <li className="text-left">
                                                    <button className="remove-attributes-button" onClick={() => handleFollow(props.post.user_id)}>Seguir</button>
                                                </li>
                                            :
                                                null
                                        }
                                    </ul>
                                </div>
                            </div>    
                        </>
                    }
                    
                <div className="row align-items-center">
                    <div className="col-3 col-sm-3 col-md-2 col-lg-1 pr-3">
                        <img src={(props.post.User.avatar) ? props.post.User.avatar.url : Avatar} alt="" width="80" height="80" className="post-avatar rounded-circle mb-0" />
                    </div>
                    <div className="col-8 col-sm-9 col-md-10 col-lg-10 pl-0">
                        <p className="person-name mb-0">{props.post.User.name}</p>
                        {/* <p className="date-post mb-0">3 horas atrás</p> */}
                    </div>
                </div> 
                <div className="row mt-3 bb-1-gray content-post">
                    <div className="col-md-12 text-center">
                        {
                            (showEditPost)
                            ?
                                <textarea name="edit-post"
                                    id="edit-post"
                                    cols="30"
                                    rows="5"
                                    className="w-100" value={editPostContent} onChange={(e) => setEditPostContent(e.target.value)}>
                                </textarea>
                            :
                                <p className="text-left" dangerouslySetInnerHTML={{__html: content}}></p>
                        }
                        {
                            (props.post.path != null)
                            ?
                                <img src={props.post.url} width="50%" height="300" className="of-cover cursor-pointer" onClick={() => setLightboxSource(props.post.url)}/>
                            :
                            null
                        }
                    </div>
                </div>  
                <div className="row my-3">
                    {/* <div className="col-3 col-md-2 col-lg-1 text-center-sm ">
                        <i className="fa fa-heart-o c-primary"></i> <span className="c-gray">{(props.post.quantityLikes) ? props.post.quantityLikes : 0}</span>
                    </div> */}
                    <div className="col-3 col-md-2 col-lg-2 text-center-sm cursor-pointer" onClick={() => loadComments(props.post.id)}>
                        <i className="fa fa-commenting-o"></i> <span className="c-gray">{(commentsQuantity) ? commentsQuantity : 0}</span>
                    </div>
                    <div className="col-6 col-md-8 col-lg-10 text-center-sm  text-right">
                        <span className="c-gray cursor-pointer" onClick={() => loadComments(props.post.id)}>Comentar <i className="fa fa-edit"></i></span>
                    </div>
                </div> 
                <div id="comments-block" className={"row align-items-center " + ((showCommentsBlock) ? 'active' : '')}>
                    <div className="col-md-12 p-0">
                        <div id="list-comments" className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    {
                                        commentsList.map((item, index) => (
                                            <div key={item._id} className="newComment row align-items-center mt-2 pb-2 bb-1">
                                                <div className="col-3 col-md-1 text-center">
                                                    <img src={(item.avatar) ? item.avatar : Avatar} width="40" height="40" className="br-50 of-cover mb-0"/>
                                                </div>
                                                <div className="col-9 col-md-10">
                                                    {
                                                        (editCommentId === item._id)
                                                        ?
                                                            <input
                                                                type="text"
                                                                name="newComment"
                                                                id="newComment"
                                                                value={comment}
                                                                onChange={(e) => setComment(e.target.value)}
                                                                maxLength="200"
                                                                className="w-100 comment-edit"/>
                                                        :
                                                            <p className="fs-15 m-0">{item.comment}</p>
                                                    }
                                                </div>
                                                <div className="col-md-1 text-center">
                                                    {
                                                        (parseInt(localStorage.getItem('id')) === item.user)
                                                        ?
                                                            <>
                                                                    {
                                                                        (editCommentId === item._id)
                                                                        ?
                                                                        <>
                                                                            <button 
                                                                                className="remove-attributes-button cursor-pointer ml-2" 
                                                                                onClick={() => {
                                                                                    setComment('');
                                                                                    setEditCommentId(0);
                                                                                }}>
                                                                                    <i className="fa fa-times-circle c-gray fs-20" title="Cancelar"></i>
                                                                            </button>
                                                                            <button className="remove-attributes-button cursor-pointer ml-2" onClick={() => handleCommentUpdate(item._id)}><i className="fa fa-check-circle c-gray fs-20" title="Editar"></i></button>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <button className="remove-attributes-button cursor-pointer" onClick={() => destroyComment(item._id)}><i className="fa fa-trash c-gray fs-20" title="Excluir"></i></button>
                                                                            <button className="remove-attributes-button cursor-pointer ml-2" onClick={() => setEditComment(item._id, item.comment)}><i className="fa fa-pencil c-gray fs-20" title="Editar"></i></button>
                                                                        </>
                                                                    }
                                                            </>
                                                        :
                                                            (parseInt(localStorage.getItem('id')) === props.post.user_id)
                                                            ?
                                                                <button className="remove-attributes-button cursor-pointer" onClick={() => destroyComment(item._id)}><i className="fa fa-trash c-gray fs-20" title="Excluir"></i></button>
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
                                    value={newComment}
                                    maxLength="200"
                                    onChange={(e) => setNewComment(e.target.value)}
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