var id_user  = 0;
var tokens   = 0;

var consultar  = 0;
var actualizar = 0; 
var borrar     = 0; 
var registrar  = 0;

var name_rol   = 0;
var id_rol     = 0;
/* ------------------------------------------------------------------------------- */
    /*
        Variable para el idioma del datatable.
    */
    var idioma_espanol = {
        "sProcessing":     "Procesando...",
        "sLengthMenu":     "Mostrar _MENU_ registros",
        "sZeroRecords":    "No se encontraron resultados",
        "sEmptyTable":     "Ningún dato disponible en esta tabla",
        "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix":    "",
        "sSearch":         "Buscar:",
        "sUrl":            "",
        "sInfoThousands":  ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst":    "Primero",
            "sLast":     "Último",
            "sNext":     "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
    }
 /* 
        Funcion para mostrar y ocultar los cuadros (div).
    */
    function cuadros(cuadroOcultar, cuadroMostrar){
        $(cuadroOcultar).slideUp("slow"); //oculta el cuadro.
        $(cuadroMostrar).slideDown("slow"); //muestra el cuadro.
    }


    /* ------------------------------------------------------------------------------- */
    /* 
        Funcion para regresar al listado.
    */
    function prev(cuadroOcultar){
        $(cuadroOcultar).slideUp("slow"); //oculta el cuadro.
        $("#cuadro1").slideDown("slow"); //muestra el cuadro.
        list();
    }
/* ------------------------------------------------------------------------------- */
    /*
        Funcion que envia los datos de los formularios.
    */
    function enviarFormulario(form, controlador, cuadro, auth = false){
        $(form).submit(function(e){
            e.preventDefault(); //previene el comportamiento por defecto del formulario al darle click al input submit
            var url=document.getElementById('ruta').value; //obtiene la ruta del input hidden con la variable <?=base_url()?>
            var formData=new FormData($(form)[0]); //obtiene todos los datos de los inputs del formulario pasado por parametros
            var method = $(this).attr('method'); //obtiene el method del formulario
            $('input[type="submit"]').attr('disabled','disabled'); //desactiva el input submit
            $.ajax({
                url:''+url+'/'+controlador+'',
                type:method,
                dataType:'JSON',
                data:formData,
                cache:false,
                contentType:false,
                processData:false,
                beforeSend: function(){
                   showNoty('info', "topLeft",'<span>Espere por favor... <i class="fa fa-spinner fa-spin" aria-hidden="true"></i></span>', 1000);
                },
                error: function (repuesta) {
                    $('input[type="submit"]').removeAttr('disabled'); //activa el input submit
                    var errores=repuesta.responseText;
                    if(errores!="")
                        showNoty("error", "topRight", errores, 3000)
                    else
                        showNoty("error", "topRight","<span>Ha ocurrido un error, por favor intentelo de nuevo.</span>", 3000)
                },
                 success: function(respuesta){
                    if (respuesta.success == false) {
                         showNoty('error', "topRight", respuesta.message, 3000);
                         $('input[type="submit"]').removeAttr('disabled'); //activa el input submit
                    }else{
                        $('input[type="submit"]').removeAttr('disabled'); //activa el input submit
                        showNoty('success', "topRight", respuesta.mensagge, 3000);

                        if (auth) {
                           localStorage.setItem('token', respuesta.token);  
                           localStorage.setItem('email', respuesta.email);
                           localStorage.setItem('user_id', respuesta.user_id);  
                           window.location.href = url+"/dashboard";
                        }else{

                            list(cuadro);
                        }
                       
                    }

                }

            });
        });
    }





    /* ------------------------------------------------------------------------------- */
    /*
        Funcion que envia los datos de los formularios.
    */
   function enviarFormularioPut(form, controlador, cuadro, auth = false, inputFile){
    $(form).submit(function(e){
        e.preventDefault(); //previene el comportamiento por defecto del formulario al darle click al input submit
        var url=document.getElementById('ruta').value; //obtiene la ruta del input hidden con la variable <?=base_url()?>
        var formData=new FormData($(form)[0]); //obtiene todos los datos de los inputs del formulario pasado por parametros
     
        var method = $(this).attr('method'); //obtiene el method del formulario
        $('input[type="submit"]').attr('disabled','disabled'); //desactiva el input submit
        $.ajax({
            url:''+url+'/'+controlador+'/'+$("#id_edit").val(),
            type:method,
            dataType:'JSON',
            data:formData,
            cache:false,
                contentType:false,
                processData:false,
            beforeSend: function(){
                showNoty('info', "topLeft", '<span>Espere por favor... <i class="fa fa-spinner fa-spin" aria-hidden="true"></i></span>', 1000);
            },
            error: function (repuesta) {
                $('input[type="submit"]').removeAttr('disabled'); //activa el input submit
                var errores=repuesta.responseText;
                if(errores!="")
                    showNoty('error', "topRight", errores, 3000);
                else
                    showNoty('error', "topRight", "<span>Ha ocurrido un error, por favor intentelo de nuevo.</span>", 3000);        
            },
             success: function(respuesta){
                if (respuesta.success == false) {
                     showNoty('error', "topRight", respuesta.message, 3000);
                     $('input[type="submit"]').removeAttr('disabled'); //activa el input submit
                }else{
                    $('input[type="submit"]').removeAttr('disabled'); //activa el input submit
                    showNoty('success', "topRight", respuesta.mensagge, 3000);

                    if (auth) {
                       localStorage.setItem('token', respuesta.token);  
                       localStorage.setItem('email', respuesta.email);
                       localStorage.setItem('user_id', respuesta.user_id);  
                       window.location.href = url+"/dashboard";
                    }else{
                        list(cuadro);
                    }
                   
                }

            }

        });
    });
}


/* ------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------- */
    /*
        Funcion que se encarga de cambiar el status de un registro seleccionado.
        status -> valor (1, 2, n...)
        confirmButton -> activar, desactivar
    */
   function statusConfirmacion(controlador,  title, confirmButton){

    var data = {
      "id_user": id_user,
      "token"  : tokens,
    };


    swal({
        title: title,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Si, "+confirmButton+"!",
        cancelButtonText: "No, Cancelar!",
        closeOnConfirm: true,
        closeOnCancel: false
    },
    function(isConfirm){
        if (isConfirm) {
            var url=document.getElementById('ruta').value; //obtiene la ruta del input hidden con la variable <?=base_url()?>
            $.ajax({
                url:''+url+'/'+controlador+'/',
                type: 'GET',
                dataType: 'JSON',
                data: data,
                beforeSend: function(){
                  showNoty('info', "topLeft", '<span>Espere por favor... <i class="fa fa-spinner fa-spin" aria-hidden="true"></i></span>', 1000);
                },
                error: function (repuesta) {
                    var errores=repuesta.responseText;
                    showNoty('error', "topRight", errores, 3000);
                },
                success: function(respuesta){
                  showNoty('success', "topRight", respuesta.mensagge, 3000);
                  list();
                }
            });
        } else {
            swal("Cancelado", "Proceso cancelado", "error");
        }
    });
}




    function print_r2(data) {
        $.each(data, function(i, item){
            console.log(i);
        });
        return data;
    }

      /*
        Funcion que muestra los mensajes al usuario.
        type = [default, primary, info, warning, success, danger]
    */
    function mensajes(type, msj){
        html='<div class="alert alert-'+type+'" role="alert">';
        html+='<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
        html+=msj;
        html+='</div>';
        return $("#alertas").html(html).css("display", "block");
    }








    function validAuth(login = false, uri = "") {
        var url=document.getElementById('ruta').value; //obtiene la ruta del input hidden con la variable <?=base_url()?>
        

        var token   = localStorage.getItem('token');
        var user_id = localStorage.getItem('user_id');

        var data = {
            "token"   : token,
            "user_id" : user_id
        }

        //$('input[type="submit"]').attr('disabled','disabled'); //desactiva el input submit
        $.ajax({
            url:''+url+'/api/verify-token',
            type:"POST",
            data: data,
            dataType:'JSON',
            async: false,
            beforeSend: function(){
                $('#page-loader').css("display", "block");
            },
            error: function (repuesta) {
                if (!login) {
                    window.location.href = url+"/";  
                }else{
                    $('#page-loader').css("display", "none"); 
                }
            },
             success: function(respuesta){
                if (login) {  
                    window.location.href = url+"/dashboard";   
                }else{
                    $('#page-loader').css("display", "none");

                    $("#userDropdown img").attr("src", "img/usuarios/profile/"+respuesta.data_user.img_profile)
                    $("#userDropdown span").text(respuesta.data_user.nombres+" "+respuesta.data_user.apellido_p)

                    showMenu(respuesta.modulos_disponibles, respuesta.funciones, uri)

                    name_rol = respuesta.data_user.nombre_rol
                }

                $(".id_user").val(respuesta.data.id_user);
                $(".token").val(respuesta.data.token);

                id_user  = respuesta.data.id_user;
                tokens   = respuesta.data.token;
                id_rol   = respuesta.data_user.id_rol;
            }

        });
    }



    function showMenu(modulos_disponibles, funciones, uri){
      var url=document.getElementById('ruta').value;

      var accede = false;
      var html   = "";

      html += '<li class="nav-item dropdown">'

          html += '<a class="dropdown-toggle" href="javascript:void(0);">'

            html += '<span class="icon-holder">'
              html += '<i class="ti-home"></i>'
            html += '</span>'

            html += '<span class="title">Inicio</span>'
            html += '<span class="arrow">'
              html += '<i class="ti-angle-right"></i>'
            html += '</span>'
          html += '</a>'

        html += '</li>'


      $.each(modulos_disponibles, function(i, item){

        html += '<li class="nav-item dropdown" id="nav_li_'+item.nombre+'">'

          html += '<a class="dropdown-toggle" href="javascript:void(0);">'

            html += '<span class="icon-holder">'
              html += '<i class="'+item.icon+'"></i>'
            html += '</span>'

            html += '<span class="title">'+item.nombre+'</span>'
            html += '<span class="arrow">'
              html += '<i class="ti-angle-right"></i>'
            html += '</span>'
          html += '</a>'

            html += '<ul class="dropdown-menu">'

              $.each(funciones, function(i2, item2){
                if((item.id_modulo == item2.id_modulo))

                    if(item2.visibilidad == 1){
                       
                        html += '<li id="nav_'+item2.route+'"><a href="./'+item2.route+'">'+item2.nombre+'</a></li>'
                    }
        
                    if (uri == item2.route) {
                      accede = true;
                    }
              });
            html += '</ul>'

        html += '</li>'

        

      });

      if (!accede && uri != "dashboard") {
        alert("No tiene Permiso para acceder a esta funcion");
        window.location.href = url+"/dashboard";  
      }




 

      $("#options").html(html);

      init()
    }



$("#send_usuario").click(function() {


    var comprobar_reg = false;
    var comprobar_img = false;
    var comprobar_reg_string = "";
    var comprobar_reg_tab = "";
    var comprobar_reg_campo = "";
    var obj1 = ["0", "1"];
    for (index = 0; index < obj1.length; ++index) {
      item1 = obj1[index];


      var ValidImgProfile = $("#avatar-1")[0].files.length;

      if (ValidImgProfile == 0) {
        if($("#avatar-1").prop('required')){
            comprobar_img = true;
        }
      }


      $('.tab_content'+item1+' div.valid-required').each(function(){
        if($(this).find(".form-control").prop('required')){
          if($(this).find(".form-control").val() == ""){
            if(!comprobar_reg){
              comprobar_reg = true;
            //  comprobar_reg_string = $(this).find(".control-label-left").html().replace('<span class="required"></span>', "").replace('<span class="required">*</span>', "");
              comprobar_reg_tab = item1;
              comprobar_reg_campo = $(this).find(".form-control").prop("id");
            }
          }
        }
      });
    }
    var obj2 = ["11", "2", "3", "4", "5", "6"];
    for (index = 0; index < obj2.length; ++index) {
      item1 = obj2[index];
      var contador_req = 0;
      var temp_comprobar_reg_string = "";
      var temp_comprobar_reg_campo = "";
      $('.tab_content'+item1+' div.valid-required').each(function(){
        if($(this).find(".form-control").prop('required')){
          if($(this).find(".form-control").val() == "" || $(this).find(".form-control").val() == "0" || $(this).find(".form-control").val() == "accio"){
            if(!comprobar_reg){
              if(comprobar_reg_campo == ""){
               // temp_comprobar_reg_string = $(this).find(".control-label-left").html().replace('<span class="required"></span>', "").replace('<span class="required">*</span>', "");
                comprobar_reg_campo = $(this).find(".form-control").prop("id");
              }
            }
          }
          else{
            contador_req++;
          }
        }
      });

      if(!comprobar_reg){
        if(contador_req > 0){
          if(comprobar_reg_campo != ""){
            comprobar_reg = true;
            comprobar_reg_string = temp_comprobar_reg_string;
            comprobar_reg_tab = item1;
            comprobar_reg_campo = comprobar_reg_campo;
          }
        }
        else{
          $('.tab_content'+item1+' div.valid-required').each(function(){
            $(this).find(".form-control").removeAttr("required");
          });
        }
      }
    }
    
    if (comprobar_img) {
        $('.tab_content_edit0').removeClass("active in");$('#edit_tab0').removeClass("active");
        $('.tab_content_edit1').removeClass("active in");$('#edit_tab1').removeClass("active");
        $('.tab_content_edit11').removeClass("active in");$('#tab11').removeClass("active");
        $('.tab_content_edit2').removeClass("active in");$('#tab2').removeClass("active");
        $('.tab_content_edit3').removeClass("active in");$('#tab3').removeClass("active");
        $('.tab_content_edit4').removeClass("active in");$('#tab4').removeClass("active");
        $('.tab_content_edit5').removeClass("active in");$('#tab5').removeClass("active");
        $('.tab_content_edit6').removeClass("active in");$('#tab6').removeClass("active");
        $('.tab_content80').removeClass("active in");$('#tab80').removeClass("active");
        
        $('.tab_content_edit0').addClass("active in show");$('#tab0').addClass("active");

    }else if(comprobar_reg){
        
      $('.tab_content0').removeClass("active in");$('#tab0').removeClass("active");
      $('.tab_content1').removeClass("active in");$('#tab1').removeClass("active");
      $('.tab_content11').removeClass("active in");$('#tab11').removeClass("active");
      $('.tab_content2').removeClass("active in");$('#tab2').removeClass("active");
      $('.tab_content3').removeClass("active in");$('#tab3').removeClass("active");
      $('.tab_content4').removeClass("active in");$('#tab4').removeClass("active");
      $('.tab_content5').removeClass("active in");$('#tab5').removeClass("active");
      $('.tab_content6').removeClass("active in");$('#tab6').removeClass("active");
      $('.tab_content'+comprobar_reg_tab).addClass("active in show");$('#tab'+comprobar_reg_tab).addClass("active");
      //$('#'+comprobar_reg_campo).focus();
      //alert("El campo "+comprobar_reg_string+" es obligatorio.");
    }
  });






/* ------------------------------------------------------------------------------- */
    /*
        Funcion para agregar options a los selects
    */
    function agregarOptions(select, value, text){
        $(select).append($('<option>', { 
            value: value,
            text : text
        }));
        $(select + ' :nth-child(2)').prop('selected', true);
    }

    function eliminarOptions(select){
        $('#' + select).children('option:not(:first)').remove();
    }

    
/* ------------------------------------------------------------------------------- */
  /*
    Funcion con codigo para generar un checkbox
  */
  function agregarCheckbox(id, campo, checked){

    
    if(checked == 0)
      return  "<div class='checkbox'><input type='checkbox' name='" + campo + "' id='" + campo + id + "' value='0'><label for='" + campo + id + "'></label></div>";
    else if (checked == 1)
      return "<div class='checkbox'><input type='checkbox' name='" + campo + "' id='" + campo + id + "' value='0' checked><label for='" + campo + id + "'></label></div>";
  }







  function warning(title){
        swal({
            title: title,
            type: "warning",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Aceptar!",
            closeOnConfirm: true
        });
    }


    /* ------------------------------------------------------------------------------- */
  /*
    Funcion que verificar checkbox
  */
  function verificarCheckbox(checkbox){
    if (document.getElementById(checkbox).checked)
      return 1
    else
      return 0
  }



  function verifyPersmisos(id_usuario, token, route){

    console.log(route)
    var url=document.getElementById('ruta').value; //obtiene la ruta del input hidden con la variable <?=base_url()?>
        

        var token   = token;
        var user_id = id_usuario;

        var data = {
            "token"   : token,
            "user_id" : user_id,
            "route"   : route
        }

        //$('input[type="submit"]').attr('disabled','disabled'); //desactiva el input submit
        $.ajax({
            url:''+url+'/api/verify-permiso',
            type:"GET",
            data: data,
            dataType:'JSON',
            async: false,
            beforeSend: function(){
               
            },
            error: function (repuesta) {
                
            },
            success: function(respuesta){
              consultar  = respuesta.detallada
              actualizar = respuesta.actualizar
              borrar     = respuesta.eliminar
              registrar  = respuesta.registrar

              if(registrar == 0){
                $("#btn-new").css("display" ,"none")
              }
            }

        });
  }


  function calcularEdad(fecha) {
      var hoy = new Date();
      var cumpleanos = new Date(fecha);
      var edad = hoy.getFullYear() - cumpleanos.getFullYear();
      var m = hoy.getMonth() - cumpleanos.getMonth();

      if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
          edad--;
      }

      return edad;
 }




 function GetCategory(select){
				
  var url=document.getElementById('ruta').value;
  $.ajax({
    url:''+url+'/api/category',
    type:'GET',
    data: {
        "id_user": id_user,
        "token"  : tokens,
      },
    dataType:'JSON',
    async: false,
    beforeSend: function(){
    // mensajes('info', '<span>Buscando, espere por favor... <i class="fa fa-spinner fa-spin" aria-hidden="true"></i></span>');
    },
    error: function (data) {
      //mensajes('danger', '<span>Ha ocurrido un error, por favor intentelo de nuevo</span>');         
    },
    success: function(data){
      $(select+" option").remove();
      $(select).append($('<option>',
      {
        value: "null",
        text : "Seleccione"
      }));
      $.each(data, function(i, item){
        if (item.status == 1) {
          $(select).append($('<option>',
          {
            value: item.id_category,
            text : item.nombre
          }));
        }
      });

    }
  });
}






function GetClients(select, value_default = false){

  var url=document.getElementById('ruta').value;
  $.ajax({
    url:''+url+'/api/clients',
    type:'GET',
    data: {
        "id_user": id_user,
        "token"  : tokens,
      },
    dataType:'JSON',
      
    beforeSend: function(){
    // mensajes('info', '<span>Buscando, espere por favor... <i class="fa fa-spinner fa-spin" aria-hidden="true"></i></span>');
    },
    error: function (data) {
      //mensajes('danger', '<span>Ha ocurrido un error, por favor intentelo de nuevo</span>');         
    },
    success: function(data){

      $(select).each(function() {
        if (this.selectize) {
          this.selectize.destroy();
        }
     });


      $(select+" option").remove();
      $(select+" optgroup").remove();
      $(select).append($('<option>',
      {
        value: "null",
        text : "Seleccione"
      }));

      var html_clients = "";
      $.each(data.clients_people, function(i, item){

        var option = item.id_clients_people+"|0"

        if (item.status == 1) { 

          var selected = ""
          if(option == value_default){
            selected = "selected"
          }
          
          html_clients += "<option "+selected+" value='"+item.id_clients_people+"|0'>"+item.names+" "+item.last_names+"</option>"
        }
      });

      var options_clients =  "<optgroup label='personas'>"+html_clients+"</optgroup>"
      $(select).append(options_clients)





      var html_company = "";
      $.each(data.clients_company, function(i, item){

        var option = item.id_clients_company+"|1"
        
        if (item.status == 1) {
          var option = item.id_clients_company+"|1"
          var selected = ""
          if(option == value_default){
            selected = "selected"
          }


          html_company += "<option "+selected+" value='"+item.id_clients_company+"|1'>"+item.business_name+"</option>"
        }
      });
      var options_company =  "<optgroup label='empresas'>"+html_company+"</optgroup>"
      $(select).append(options_company)

      $(select).selectize({
        //sortField: 'text'
      });
    }
  });
}





function showNoty(type, position, msg, time){
    noty({
      theme: 'app-noty',
      text: msg,
      type: type,
      timeout: time,
      layout: position,
      closeWith: ['button', 'click'],
      animation: {
        open: 'noty-animation fadeIn',
        close: 'noty-animation fadeOut'
      }
    });
}




function DeleteTr(tr) {
  $(tr).remove()
}







function GetBranchs(select){
				
  var url=document.getElementById('ruta').value;
  $.ajax({
    url:''+url+'/api/branchs',
    type:'GET',
    data: {
        "id_user": id_user,
        "token"  : tokens,
      },
    dataType:'JSON',
    async: false,
    beforeSend: function(){
    // mensajes('info', '<span>Buscando, espere por favor... <i class="fa fa-spinner fa-spin" aria-hidden="true"></i></span>');
    },
    error: function (data) {
      //mensajes('danger', '<span>Ha ocurrido un error, por favor intentelo de nuevo</span>');         
    },
    success: function(data){
      $(select+" option").remove();
      $(select).append($('<option>',
      {
        value: "null",
        text : "Seleccione"
      }));
      $.each(data, function(i, item){
        if (item.status == 1) {
          $(select).append($('<option>',
          {
            value: item.id_branchs,
            text : item.name
          }));
        }
      });

    }
  });
}







function GetInsurers(select, select_default = false){
				
  var url=document.getElementById('ruta').value;
  $.ajax({
    url:''+url+'/api/insurers',
    type:'GET',
    data: {
        "id_user": id_user,
        "token"  : tokens,
      },
    dataType:'JSON',
    async: false,
    beforeSend: function(){
    // mensajes('info', '<span>Buscando, espere por favor... <i class="fa fa-spinner fa-spin" aria-hidden="true"></i></span>');
    },
    error: function (data) {
      //mensajes('danger', '<span>Ha ocurrido un error, por favor intentelo de nuevo</span>');         
    },
    success: function(data){

      $(select).each(function() {
        if (this.selectize) {
          this.selectize.destroy();
        }
     });
     
      $(select+" option").remove();
      $(select).append($('<option>',
      {
        value: "null",
        text : "Seleccione"
      }));
      $.each(data, function(i, item){
        if (item.status == 1) {
          $(select).append($('<option>',
          {
            value: item.id_insurers,
            text : item.name,
            selected: select_default == item.id_insurers ? true : false
          }));
        }
      });

      

      $(select).selectize({});
    }
  });
}






function GetRamos(select){
				
  var url=document.getElementById('ruta').value;
  $.ajax({
    url:''+url+'/api/branchs',
    type:'GET',
    data: {
        "id_user": id_user,
        "token"  : tokens,
      },
    dataType:'JSON',
    async: false,
    beforeSend: function(){
    // mensajes('info', '<span>Buscando, espere por favor... <i class="fa fa-spinner fa-spin" aria-hidden="true"></i></span>');
    },
    error: function (data) {
      //mensajes('danger', '<span>Ha ocurrido un error, por favor intentelo de nuevo</span>');         
    },
    success: function(data){
      $(select+" option").remove();
      $(select).append($('<option>',
      {
        value: "null",
        text : "Seleccione"
      }));
      $.each(data, function(i, item){
        if (item.status == 1) {
          $(select).append($('<option>',
          {
            value: item.id_branchs,
            text : item.name,
            
          }));
        }
      });


      $(select).selectize({
        //sortField: 'text'
      });
    }
  });
}








function GetPolicies(select, select_default = false){
				
  var url=document.getElementById('ruta').value;
  $.ajax({
    url:''+url+'/api/policies',
    type:'GET',
    data: {
        "id_user": id_user,
        "token"  : tokens,
      },
    dataType:'JSON',
    async: false,
    beforeSend: function(){
    // mensajes('info', '<span>Buscando, espere por favor... <i class="fa fa-spinner fa-spin" aria-hidden="true"></i></span>');
    },
    error: function (data) {
      //mensajes('danger', '<span>Ha ocurrido un error, por favor intentelo de nuevo</span>');         
    },
    success: function(data){

      $(select).each(function() {
        if (this.selectize) {
          this.selectize.destroy();
        }
     });
     
      $(select+" option").remove();
      $(select).append($('<option>',
      {
        value: "null",
        text : "Seleccione"
      }));
      $.each(data, function(i, item){
        
        if (item.status == 1) {
          $(select).append($('<option>',
          {
            value: item.id_policies,
            text : item.number_policies,
            selected: select_default == item.id_policies ? true : false
          }));
        }
      });

      $(select).selectize({
        //sortField: 'text'
      });
    }
  });
}



function number_format(amount, decimals) {   
  amount += ''; // por si pasan un numero en vez de un string
  amount = parseFloat(amount.replace(/[^0-9\.]/g, ''));
  // elimino cualquier cosa que no sea numero o punto 
  decimals = decimals || 0; // por si la variable no fue fue pasada  
  // si no es un numero o es igual a cero retorno el mismo cero 
  if (isNaN(amount) || amount === 0)      
      return parseFloat(0).toFixed(decimals);     
      // si es mayor o menor que cero retorno el valor formateado como numero   
      amount = '' + amount.toFixed(decimals);   
      var amount_parts = amount.split('.'),    
      regexp = /(\d+)(\d{3})/;       
      while (regexp.test(amount_parts[0]))  
      amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2'); 
      return amount_parts.join('.');  
}

$(".monto_formato_decimales").change(function() {   
  if($(this).val() != ""){  
    $(this).val(number_format($(this).val(), 2));   
  }       
});



function inNum(monto) {
	var cantidad           = monto;
	var myNumeral          = numeral(cantidad);
    return myNumeral.value();
}



	// Side Nav
	function sideNav() {
		$('.side-nav .side-nav-menu li a').on('click', function(e) {
			if ($(this).parent().hasClass("open")) {

				$(this).parent().children('.dropdown-menu').slideUp(200, function() {
					$(this).parent().removeClass("open");
				});

			} else {
				$(this).parent().parent().children('li.open').children('.dropdown-menu').slideUp(200);
				$(this).parent().parent().children('li.open').children('a').removeClass('open');
				$(this).parent().parent().children('li.open').removeClass("open");
				$(this).parent().children('.dropdown-menu').slideDown(200, function() {
					$(this).parent().addClass("open");
				});
			}
		});
	}	
	
	// Side Nav Toogle
	function sideNavToggle() {
		$('.side-nav-toggle').on('click', function(e) {
	        $('.app').toggleClass("is-collapsed");
	        e.preventDefault();
	    });
	}	

	// Side Panel Toogle
	function sidePanelToggle() {
		$('.side-panel-toggle').on('click', function(e) {
	        $('.side-panel').toggleClass("side-panel-open");
	        e.preventDefault();
	    });
	}	

	// Chat Toggle
	function chatToggle() {
		$('.chat-toggle').on('click', function(e) {
	        $('.chat').toggleClass("open");
	        e.preventDefault();
	    });
	}	

	// Todo Toggle
	function todoToggle() {
		$('.todo-toggle').on('click', function(e) {
	        $('.todo-wrapper').toggleClass("open");
	        e.preventDefault();
	    });
	}	

	// Search Toggle 
	function searchToggle() {
		$('.search-toggle').on('click', function(e) {
			$('.search-box, .search-input').toggleClass("active");
			$('.search-input input').focus();
			e.preventDefault();
		});
	}	

	// Advance Search
	function advanceSearch() {
		$('.search-input input').on('keyup',function(){
			if($(this).val().length > 0) {
				$('.advanced-search').addClass("active");
			} 
			else {
		       $('.advanced-search').removeClass("active");
		    }
		    $('.serach-text-bind').html($(this).val());
		})	
	} 

	// Theme Configurator
	function themeConfig() {
		$('.theme-toggle, .config-close').on('click', function(e) {
	        $('.theme-configurator').toggleClass("theme-config-open");
	        e.preventDefault();
	    });
	}	

	// Perfect Scroll Bar
	function perfectSB() {
		$('.scrollable').perfectScrollbar();
	}

	//Card Portlet Refresh
	function cardPortletCtrl() {

		//card refresh
		$('[data-toggle=card-refresh]').on('click',function(e) {
			var cardRefreshSelector = $(this).parents('.card');
		    cardRefreshSelector.addClass('card-refresh');
		    window.setTimeout(function () {
		        cardRefreshSelector.removeClass('card-refresh');
		    }, 2000);
		    e.preventDefault();
		    e.stopPropagation();
		});

		//card delete
		$('[data-toggle=card-delete]').on('click',function(e) {
			var cardDeleteSelector = $(this).parents('.card');
		    cardDeleteSelector.addClass('animated zoomOut');
		    cardDeleteSelector.bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
		        cardDeleteSelector.remove();
		    });
		    e.preventDefault();
		    e.stopPropagation();
		});
	}

	//Theme Config 
	function themeColorConfig() {

		$(".header-default input").change(function() {
            $('.app').removeClass("header-primary header-info header-success header-danger header-dark");
		})

		$(".header-info input").change(function() {
		    $('.app').addClass("header-info")
            $('.app').removeClass("header-primary header-success header-danger header-dark");
		});

		$(".header-primary input").change(function() {
		    $('.app').addClass("header-primary")
            $('.app').removeClass("header-info header-success header-danger header-dark");
		});

		$(".header-success input").change(function() {
		    $('.app').addClass("header-success")
            $('.app').removeClass("header-info header-primary header-danger header-dark");
		});

		$(".header-danger input").change(function() {
		    $('.app').addClass("header-danger")
            $('.app').removeClass("header-info header-primary header-success header-dark");
		});

		$(".header-dark input").change(function() {
		    $('.app').addClass("header-dark")
            $('.app').removeClass("header-info header-primary header-success header-danger");
		});

		$(".theme-colors.side-nav-dark input").change(function() {
		    $('.app').addClass("side-nav-dark")
            $('.app').removeClass("side-nav-default");
		});

		$(".theme-colors.sidenav-default input").change(function() {
		    $('.app').addClass("side-nav-default")
            $('.app').removeClass("side-nav-dark");
		});

		$('#rtl-toogle').on('click', function(e) {
	        $('.app').toggleClass("rtl");
	        e.preventDefault();
	    });
	}	



function init() {
  sideNav();
 // sideNavToggle();
  sidePanelToggle();
  chatToggle();
  todoToggle();
  searchToggle();
  advanceSearch();
  themeConfig();
  perfectSB();
  cardPortletCtrl();
  themeColorConfig();
}




function GetTypeSubCompany(select, select_default = false){
				
  var url=document.getElementById('ruta').value;
  $.ajax({
    url:''+url+'/api/sub/company',
    type:'GET',
    data: {
        "id_user": id_user,
        "token"  : tokens,
      },
    dataType:'JSON',
    async: false,
    beforeSend: function(){
    // mensajes('info', '<span>Buscando, espere por favor... <i class="fa fa-spinner fa-spin" aria-hidden="true"></i></span>');
    },
    error: function (data) {
      //mensajes('danger', '<span>Ha ocurrido un error, por favor intentelo de nuevo</span>');         
    },
    success: function(data){

      $(select).each(function() {
        if (this.selectize) {
          this.selectize.destroy();
        }
     });
     
      $(select+" option").remove();
      $(select).append($('<option>',
      {
        value: "null",
        text : "Seleccione"
      }));

      console.log(data)
      $.each(data, function(i, item){
        
        if (item.status == 1) {
          $(select).append($('<option>',
          {
            value: item.id_type_sub_company,
            text : item.name,
            selected: select_default == item.id_type_sub_company ? true : false
          }));
        }
      });

      $(select).selectize({
        //sortField: 'text'
      });
    }
  });
}







function GetUsers(select, select_default = false){
				
  var url=document.getElementById('ruta').value;
  $.ajax({
    url:''+url+'/api/user',
    type:'GET',
    data: {
        "id_user": id_user,
        "token"  : tokens,
      },
    dataType:'JSON',
    async: false,
    beforeSend: function(){
    // mensajes('info', '<span>Buscando, espere por favor... <i class="fa fa-spinner fa-spin" aria-hidden="true"></i></span>');
    },
    error: function (data) {
      //mensajes('danger', '<span>Ha ocurrido un error, por favor intentelo de nuevo</span>');         
    },
    success: function(data){

      $(select).each(function() {
        if (this.selectize) {
          this.selectize.destroy();
        }
     });
     
      $(select+" option").remove();
      $(select).append($('<option>',
      {
        value: "null",
        text : "Seleccione"
      }));

      $.each(data, function(i, item){
        
        if (item.status == 1) {
          $(select).append($('<option>',
          {
            value: item.id,
            text : item.nombres+" "+item.apellido_p,
            selected: select_default == item.id_type_sub_company ? true : false
          }));
        }
      });

      $(select).selectize({
        //sortField: 'text'
      });
    }
  });
}


