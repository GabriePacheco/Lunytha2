 function lunytha(){
//VARIABLES 

 	//ajuste alto de la aplicación al anto de la pantalla
	var app = document.getElementById("app");
	app.style.height = screen.height + "px";

	//inicialización de elementos Materialize 
	var elems = document.querySelectorAll('select'); //LISTAS 
	var instances = M.FormSelect.init(elems);

    var elems = document.querySelectorAll('.dropdown-trigger'); // BOTONES DESPLEGABLES
    var instances = M.Dropdown.init(elems);

   //Todas las paginas de la aplicacion  
   var paginas = document.getElementsByClassName("pageApp");

  //variable de formularios de registro 
  var registroFormulario = document.getElementById("registroFormulario");
  var registroEmail = document.getElementById("registroEmail");
  var registroPassword = document.getElementById("registroPassword");
  var registroPasswordConfir = document.getElementById("registroPasswordConfir");
  var registroBoton =document.getElementById("registroBoton");

  //variables de formulario registro Nombre 
  var registroNombreFormulario = document.getElementById("registroNombreFormulario");
  var nombre = document.getElementById("nombre");
  var rol = document.getElementById("rol");
  var ClaveSecreta = document.getElementById("ClaveSecreta");
  var curso = document.getElementById("curso");
  var contenedorClaveSecreta = document.getElementById("contenedorClaveSecreta");
  var contenedorCurso = document.getElementById("contenedorCurso");
  var registroNombreBoton = document.getElementById("registroNombreBoton");

  //variable de FORMULARIO Login 
  var loginFormulario = document.getElementById("loginFormulario");
  var loginEmail = document.getElementById("loginEmail");
  var loginPassword = document.getElementById("loginPassword");
  var loginBoton = document.getElementById("loginBoton");


  //Variables de sesión 
  var userInline = {}//usuario en linea 


//ESCUCHADORES 
	//Escucho cambios en la URL 
	window.addEventListener("hashchange", navegacion);
  
	
	//escucho cambios en el formulariio Registro
	registroEmail.addEventListener("keyup", activarRegistroBoton);
	registroPassword.addEventListener("keyup", activarRegistroBoton);
	registroPasswordConfir.addEventListener("keyup", activarRegistroBoton);
	registroFormulario.addEventListener("submit", registarUsuario);


  //escucho cambios en el formulario Registro Nombre 
  nombre.addEventListener("keyup", activarRegistroNombreBoton);
  rol.addEventListener("change", activarRegistroNombreBoton);
  registroNombreFormulario.addEventListener("submit", guardarNombre);

  //Escucho Cambios en el formulariio Login
  loginPassword.addEventListener("keyup", activarBotonLogin);
  loginEmail.addEventListener("keyup", activarBotonLogin);
  loginFormulario.addEventListener("submit", iniciarSesion);

//FUNCIONES 
	

   //Ocultar una paguna 
   function  ocultarPagina(e, callback){
   		var pageOcultar = e;
   		if (pageOcultar.className.indexOf("hide") == -1){
   			
   			pageOcultar.className += " hide" ;
   		}
   		if(typeof callback == "function" ){
   			callback(pageOcultar);
   		}

   }

   //Navegación de las paginas.
   function navegacion (e, callback){

	   	var URL = window.location.hash.split("#")[1];
	   	//oculto las paginas activas 
	   	for (var contPages = 0; contPages < paginas.length; contPages++){
	   		ocultarPagina(paginas[contPages]);
	   	}
	   	document.getElementById(URL).className = document.getElementById(URL).className.replace("hide" , "");
	   	if ( typeof callback == "function"  ){
	   		callback(e);
	   	}
	   	if (URL == "registroImagen"){
	   		gpRecortador({redondo: true}, registroFotoPerfil);
	   	}
   }

   //echucho los cambis de sesion en FIREBASE
   auth.onAuthStateChanged(function(user){
   	if (user){
   		userInline = user;
   		if (userInline.providerData[0].providerId == "password"){
   			if (userInline.emailVerified){
          if (userInline.photoURL){
            if (!userInline.displayName){
              window.location.hash = "#registroNombre";
            }else{
              window.location.hash = "#home";
            }


          }else{
   				 window.location.hash = "#registroImagen";
          }

   			}else{
   				window.location.hash = "#confirmar";

   			}
   		}
   	}else{
   		window.location.hash= "#login";
   	}
   });

   //Boton registo 
   function activarRegistroBoton(e, callback){
   		if (registroEmail.value != "" && registroPassword.value != ""  && registroPasswordConfir.value == registroPassword.value){
   			registroBoton.removeAttribute("disabled");
   		}else{
   			registroBoton.setAttribute("disabled", true) ;
   		}

   }

   //Registrar Usuario 
   function registarUsuario(e, callback){
      	e.preventDefault();
   	  auth.createUserWithEmailAndPassword(registroEmail.value, registroPassword.value)
      	.then(function (){
    		auth.currentUser.sendEmailVerification()
    		.catch(function(error) {
    			mensajeria(error);
    		
    		});

       })
     	.catch(function (error){
     		mensajeria(error)
     	});

   }
   function mensajeria(error){

     	var toastHTML = '<span>'+error.code+': '+error.message+'  </span><i class="materialize-icons"></i>';
    	M.toast({html: toastHTML});
   }

   //Registrar foto perfi 
   function registroFotoPerfil(snap){
     	var fotoPerfilNueva = storage.ref("imagenes/users/perfil/" + userInline.uid + "png");
       	fotoPerfilNueva.put(snap.file)
       	.then(function (snap){
       		fotoPerfilNueva.getDownloadURL()
          .then(function (URL){
            auth.currentUser.updateProfile({
              photoURL : URL
            });
            base.ref("users/" +userInline.uid  ).set({
              uid :userInline.uid,
              email: userInline.email,
              photoUrl: URL
            });
          });
          window.location.hash = "#registroNombre";
       	});

   }

   //Boton registro Nombre 
   function activarRegistroNombreBoton(e, callback){
      if (rol.value == 3){
        contenedorClaveSecreta.className = contenedorClaveSecreta.className.replace("hide", "");
        ClaveSecreta.setAttribute("required", true)
      }else{
        if (contenedorClaveSecreta.className.indexOf("hide") == -1){
          contenedorClaveSecreta.className+=" hide";        
        }
         ClaveSecreta.removeAttribute("required");     
      }
      if (rol.value == 1){
        contenedorCurso.className = contenedorCurso.className.replace("hide", "");
      }else{
        if (contenedorCurso.className.indexOf("hide") == -1){
          contenedorCurso.className+=" hide";
        }       
      }
      if (nombre.value != "" && rol.value != ""){
        registroNombreBoton.removeAttribute("disabled");
      }else{
        registroNombreBoton.setAttribute("disabled", true);
      }

   }

 function activarBotonLogin(e, callback){
    e.preventDefault();
    if (loginEmail.value != "" && loginPassword.value != ""){
      loginBoton.removeAttribute("disabled");

    }else{
      loginBoton.setAttribute("disabled",true);      
    }
 }

 function iniciarSesion(e, callback){
    e.preventDefault();
    auth.signInWithEmailAndPassword(loginEmail.value, loginPassword.value)
    .catch(function (error){
      mensajeria(error);
    })

 }

 function guardarNombre(e, callback){
    e.preventDefault();
    if (ClaveSecreta.value){
          var pin = base.ref("pines").orderByValue().equalTo(ClaveSecreta.value);
           pin.on("value", function (s){
            if (s.key){
              base.ref("users/" + userInline.uid).update({
                nombre: nombre.value,
                rol: rol.value, 
              });
              auth.currentUser.updateProfile({
                displayName: nombre.value
              });

            }
         });

      }else{
          if (curso.value){
              base.ref("users/" + userInline.uid).update({
              nombre: nombre.value,
              rol: rol.value,
              curso: curso.value

            });
             auth.currentUser.updateProfile({
              displayName: nombre.value
            })  ;
          }else{

               base.ref("users/" + userInline.uid).update({
                nombre: nombre.value,
                rol: rol.value
               });
                auth.currentUser.updateProfile({
                  displayName: nombre.value
                })

          }

      }
      window.location.hash= "#home";
   }
  

}
 
document.addEventListener('DOMContentLoaded',lunytha);
