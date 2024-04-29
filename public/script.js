// Supongamos que estás intentando obtener un formulario con el ID 'mi-formulario'
let formulario = document.getElementById('formulario');

if (formulario) {
  async function gemini(img64){
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=AIzaSyDS00vauZ81onTeqU_e6R9zVLl1Yx6mw9s`
    const data = `{
      "contents":[
        {
          "parts":[
            {
              "text": "What is this picture?"
            },
            {
              "inline_data": {
                "mime_type":"image/jpeg",
                "data": "`+img64+`"
              }
            }
          ]
        }
      ]
    }`;

    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    });
    
    const text = await response.text();
    const resp = JSON.parse(text);
    document.getElementById("p1").innerHTML = resp.candidates[0].content.parts[0].text;
    const img = document.getElementById("im64").textContent;
    console.log(img);
  
  }
  function encode() {

    var selectedfile = document.getElementById("imagen").files;
    if (selectedfile.length > 0) {
        var imageFile = selectedfile[0];
        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result;
            var newImage = document.createElement('img');
            newImage.src = srcData;
            var img64=srcData;
            document.getElementById("dummy").innerHTML = newImage.outerHTML;
            document.getElementById("im64").innerHTML=img64.substring(23);
            gemini(img64.substring(23));
  
            // Guardar la imagen en texto en un campo oculto del formulario
            document.getElementById('imagenTexto').value = img64.substring(23);
        }
        fileReader.readAsDataURL(imageFile);
    }
  }
  
  formulario.addEventListener('change', function() {
    var image = document.getElementById('imagen');
    var submitButton = document.getElementById('enviar-formulario');
    if (image.files.length > 0) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
  });

  formulario.addEventListener('submit', async function(e) {
    e.preventDefault();

    const idEmpleado = document.getElementById('idEmpleado').value;
    const nombreProducto = document.getElementById('nombreProducto').value;
    const prioridad = document.getElementById('prioridad').value;
    const descripcion = document.getElementById('descripcion').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    const aprobado = 0;
    const completado = 0;
    const imagenTexto = document.getElementById('imagenTexto').value;
  
    const data = { idEmpleado, nombreProducto, prioridad, descripcion, latitude, longitude, aprobado, imagenTexto, completado};
    console.log('Sending data:', data);
    
    const response = await fetch('https://us-central1-fb-api-1fbee.cloudfunctions.net/app/api/reportes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al enviar el reporte');
    }

if (response.status !== 204) {
  const data = await response.json();
  // Haz algo con los datos
}

alert('Reporte enviado con éxito');
  });
}
// Verificar si estamos en la página correcta
if (window.location.pathname === '/reportes.html') {
  console.log("Estas vivo codigo?");
  // Obtener y mostrar todos los reportes
  fetch('https://us-central1-fb-api-1fbee.cloudfunctions.net/app/api/reportes')
  .then(response => response.json())
  .then(reportes => {
      // Crear la tabla y agregarle las clases de Bootstrap
      let table = document.createElement('table');
      table.className = 'table table-striped table-hover';

      // Crear los títulos de las columnas
      let thead = document.createElement('thead');
      let headerRow = document.createElement('tr');
      ['Id del reporte', 'Id del Empleado', 'Nombre Producto', 'Prioridad', 'Descripción', 'Latitud', 'Longitud', 'Aprobado', 'completado'].forEach(text => {
      let th = document.createElement('th');
      th.textContent = text;
      headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Crear el cuerpo de la tabla
      let tbody = document.createElement('tbody');

      reportes.forEach(reporte => {
          let row = document.createElement('tr');
          let descripcionCorta = reporte.descripcion.substring(0, 20);
          if (reporte.descripcion.length > 20) {
              descripcionCorta += '...';
          }
          [reporte.id, reporte.idEmpleado, reporte.nombreProducto, reporte.prioridad, descripcionCorta, reporte.latitude, reporte.longitude, reporte.aprobado, reporte.completado].forEach(text => {
              let td = document.createElement('td');
              td.textContent = text;
              row.appendChild(td);
          });

      // Crear el botón
      let buttonTd = document.createElement('td');
      let button = document.createElement('button');
      button.textContent = 'Ver reporte';
      button.className = 'btn btn-primary';  // Agregar clases de Bootstrap al botón

      // Agregar un controlador de eventos al botón
      button.addEventListener('click', function() {
          // Redirigir al usuario a la vista del reporte específico
          window.location.href = '/VistaReporte.html?id=' + reporte.id;
      });

      buttonTd.appendChild(button);
      row.appendChild(buttonTd);

      tbody.appendChild(row);
      });
      table.appendChild(tbody);

      // Agregar la tabla al DOM
      console.log(table);
      console.log(document.getElementById('reportes-table'));
      document.getElementById('reportes-table').appendChild(table);
  })
  .catch(error => console.error('Error:', error));

}



// Verificar si el ID del reporte está presente
if (window.location.pathname === '/VistaReporte.html') {
  // Obtener el ID del reporte de la URL
let urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get('id');
console.log(id + "Estas vivo id? parte 1") 
  console.log(id + "Estas vivo id? parte 2")
  document.addEventListener('DOMContentLoaded', (event) => {
    // Hacer una solicitud GET a la API para obtener la información del reporte
    fetch('https://us-central1-fb-api-1fbee.cloudfunctions.net/app/api/reportes/' + id)
    .then(response => response.json())
    .then(reporte => {
      // Mostrar la información del reporte en la página
      document.getElementById('id').textContent = id;
      if (reporte.idEmpleado) {
        document.getElementById('idEmpleado').textContent = reporte.idEmpleado;
      }
      document.getElementById('nombreProducto').textContent = reporte.nombreProducto;
      document.getElementById('prioridad').textContent = reporte.prioridad;
      document.getElementById('descripcion').textContent = reporte.descripcion;
      document.getElementById('latitude').textContent = reporte.latitude;
      document.getElementById('longitude').textContent = reporte.longitude;
      document.getElementById('aprobado').textContent = reporte.aprobado;
      document.getElementById('completado').textContent = reporte.completado;


            // Decodificar y mostrar la imagen
      const base64Text = reporte.imagenTexto;
      const base64Content = base64Text.split(";base64,").pop();
      const imageData = atob(base64Content);
      const arrayBuffer = new Uint8Array(imageData.length);
      for (let i = 0; i < imageData.length; i++) {
        arrayBuffer[i] = imageData.charCodeAt(i);
      }
      const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      const imgElement = document.createElement('img');
      imgElement.src = imageUrl;
      imgElement.style.width = '60%'; // Ajusta el ancho de la imagen a 50% del contenedor
      imgElement.style.height = '60%'; // Ajusta la altura de la imagen a 2rem
      document.getElementById('imagenTexto').appendChild(imgElement);

      // Agregar eventos de clic a los botones
      document.getElementById('toggleAprobado').addEventListener('click', function() {
        toggleValue('aprobado');
      });

      document.getElementById('toggleCompletado').addEventListener('click', function() {
        toggleValue('completado');
      });

      async function toggleValue(field) {
        var currentValue = document.getElementById(field).textContent;
        var newValue = currentValue == '0' ? '1' : '0';

        const response = await fetch('https://us-central1-fb-api-1fbee.cloudfunctions.net/app/api/reportes/' + id ,{
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            field: field,
            value: newValue
          })

        });
        const text = await response.text();
        console.log(text);

        // Si la solicitud fue exitosa, actualiza el contenido del elemento HTML
        if (response.ok) {
          document.getElementById(field).textContent = newValue;
        }
      }
    })
  })
}
  
// Verificar si estamos en la página correcta
if (window.location.pathname === '/listaEmpleados.html' || 'listaEmpleados2.html') {
  // Verificar si el elemento donde deseas insertar la tabla existe
  const empleadosTable = document.getElementById('empleados-table');
  if (empleadosTable) {
    // Hacer una solicitud GET a la API para obtener la información de los empleados
    fetch('https://us-central1-fb-api-1fbee.cloudfunctions.net/app/api/empleados')
    .then(response => response.json())
    .then(empleados => {
      // Crear una tabla
      let table = document.createElement('table');
      table.className = 'table table-striped';

      // Crear el encabezado de la tabla
      let thead = document.createElement('thead');
      let tr = document.createElement('tr');
      ['ID', 'Nombre', 'Rol', 'Puntos', 'FechaIngreso'].forEach(headerText => { // Eliminado 'Puntos'
        let th = document.createElement('th');
        th.textContent = headerText;
        tr.appendChild(th);
      });
      thead.appendChild(tr);
      table.appendChild(thead);

      // Crear el cuerpo de la tabla
      let tbody = document.createElement('tbody');
      empleados.forEach(empleado => {
        let tr = document.createElement('tr');
        [empleado.id, empleado.nombreCompleto, empleado.Rol, empleado.Puntos, empleado.fecha].forEach(text => { // Eliminado empleado.Puntos
          let td = document.createElement('td');
          td.textContent = text;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);

      // Agregar la tabla al elemento 'empleados-table'
      empleadosTable.appendChild(table);
    })
    .catch(error => console.error('Error:', error));
  }
}
// Verificar si estamos en la página correcta
if (window.location.pathname === '/leaderboard.html') {
  // Verificar si el elemento donde deseas insertar la tabla existe
  const leaderboardTable = document.getElementById('leaderboard-table');
  if (leaderboardTable) {
    // Hacer una solicitud GET a la API para obtener la información de los empleados
    fetch('https://us-central1-fb-api-1fbee.cloudfunctions.net/app/api/leaderboard')
    .then(response => response.json())
    .then(empleados => {
      // Crear una tabla
      let table = document.createElement('table');
      table.className = 'table table-striped';

      // Crear el encabezado de la tabla
      let thead = document.createElement('thead');
      let tr = document.createElement('tr');
      ['Nombre', 'Puntos', 'Rol', 'FechaIngreso'].forEach(headerText => {
        let th = document.createElement('th');
        th.textContent = headerText;
        tr.appendChild(th);
      });
      thead.appendChild(tr);
      table.appendChild(thead);

      // Crear el cuerpo de la tabla
      let tbody = document.createElement('tbody');

      // Agregar una fila por cada empleado
      empleados.forEach(empleado => {
        let tr = document.createElement('tr');
        ['nombreCompleto', 'Puntos', 'Rol', 'fecha'].forEach(field => {
          let td = document.createElement('td');
          td.textContent = empleado[field];
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      leaderboardTable.appendChild(table);
    });
  }
}