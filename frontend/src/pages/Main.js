import React, {useState, useEffect, createRef} from 'react';
import Noty from 'noty';

//Service
import Api from '../services/api';

//Components
import Post from '../components/Post'

//Assets
import '../assets/css/timeline/main.css';
import '../assets/css/new-post/main.css';
import Avatar from '../assets/images/avatar.svg'
import Picture from '../assets/images/icons/picture.svg';
import Close from '../assets/images/icons/close-background.svg';
import Loading from '../assets/images/icons/loading-upload.gif' 

export default function Main(){
    
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState([]);
    const [imagePost, setImagePost] = useState();
    const [imagePostPreview, setImagePostPreview] = useState();
    const myRef = createRef();
    const limitPosts = 10;
    const [page, setPage] = useState(0);
    const [quantityPages, setQuantityPages] = useState(0);
    const [loadingMorePost, setLoadingMorePost] = useState(false);
    const [randomPosts, setRandomPosts] = useState([]);
    
    const [keys, setKeys] = useState([])

    useEffect(() => {
        async function loadPosts(){
            const response = await Api.get(`/posts/${page}`, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token') }
            });

            if(page === 0){
                setRandomPosts([...response.data.randomPosts]);
                setPosts([...response.data.posts]);
                setQuantityPages(Math.ceil(response.data.quantityPosts / limitPosts))
            }else{
                setPosts([...posts, ...response.data.posts]);
                setLoadingMorePost(false);
            }
        }
        loadPosts();
    }, [page]);

    async function storePost(e){
        e.preventDefault();
        if(imagePost && imagePost.size > (4 * 1024 * 1024)){
            new Noty({
                theme    : 'mint',
                closeWith: ['click', 'button'],
                layout: 'topRight',
                timeout: 8000,
                type: 'error',
                text: 'Tamanho excedido. A foto deve conter no máximo 4Mb.',
            }).show();
            
        }else{
            let formData = new FormData();
            if(imagePost){
                formData.append('avatar', ...imagePost)
            }
            formData.append('subtitle', content);
            const response = await Api.post('/posts', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: "Bearer " + localStorage.getItem('token') 
                }
            })
            
            setPosts([response.data, ...posts]);
            setImagePost();
            setContent('');
        }
    }

    function setPhoto(file){
        setImagePost([file]);
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePostPreview(e.target.result)
        }
        reader.readAsDataURL(file)
    }

    function removePhoto(){
        setImagePost()
        setImagePostPreview()
    }

    window.onscroll = function() {
        var d = document.documentElement;
        var offset = d.scrollTop + window.innerHeight;
        var height = d.offsetHeight;
        if (offset === height && quantityPages > page){
            setLoadingMorePost(true);
            setPage(page + 1)
        }
      };

    return (
        <>
            <form onSubmit={storePost}>
                <div id="new-post">
                    <div className="container">
                        <div className="row mt-5">
                            <div className="col-md-12">
                                <h1>Compartilhe algo</h1>
                                <div id="content-new-post" className="position-relative">
                                    <textarea name="post"
                                        id="post"
                                        cols="30"
                                        rows="5"
                                        className="w-100" value={content} onChange={(e) => setContent(e.target.value)}>
                                    </textarea>
                                    {
                                        (!imagePost) 
                                        ?
                                            <label htmlFor="post-image">
                                                <img id="add-image-post" src={Picture} alt="Adicionar imagem" title="Adicionar imagem" width="20" height="20" className="position-absolute mb-0"/>
                                                <input 
                                                    ref={myRef}
                                                    type="file"
                                                    name="post-image"
                                                    id="post-image"
                                                    value={imagePost}
                                                    className="d-none" onChange={(e) => setPhoto(e.target.files[0])}/>
                                            </label>
                                        :
                                        <div className="row mt-3">
                                            <div className="col-12 col-md-2">
                                                <div id="image-post-listing" className="bkg-settings position-relative" style={{background: "url("+ imagePostPreview +")"} }>
                                                    <div className="overlay-image-post w-100 h-100">
                                                        <img src={Close} alt="Remover foto" title="Remover foto" className="remove-post-image position-absolute cursor-pointer" width="20" height="20" onClick={() => removePhoto()}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="row text-right mt-2 mb-3">
                            <div className="col-md-12">
                                <button className="btn btn_main">Compartilhar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div id="timeline" className="mt-5">
                <div className="container">
                    <div className="row">
                        { 
                            (posts.length > 0) 
                            ?
                            
                            posts.map((post, index) => (
                                    <Post key={post.id + '-' +index} post={post} />
                            )) 
                            :
                            <p>Você ainda não possui nenhum post!</p>
                        }
                    </div>
                    <div id="timeline-bottom" className="row justify-content-center py-4">
                        {
                            (loadingMorePost)
                            ?
                                <img src={Loading} alt="Carregando" className="mb-0" width="30"/>
                            :
                                (page === quantityPages)
                                ?   
                                    <>
                                        <div className="col-md-12">
                                            <div className="title-without-posts">
                                                <div className="row px-3">
                                                    <div className="col-md-12 text-center">
                                                        <span>Os posts acabaram</span>
                                                        {
                                                            (randomPosts.length)
                                                            ?
                                                                <h2>Fique por dentro do que está acontecendo na comunidade!</h2>
                                                            :
                                                                null
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            (randomPosts.length > 0) 
                                            ?
                                            randomPosts.map((post, index) => (
                                                    <Post key={post.id}  post={post} randomPosts={true}/>
                                                )) 
                                            :
                                            null
                                        }
                                    </>
                                :
                                null
                        }
                    </div>
                </div>
            </div>
        </>
    );
}