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
    previo_post = -1; //Esta bandera global nunca cambia
    console.log("Estamos  cargando ahora", previo_post);

    //Cargamos los posts. Recibimos como un solo objeto Json. Hay que cortar
    fetch('/posts/' + pagina, {
        method: 'POST',
        body: JSON.stringify(usuario)
    })
    .then(response => response.json())
    .then(posts => {        
        for (let i=0; i<posts.length; i++){
            crear_post(posts[i])
            /*/
            let PostDiv = document.createElement("div");            
            PostDiv.id = "post-" + posts[i].id;  
            PostDiv.classList.add("post");          
            let UserDiv = document.createElement("div");
            UserDiv.id = "post-" + posts[i].id + "-User";
            UserDiv.classList.add("subdiv");
            UserDiv.innerHTML = posts[i].User;            
            let UserIdDiv = document.createElement("div");
            UserIdDiv.id = "post-" + posts[i].id + "-UserId";
            UserIdDiv.classList.add("subdiv");
            UserIdDiv.value = posts[i].User_id;
            UserIdDiv.style.display = 'none';
            let TextoDiv = document.createElement("div");
            TextoDiv.id = "post-" + posts[i].id + "-Texto";
            TextoDiv.classList.add("subdiv");
            TextoDiv.innerHTML = posts[i].Texto;
            let LikesDiv = document.createElement("div");
            LikesDiv.id = "post-" + posts[i].id + "-Likes";
            LikesDiv.innerHTML = posts[i].Likes;
            LikesDiv.classList.add("subdiv");
            let TimestampDiv = document.createElement("div");
            TimestampDiv.id = "post-" + posts[i].id + "-Timestamp";
            TimestampDiv.classList.add("subdiv");
            TimestampDiv.innerHTML = posts[i].Timestamp;           
            let ButtonDiv = document.createElement("div");
            ButtonDiv.id = "div-button" + posts[i].id;
            ButtonDiv.classList.add("subdiv");
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
            UserDiv.appendChild(UserIdDiv);
            UserDiv.addEventListener('click', function(e){
                usuario = e.target.firstElementChild.value;
                perfil(usuario);                
            })
            PostDiv.appendChild(TextoDiv);
            PostDiv.appendChild(LikesDiv);
            PostDiv.appendChild(TimestampDiv);
            ButtonDiv.appendChild(ButtonLike);
            ButtonDiv.appendChild(ButtonUnLike);
            PostDiv.appendChild(ButtonDiv);            
            

            document.querySelector("#timeline").appendChild(PostDiv);
            /*/
            
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

function crear_post(post){
            let PostDiv = document.createElement("div");            
            PostDiv.id = "post-" + post.id;  
            PostDiv.classList.add("post");          
            let UserDiv = document.createElement("div");
            UserDiv.id = "post-" + post.id + "-User";
            UserDiv.classList.add("subdiv");
            UserDiv.innerHTML = post.User;            
            let UserIdDiv = document.createElement("div");
            UserIdDiv.id = "post-" + post.id + "-UserId";
            UserIdDiv.classList.add("subdiv");
            UserIdDiv.value = post.User_id;
            UserIdDiv.style.display = 'none';
            let TextoDiv = document.createElement("div");
            TextoDiv.id = "post-" + post.id + "-Texto";
            TextoDiv.classList.add("subdiv");
            TextoDiv.innerHTML = post.Texto;
            let LikesDiv = document.createElement("div");
            LikesDiv.id = "post-" + post.id + "-Likes";
            LikesDiv.innerHTML = post.Likes;
            LikesDiv.classList.add("subdiv");
            let TimestampDiv = document.createElement("div");
            TimestampDiv.id = "post-" + post.id + "-Timestamp";
            TimestampDiv.classList.add("subdiv");
            TimestampDiv.innerHTML = post.Timestamp;           
            let ButtonDiv = document.createElement("div");
            ButtonDiv.id = "div-button" + post.id;
            ButtonDiv.classList.add("subdiv");
            let ButtonLike = document.createElement("button");
            ButtonLike.id = "-Button-like-post-" + post.id;
            ButtonLike.innerHTML = "Me gusta";
            ButtonLike.classList.add("button-post");
            ButtonLike.style.display='none';
            let ButtonUnLike = document.createElement("button");
            ButtonUnLike.id = "-Button-unlike-post-" + post.id;
            ButtonUnLike.innerHTML = "Ya no me gusta";
            ButtonUnLike.classList.add("button-post1");
            ButtonUnLike.style.display='none';
            

            PostDiv.appendChild(UserDiv);
            UserDiv.appendChild(UserIdDiv);
            UserDiv.addEventListener('click', function(e){
                usuario = e.target.firstElementChild.value;
                perfil(usuario);                
            })
            PostDiv.appendChild(TextoDiv);
            PostDiv.appendChild(LikesDiv);
            PostDiv.appendChild(TimestampDiv);
            ButtonDiv.appendChild(ButtonLike);
            ButtonDiv.appendChild(ButtonUnLike);
            PostDiv.appendChild(ButtonDiv); 
            
            document.querySelector("#timeline").appendChild(PostDiv);
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
    document.querySelector("#timeline").addEventListener('mouseover', mousesobrepost)
})

//Salimos de un post
document.addEventListener("DOMContentLoaded", (event)=>{
    document.querySelector("#timeline").addEventListener('mouseout', mousefuerapost)
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

// Movemos el mouse sobre un post
// Esta funcion trabaja con e.target.parentNode = div
function mousesobrepost(e){  
    if (e.target.parentNode.classList == 'post'){ //Si el target es un hijo del post            
        post = e.target.parentNode.id.slice(5)
        //console.log("Entrada", previo_post, post)
        //console.log("target.parentNode entrada", e.target.parentNode);
        if (previo_post != post){     
            previo_post = post;                  
            e.target.parentNode.addEventListener('click', clickpost)  //Tenemos que dar como argumento el evento
            e.target.parentNode.classList.add("post1");                
            e.target.parentNode.classList.remove("post");
        }
       
    }
}

//Sacamos un mouse de sobre un post
// Esta funcion trabaja con e.target = div
function mousefuerapost(e){   
    //console.log("target salida", e.target)
    if (e.target.classList == "post1"){    
        //console.log("Saliendo", e.target);
        previo_post = -1;
        //Removemos el evento y agregamos otro
        e.target.removeEventListener('click', clickpost);    
        //Cambiamos la clase
        e.target.classList.add("post");
        e.target.classList.remove("post1");
        //Podemos intentar acá desactivar los botones. 
        document.querySelector("#-Button-like-post-" + post).style.display='none';
        document.querySelector("#-Button-unlike-post-" + post).style.display='none';
    }
//}
}


//Damos  click a un post
function clickpost(e)
{              
    console.log("Funcion clickpost")               
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
        document.querySelector("#-Button-like-post-" + post).style.display='block';
        //Aca debemos  agregar el eventlistener para la funcion like
    document.querySelector("#-Button-like-post-" + post).addEventListener('click', ()=>{like(post)})
    }
    else{
        document.querySelector("#-Button-unlike-post-" + post).style.display='block';
        document.querySelector("#-Button-unlike-post-" + post).addEventListener('click', ()=>{unlike(post)})
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