let pagina = 1
document.addEventListener('DOMContentLoaded', function() {

    cargar_pagina();  
    
})

//Vemos los posts
function cargar_posts(pagina, usuario){

    // Ocultamos el perfil. Por que funciona con querySelector y no con getelementbyID?
    
    document.querySelector("#timeline").style.display = 'block'

    //Reseteamos el timeline
    document.querySelector("#timeline").innerHTML = ""

    // Seteamos la variable children
    let children=0;
    
    //Cargamos los posts. Recibimos como un solo objeto Json. Hay que cortar
    fetch('/posts/' + pagina, {
        method: 'POST',
        body: JSON.stringify(usuario)
    })
    .then(response => response.json())
    .then(posts => {        
        for (let i=0; i<posts.length; i++){
            crear_post(posts[i])                       
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

function cargar_pagina(){
    // Usamos los botones para elegir entre diferentes vistas
    document.querySelector("#id_following").addEventListener('click',()=>{
        let Objetousuario = {Todo:false, User:0, Seguidos: true};
        cargar_posts(pagina, Objetousuario);

    })


    //Por default, cargamos todos los posts, el form y la paginacion
    document.querySelector("#timeline").style.display = 'block'
    document.querySelector("#perfil").style.display = 'none'
    document.querySelector("#nuevo-post").style.display = 'block'
    document.querySelector("#h3-bienvenido").style.display = 'block'
    document.querySelector(".pagination").parentNode.style.display='block';

    let Objetousuario = {Todo:true, User:0, Seguidos: false};
    cargar_posts(pagina, Objetousuario);

    // Usaremos esta bandera para indicar a enviar_post() si se trata de un post nuevo o una edicion
    //0: nuevo post, otro numero: edicion
    let n_post = 0;    
    
    //enviar_post(n_post);

    document.querySelector('#form-nuevo-post').onsubmit = () => {
        enviar_post(n_post)        
        cargar_pagina()   
        window.location.reload()     
        return false
    };

    //Paginador

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
            ButtonLike.id = "Butlike-post-" + post.id;
            ButtonLike.innerHTML = "Me gusta";
            ButtonLike.classList.add("button-post");
            ButtonLike.style.display='none';
            let ButtonUnLike = document.createElement("button");
            ButtonUnLike.id = "Butunlike-post-" + post.id;
            ButtonUnLike.innerHTML = "Ya no me gusta";
            ButtonUnLike.classList.add("button-post1");
            ButtonUnLike.style.display='none';
            

            PostDiv.appendChild(UserDiv);
            UserDiv.appendChild(UserIdDiv);
            /*UserDiv.addEventListener('click', function(e){
                usuario = e.target.firstElementChild.value;
                perfil(usuario);                
            })*/
            PostDiv.appendChild(TextoDiv);
            PostDiv.appendChild(LikesDiv);
            PostDiv.appendChild(TimestampDiv);
            ButtonDiv.appendChild(ButtonLike);
            ButtonDiv.appendChild(ButtonUnLike);
            PostDiv.appendChild(ButtonDiv); 
            
            document.querySelector("#timeline").appendChild(PostDiv);
            //document.querySelector("#Butlike-post-" + post.id).style.display='none';
            //document.querySelector("#Butunlike-post-" + post.id).style.display='none';
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
//Tenemos un problema con la variable global previo_post
function mousesobrepost(e){  
    if (e.target.parentNode.classList == 'post'){ //Si el target es un hijo del post            
        post = e.target.parentNode.id.slice(5)
        previo_post = document.querySelector("#div-previo-post").innerText;
        console.log("Entrada", previo_post, post)
        //console.log("target.parentNode entrada", e.target.parentNode);
        if (previo_post != post){     
            previo_post = post;  
            document.querySelector("#div-previo-post").innerText=previo_post;                
            e.target.parentNode.addEventListener('click', clickpost)  //Tenemos que dar como argumento el evento
            console.log("Cambio de clase. De post a post1. en mousesobrepost")
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
        //previo_post = -1;
        document.querySelector("#div-previo-post").innerText=-1;
        //Removemos el evento y agregamos otro
        e.target.removeEventListener('click', clickpost);    
        //Cambiamos la clase        
        console.log("Cambio de clase, post1 a post. En mouserfuerapost")
        e.target.classList.remove("post1");
        e.target.classList.add("post");
        //Podemos intentar acá desactivar los botones. 
        document.querySelector("#Butlike-post-" + post).style.display='none';
        document.querySelector("#Butunlike-post-" + post).style.display='none';
    }
//}
}


//Damos  click a un post. 
function clickpost(e)
{     
    post1 = e.target.parentNode.id.slice(5);       
    let objeto = {post: post1};
    let bandera_like = 0;              
    fetch('/verpost', {
        method: 'POST',
        body:JSON.stringify(objeto)
    })
    .then(response=>response.json())    
    .then(datos=>{ 
        post = post1;   
        autor = datos.posteo.User_id;     
        bandera_like = datos.like;        
        document.querySelector("#timeline").innerHTML = "";
        crear_post(datos.posteo); 

        document.querySelector("#timeline").firstElementChild.addEventListener('click', function(e){
            usuario = e.target.firstElementChild.value;
            perfil(usuario);                
        })
        
        administrador_buttonlike(bandera_like, post); 
        let usuariolog = document.querySelector("#div_user").innerHTML;  
        if(autor == usuariolog){
            console.log("El autor del post es el usuario actual");
            administrador_buttonedit(post);
        }   
    })
    
    document.querySelector("#h3-bienvenido").style.display='none';
    document.querySelector("#h4-nuevo-editar").innerText='Editar';
    document.querySelector("#nuevo-post").style.display='none';
    document.querySelector(".pagination").parentNode.style.display='none';
    document.querySelector("#Butlike-post-" + post).parentNode.style.display='block';
    document.querySelector("#Butlike-post-" + post).style.display='inline';
       
}

function administrador_buttonlike(bandera_like, post){    
    if (!bandera_like){
        document.querySelector("#Butlike-post-" + post).style.display='block';
        document.querySelector("#Butunlike-post-" + post).style.display='none';        
        document.querySelector("#Butlike-post-" + post).addEventListener('click', ()=>{like(post)});
    }
    else{
        document.querySelector("#Butlike-post-" + post).style.display='none';
        document.querySelector("#Butunlike-post-" + post).style.display='block';
        document.querySelector("#Butunlike-post-" + post).addEventListener('click', ()=>{unlike(post)});
    };
}

function administrador_buttonedit(post){
    let EditButton = document.createElement("button");
    EditButton.id = "edit-button";
    EditButton.innerText = "Editar";
    document.querySelector("#post-"+post).appendChild(EditButton);
    document.querySelector("#edit-button").addEventListener('click',()=>{editar(post)});

}

// Habilita solo el form para editar el post y enviarlo

function editar(post){

    //Para ver el valor de post
    console.log(post);

    document.querySelector("#h3-bienvenido").style.display='none';
    document.querySelector("#nuevo-post").style.display='block';
    document.querySelector("#timeline").style.display='none';
    document.querySelector(".pagination").parentNode.style.display='none';  
    
    let objeto = {post: post1};
    fetch('/verpost', {
        method: 'POST',
        body:JSON.stringify(objeto)
    })
    .then(response=>response.json())    
    .then(datos=>{ 
        post = post1;           
        texto = datos.posteo.Texto;
        document.querySelector("#newpost_Texto").innerText = texto;
        
    })

    document.querySelector('#form-nuevo-post').onsubmit = () => {
        enviar_post(post);
        //document.querySelector("#newpost_Texto").innerHTML=""
        cargar_pagina();
        window.location.reload();        
        return false
    };
}

// Se encarga de enviar los datos del form para crear un nuevo post
// Nos falta avisarle cuando es una edicion
function enviar_post(n_post){

    //No sabemos que valor de n_post esta llegando

    console.log("n_post es:", n_post);          
    //Recibimos el form cuando se envia
    

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
                nuevo: n_post,                              
            })                                
        })        
        .then(response => response.json())
        .then(result=>{
            console.log(result);
        })

        //cargar_form()
        return false;
     

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
}