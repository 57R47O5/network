document.addEventListener('DOMContentLoaded', function() {

    console.log('Prueba')
    //Escondemos el form
    
    
    //Recibimos el form cuando se envia
    document.querySelector('#form-nuevo-post').onsubmit = () => {

        const imagen = document.querySelector('#newpost_Imagen').value;
        const texto = document.querySelector('#newpost_Texto').value;
        const usuario = document.querySelector('#newpost_User').value;

        //Enviamos el form    

        fetch('/postear',{
            method: 'POST',
            body: JSON.stringify({
                imagen: imagen,
                texto: texto,
                usuario: usuario                
            })                                
        })        
        .then(response => response.json())
        .then(result=>{
            console.log(result);
        })
        return false;
    };
    
    
    let pagina = 1
    //Cargamos los posts. Recibimos como un solo objeto Json. Hay que cortar
    fetch('/posts/' + pagina)
    .then(response => response.json())
    .then(posts => {
        
        for (let i=0; i<posts.length; i++){
            document.getElementById("timeline").insertAdjacentHTML("beforeend", `<div class="post" id="post-${posts[i].id}" >${posts[i].User}: <br> ${posts[i].Texto}<br>`)
        };        
        console.log(posts);
    });
})