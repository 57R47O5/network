let pagina = 1
document.addEventListener('DOMContentLoaded', function() {

    // Usamos los botones para elegir entre diferentes vistas
    // A implementar

    //Por default, cargamos todos los posts y el form
    document.querySelector("#timeline").style.display = 'block'
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

function cargar_posts(pagina, usuario){

    // Ocultamos el perfil. Por que funciona con querySelector y no con getelementbyID?
    document.querySelector("#perfil").style.display = 'none'
    //document.querySelector("#nuevo-post").style.display = 'block'
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
            
            PostDiv.appendChild(UserDiv);
            UserDiv.appendChild(UserIdDIv);
            UserDiv.addEventListener('click', function(e){
                usuario = e.target.firstElementChild.value;
                perfil(usuario);                
            })
            PostDiv.appendChild(TextoDiv);
            PostDiv.appendChild(LikesDiv);
            PostDiv.appendChild(TimestampDiv);
            
            document.querySelector("#timeline").appendChild(PostDiv);
            
        };        
        console.log(posts);        
        children = document.querySelector("#timeline").childElementCount;


        if(pagina==1){document.querySelector("#page-item-1").style.display='none'}
        else{document.querySelector("#page-item-1").style.display='block'};
        document.querySelector("#page-item-1").firstChild.innerHTML = pagina - 1;    
        document.querySelector("#page-item-2").firstChild.innerHTML = pagina;
        if(children<10){document.querySelector("#page-item-3").style.display='none'}
        else{document.querySelector("#page-item-3").style.display='block'};
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

    console.log(usuario);

    // Ocultamos las vistas que no nos interesan
    document.getElementById("nuevo-post").style.display = 'none'
    document.getElementById("timeline").style.display = 'block'
    document.getElementById("perfil").style.display = 'block'

    //Llamamos a perfil en views. De ahi debemos obtener una lista con todos los posts del usuario
    let Objetousuario = {Todo:false, User:usuario, Seguidos: false};
    cargar_posts(pagina, Objetousuario);
    
    return false;

}

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