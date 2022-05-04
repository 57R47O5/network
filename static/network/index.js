let pagina = 1
document.addEventListener('DOMContentLoaded', function() {

    // Usamos los botones para elegir entre diferentes vistas
    // A implementar

    //Por default, cargamos todos los posts
    let usuario = {Todo:true, User:0, Seguidos: false};
    cargar_posts(pagina, usuario)

    
    
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

function cargar_posts(pagina, usuario){//Hay que cambiar de pagina a contexto

    // Ocultamos el perfil. Por que funciona con querySelector y no con getelementbyID?
    document.querySelector("#perfil").style.display = 'none'
    document.querySelector("#nuevo-post").style.display = 'block'

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
                console.log(usuario);
            })
            PostDiv.appendChild(TextoDiv);
            PostDiv.appendChild(LikesDiv);
            PostDiv.appendChild(TimestampDiv);
            
            document.querySelector("#timeline").appendChild(PostDiv);
            
        };        
        console.log(posts);
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
    document.getElementById("nuevo-post").style.display = 'none'
    document.getElementById("timeline").style.display = 'none'
    document.getElementById("perfil").style.display = 'block'

    //Llamamos a perfil en views. De ahi debemos obtener una lista con todos los posts del usuario
    fetch('/perfil/' + usuario)
    .then(response => response.json())
    .then(posts => {

    })

}

window.onscroll = () => {

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        document.querySelector('body').style.background = 'green';
    } else {
        document.querySelector('body').style.background = 'white';
        pagina++;
        cargar_posts(pagina, 0);
    }
    return false
};