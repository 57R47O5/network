let pagina = 1
document.addEventListener('DOMContentLoaded', function() {

    // Usamos los botones para elegir entre diferentes vistas
    document.querySelector("#id_following").addEventListener('click',()=>{
        let Objetousuario = {Todo:false, User:0, Seguidos: true};
        cargar_posts(pagina, Objetousuario);

    })


    //Por default, cargamos todos los posts y el form
    document.querySelector("#timeline").style.display = 'block'
    document.querySelector("#perfil").style.display = 'none'
    document.querySelector("#nuevo-post").style.display = 'block'

    let Objetousuario = {Todo:true, User:0, Seguidos: false};
    cargar_posts(pagina, Objetousuario)
    
    
    //Recibimos el form cuando se envia
    document.querySelector('#form-nuevo-post').onsubmit = () => {

        const imagen = document.querySelector('#newpost_Imagen').value;
        const texto = document.querySelector('#newpost_Texto').value;
        const usuario = document.querySelector('#newpost_User').value;
        const likes = document.querySelector("#id_Likes").value;

        //Enviamos el form    

        fetch('/postear',{
            method: 'POST',
            body: JSON.stringify({
                imagen: imagen,
                texto: texto,
                usuario: usuario,                                
            })                                
        })        
        .then(response => response.json())
        .then(result=>{
            console.log(result);
        })

        //cargar_form()
        return false;
    };  

    //cargar_form()
})

//Vemos los posts
function cargar_posts(pagina, usuario){

    // Ocultamos el perfil. Por que funciona con querySelector y no con getelementbyID?
    
    document.querySelector("#timeline").style.display = 'block'

    //Reseteamos el timeline
    document.querySelector("#timeline").innerHTML = ""

    // Seteamos la variable children
    let children=0;
    // Y la variable global previo_post
    previo_post = -1;

    //Cargamos los posts. Recibimos como un solo objeto Json. Hay que cortar
    fetch('/posts/' + pagina, {
        method: 'POST',
        body: JSON.stringify(usuario)
    })
    .then(response => response.json())
    .then(posts => {        
        for (let i=0; i<posts.length; i++){
            let PostDiv = document.createElement("div");            
            PostDiv.id = "post-" + posts[i].id;  
            PostDiv.classList.add("post");          
            let UserDiv = document.createElement("div");
            UserDiv.id = "post-" + posts[i].id + "-User";
            UserDiv.innerHTML = posts[i].User;            
            let UserIdDIv = document.createElement("div");
            UserIdDIv.id = "post-" + posts[i].id + "-UserId";
            UserIdDIv.value = posts[i].User_id;
            UserIdDIv.style.display = 'none';
            let TextoDiv = document.createElement("div");
            TextoDiv.id = "post-" + posts[i].id + "-Texto";
            TextoDiv.innerHTML = posts[i].Texto;
            let LikesDiv = document.createElement("div");
            LikesDiv.id = "post-" + posts[i].id + "-Likes";
            LikesDiv.innerHTML = posts[i].Likes;
            let TimestampDiv = document.createElement("div");
            TimestampDiv.id = "post-" + posts[i].id + "-Timestamp";
            TimestampDiv.innerHTML = posts[i].Timestamp;           
            let ButtonLike = document.createElement("button");
            ButtonLike.id = "-Button-like-post-" + posts[i].id;
            ButtonLike.innerHTML = "Me gusta";
            ButtonLike.classList.add("button-post");
            ButtonLike.style.display='none';
            let ButtonUnLike = document.createElement("button");
            ButtonUnLike.id = "-Button-unlike-post-" + posts[i].id;
            ButtonUnLike.innerHTML = "Ya no me gusta";
            ButtonUnLike.classList.add("button-post1");
            ButtonUnLike.style.display='none';
            

            PostDiv.appendChild(UserDiv);
            UserDiv.appendChild(UserIdDIv);
            UserDiv.addEventListener('click', function(e){
                usuario = e.target.firstElementChild.value;
                perfil(usuario);                
            })
            PostDiv.appendChild(TextoDiv);
            PostDiv.appendChild(LikesDiv);
            PostDiv.appendChild(TimestampDiv);
            PostDiv.appendChild(ButtonLike);
            PostDiv.appendChild(ButtonUnLike);
            
            document.querySelector("#timeline").appendChild(PostDiv);
            
            
        };        
        console.log(posts);        
        children = document.querySelector("#timeline").childElementCount;


        if(pagina==1){
            document.querySelector("#page-item-1").style.display='none';
            document.querySelector("#page-item-anterior").style.display='none';
        }
        else{
            document.querySelector("#page-item-1").style.display='block'
            document.querySelector("#page-item-anterior").style.display='block'
        };
        document.querySelector("#page-item-1").firstChild.innerHTML = pagina - 1;    
        document.querySelector("#page-item-2").firstChild.innerHTML = pagina;
        if(children<10){
            document.querySelector("#page-item-3").style.display='none';
            document.querySelector("#page-item-siguiente").style.display='none';
        }
        else{
            document.querySelector("#page-item-3").style.display='block';
            document.querySelector("#page-item-siguiente").style.display='block';
        };
        document.querySelector("#page-item-3").firstChild.innerHTML = pagina + 1;
    });

        
}   


function cargar_form(){
    
    //Mostramos el div ocultamos el perfil
    document.querySelector("#nuevo-post").style.display = 'block'
    document.querySelector("#perfil").style.display = 'none'

    //Reseteamos el form    
    document.getElementById("id_Texto").value = '';
}

function perfil(usuario){

    // Ocultamos las vistas que no nos interesan
    document.getElementById("nuevo-post").style.display = 'none';
    document.getElementById("timeline").style.display = 'block';
    document.getElementById("perfil").style.display = 'block';

    let usuariolog = document.querySelector("#div_user").innerHTML;

    //Si estamos viendo nuestro perfil, ocultamos el div de seguimiento
    if (usuario==usuariolog){document.querySelector("#div-seguir").style.display = 'none'}
    else{document.querySelector("#div-seguir").style.display = 'block'}

    //Llamamos a perfil en views. De ahi debemos obtener una lista con todos los posts del usuario
    let Objetousuario = {Todo:false, User:usuario, Seguidos: false};
    cargar_posts(pagina, Objetousuario);


    fetch('/perfil/' + usuario)
    .then(response => response.json())
    .then (datos => {
        let nombre = datos.nombre;
        console.log(datos);
        document.querySelector("#nombre-perfil").innerHTML = nombre;
        seguimiento(datos.Mesigue, datos.Lesigo)
    })
    
    document.querySelector('#follow-button').addEventListener('click', ()=>{      
      let seguido = usuario;  
      let seguidor = usuariolog;    
      seguir(seguidor, seguido);
    })
    document.querySelector('#unfollow-button').addEventListener('click', ()=>{      
        let seguido = usuario;  
        let seguidor = usuariolog;    
        dejar_de_seguir(seguidor, seguido);
      })

    return false;

}

// Paginador
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector("#page-item-anterior").addEventListener('click', ()=> {        
        if (pagina > 1){pagina--;} 
        let Objetousuario = {Todo:true, User:0, Seguidos: false};
        cargar_posts(pagina, Objetousuario);       
    });
    document.querySelector("#page-item-siguiente").addEventListener('click', ()=> {        
        pagina++;
        let Objetousuario = {Todo:true, User:0, Seguidos: false};
        cargar_posts(pagina, Objetousuario);       
    });
    document.querySelector("#page-item-1").addEventListener('click', ()=> {        
        if (pagina > 1){pagina--;} 
        let Objetousuario = {Todo:true, User:0, Seguidos: false};
        cargar_posts(pagina, Objetousuario);       
    });
    document.querySelector("#page-item-3").addEventListener('click', ()=> {        
        pagina++;
        let Objetousuario = {Todo:true, User:0, Seguidos: false};
        cargar_posts(pagina, Objetousuario);       
    });
})

// Crea una relacion de seguimiento
function seguir(seguidor, seguido){
    let datos={Seguidor:seguidor, Seguido:seguido}
    console.log(datos)

    fetch('/seguir', {
        method:'POST',
        body: JSON.stringify(datos)
    })

    return false;
}

// Destruye una relacion de seguimiento
function dejar_de_seguir(seguidor, seguido){
    let datos={Seguidor:seguidor, Seguido:seguido}
    console.log(datos)

    fetch('/dejar_de_seguir', {
        method:'POST',
        body: JSON.stringify(datos)
    })

    return false;
}

//Crea una relacion de like
function like(post){
    let datos={Post: post}
    console.log(datos)

    fetch('/like', {
        method: 'POST',
        body: JSON.stringify(datos)
    })

    return false;
}

//Destruye una relacion de like
function unlike(post){
    let datos={Post: post}
    console.log(datos) 

    fetch('/unlike', {
        method: 'POST',
        body: JSON.stringify(datos)
    })

    return false;
}

//Seleccionamos un post
document.addEventListener("DOMContentLoaded", (event)=>{
    document.querySelector("#timeline").addEventListener('mouseover', (e)=>{  
        if (e.target.parentNode.classList == 'post'){ //Si el target es un hijo del post            
            post = e.target.parentNode.id.slice(5)
            console.log("Entrada", previo_post, post)
            if (previo_post != post){     
                post = previo_post;                  
                e.target.addEventListener('click', function(){clickpost(e)})  //Tenemos que dar como argumento el evento
                e.target.parentNode.classList.add("post1");                
                e.target.parentNode.classList.remove("post");
            }
           
        }
    })
})

//Salimos de un post
document.addEventListener("DOMContentLoaded", (event)=>{
    document.querySelector("#timeline").addEventListener('mouseout', (e)=>{ 
            if (e.target.parentNode.classList == 'post1'){                                   
            post = e.target.parentNode.id.slice(5);            
            console.log(post);
            if (post != previo_post){
                console.log("Salimos", post)
                //Removemos el evento
                e.target.removeEventListener('click', clickpost)            
                //Cambiamos la clase
                e.target.parentNode.classList.add("post");
                e.target.parentNode.classList.remove("post1");
                //Podemos intentar acá desactivar los botones
                document.querySelector("#-Button-like-post-" + post).style.display='none';
                document.querySelector("#-Button-unlike-post-" + post).style.display='none';
        }}
    })
})

// Muestra la relacion de seguimiento
function  seguimiento(Mesigue, Lesigo){
    if (Mesigue){
        document.querySelector("#yatesigue").style.display='block'
    }
    else{document.querySelector("#yatesigue").style.display='none'};

    if (Lesigo){
        document.querySelector("#follow-button").style.display='none';
        document.querySelector("#unfollow-button").style.display='block';
    }
    else{
        document.querySelector("#follow-button").style.display='block';
        document.querySelector("#unfollow-button").style.display='none';
    };
}

//Damos  click a un post
function clickpost(e)
{                             
    console.log(e.target.parentNode);
    post = e.target.parentNode.id.slice(5);
    let objeto = {post: post}
    let bandera_like = 0;
    console.log(post)
    fetch('/post', {
        method: 'POST',
        body:JSON.stringify(objeto)
    })
    .then(response=>response.json())
    .then(datos=>{
        console.log(datos.like);
        bandera_like = datos.like;
    })

    if (!bandera_like){
        document.querySelector("#-Button-like-post-" + post).style.display='block'
    }
    else{
        document.querySelector("#-Button-unlike-post-" + post).style.display='block'
    };
        
}

window.onscroll = () => {

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        document.querySelector('body').style.background = 'white';
    } else {
        document.querySelector('body').style.background = 'white';
        //pagina++;
        //let Objetousuario = {Todo:true, User:0, Seguidos: false};
        //cargar_posts(pagina, Objetousuario);
    }
    return false
};