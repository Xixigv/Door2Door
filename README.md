
  # Door2Door Services Page

  This is a code bundle for Door2Door Services Page. The original project is available at https://www.figma.com/design/y3DVj7DvlW71cWfNBJYLYA/Door2Door-Services-Page.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  

  ## Pasos para hacer deploy de la arquitectura

### 1. Desplegar BD de auroraDsql

  Nos vamos al servicio de AuroraDSQL, presionamos el botón que dice crear un Cluster y seleccionamos en una sola región.
  Ponemos cualquier nombre dejamos el resto de configuraciones por defecto y seleccionamos crear cluster.

  Entramos al recurso y seleccionamos :
    
    Conectar con el editor de consultas -> Conectar con cloudshell
  Nos conectamos como administrador y ejecutamos los siguientes comandos.

  ```postgresql
  CREATE SCHEMA webApp;
  SET search_path TO webApp;

  CREATE TABLE users (
    id BIGINT,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    isprovider BOOLEAN NOT NULL,
    createdat TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  );
  ```

  Antes de pasar al próximo paso buscar los siguientes valores id de cluster y cluster endpoint, anotarlos en un bloc de notas y seguir.

### 2. Desplegar BD de DynamoDb

  Buscamos el Servicio de DynamoDB, seleccionamos el botón de Crear Tabla, a continuación crearemos un total de 7 tablas.

  **Es importante escribir el nombre de todos los recursos tal y como se dice, si no, no funcionará el sistema**

  **Para crear una tabla:**

  - Escribimos el nombre _nombreTabla_ 
  - Clave de Partición escribimos el nombre _nombreClave_ y especificamos el tipo
  - **(Paso Opcional)** Clave de ordenación escribimos el nombre _nombreClaveOrdenación_ y seleccionamos el tipo
  - Dejamos todo como está y procedemos a crear tabla

  En caso de que sea tabla con multiples indices se hace lo siguiente:
  - Abrimos dicha tabla y presionamos en la cinta de opciones la que dice Indices
  - Presionamos el botón que dice Crear índice
  - Escribimos el nombre _nombreIndice_ seleccionamos el tipo de dato
  - Dejamos todo como está y procedemos a crear tabla

  Requerimientos de las tablas

    Tabla (Bookings) -> Clave de particion (id) -> Tipo (Numero)
      Indice (providerId-index) -> Clave de Particion (providerId) -> Tipo (Numero)
      Indice (userId-index) -> Clave de Particion (userId) -> Tipo (Numero)

    Tabla (messages) -> Clave de particion (conversationID) -> Tipo (String) -> Clave de ordenacion (timestamp) -> Tipo (Numero)

    Tabla (Providers) -> Clave de particion (id) -> Tipo (Numero)

    Tabla (Reviews) -> Clave de particion (id) -> Tipo (Numero)
      Indice (providerId-index) -> Clave de Particion (providerId) -> Tipo (Numero)

    Tabla (Services) -> Clave de particion (id) -> Tipo (Numero)

    Tabla (Users) -> Clave de particion (id) -> Tipo (Numero)

    Tabla (websocket-connections) -> Clave de particion (connectionID) -> Tipo (String)

### 3. Crear persona en IAM y obtener credenciales

  Buscamos el servicio de IAM, en la cinta izquierda buscaremos la parte de Personas y haremos click.
  
  Presionamos el botón de Crear persona:
  - Nombre de usuario: webApp
  
  Damos click en siguiente
  - En opciones de permisos escogemos _Adjuntar políticas directamente_
  - En políticas de permisos escogemos:
    - AmazonAuroraDSQLConsoleFullAccess
    - AmazonAuroraDSQLFullAccess
    - AmazonDynamoDBFullAccess
    - SecretsManagerReadWrite

  Damos click en siguiente, revisamos el resumen y damos a crear usuario.

  En la cinta de en medio buscamos la opción de _Credenciales de Seguridad_ y hacemos click. Bajamos buscando la opción de _Crear clave de acceso_ y hacemos click.
  
  En caso de uso seleccionamos:
  - Aplicación ejecutada fuera de AWS
  
  Presionamos siguiente y después presionamos _Crear clave de seguridad_

  **Importante**

  En la ventana de Recuperar claves de acceso copiaremos a un bloc de notas de momento la **Clave de acceso** y la **Clave de acceso secreta**

  **Es de suma importancia guardar estas claves ya que servirán para que nuestro código se pueda conectar a la base de datos**

### 4. Ejecutar script deployChat.yaml

  Buscamos el servicio CloudFormation

  Presionamos el botón _Crear Pila_ -> _Con recursos nuevos (estándar)_

  En _Especificar plantilla_ seleccionamos la opción de cargar un archivo de plantilla y subimos el archivo deployChat.yaml, das click en siguiente.

  Escribimos un nombre cualquiera para la pila, das click en siguiente.

  Hasta abajo de la página te pide que aceptes dar permisos para crear recursos en IAM, das click y después en siguiente.

  Revisas que todo este correcto y das click en Crear pila.

  Esperar a que se levante por completo y en la cinta de opciones nos vamos a salidas, buscamos hasta el final la salida de HTTP Endpoint y WSS ENDPOINT los copiamos y los guardamos en un bloc de notas.

### 5. Crear bucket s3

  Creamos un bucket s3 con el nombre que sea, este nos servirá para cargar el ngingx.conf y el archivo .env

### 6. Crear archivo .env

  Creamos un archivo .env con el siguiente formato

    AWS_ACCESS_KEY_ID=<your-acces-key-id>
    AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
    CLUSTER_ID=<your-cluster-id>
    CLUSTER_ENDPOINT=<your-cluster-endpoint>
    CLUSTER_USER=admin
    AWS_REGION=<your-aws-region>
    WS_API_URL=<your-websocket-api-gateway-url>
    LAMBDA_API_URL=<your-http-api-gateway-url>

  Para las url de las api gateway recuerda que no tienen que tener al final ´/´ es decir tienen que ser de la forma _http://api.com_

  No tienen que ser de la forma _http://api.com/

  Al final guardas en el archivo en el bucket de s3 con el nombre de .env y también lo guardas en tu ambiente local para posteriormente poder cargar la información.

### 7. Cargar información a las bases de datos

  **Se debe instalar la aplicación Node JS e instalar las dependencias mencionadas en el archivo package.json, ejecutar el comando `npm install` en la carpeta raíz es suficiente para instalar los paquetes**

  Dentro de la carpeta de:

     src->data

  Se encuentran una serie de archivos primero tienes que abrir el archivo _insertData.mjs_ dentro tendras que buscar la linea _import dataTable from_ seguido de un archivo json y luego buscarás la variable _tableName_ para llenar todas las tablas tendras que ir cambiando los valores correspondientes de la siguiente manera:
  
  ```JavaScript
  // Tabla Bookings
  import dataTable from "./bookingHistory.json" assert { type: "json" };
  const tableName = "Bookings";
  // Tabla Reviews
  import dataTable from "./reviews.json" assert { type: "json" };
  const tableName = "Reviews";
  // Tabla Users
  import dataTable from "./user.json" assert { type: "json" };
  const tableName = "Users";
  // Tabla Providers
  import dataTable from "./providersDetails.json" assert { type: "json" };
  const tableName = "Providers";
  // Tabla Services
  import dataTable from "./ServicesDetails.json" assert { type: "json" };
  const tableName = "Services";
  ```

  Una vez hecha la modificación ejecutar el archivo, si es necesario, modificar la ubicación del archivo .env para poder ejecutarlo.

  Para insertar los valores en Aurora ahora abrir el archivo insertDataAurora.js, si es necesario, modificar la ubicación del archivo .env y ejecutar el archivo.

  Revisar que los datos se hayan cargado exitosamente.

### 8. Ejecutar script deployWholeInfrastructure.yaml

  Cargar el archivo nginx.conf encontrado en este repositorio y subirlo a s3

  Abrir el archivo y buscar el tag _<your-bucket-name>_ para poder reemplazar la dirección para obtener tanto los archivos .env como el archivo de nginx.conf.

  Crear un KeyPair para poder acceder a las instancias por ssh y anotar el nombre en el parámetro _KeyPairName_

  Buscamos el servicio CloudFormation

  Presionamos el botón _Crear Pila_ -> _Con recursos nuevos (estándar)_

  En _Especificar plantilla_ seleccionamos la opción de cargar un archivo de plantilla y subimos el archivo deployWholeInfrastructure.yaml, das click en siguiente.

  Escribimos un nombre cualquiera para la pila, aquí puedes modificar las variables de instancias levantadas deseadas, el máximo y el mínimo, das click en siguiente.

  Hasta abajo de la página te pide que aceptes dar permisos para crear recursos en IAM, das click y después en siguiente.

  Revisas que todo este correcto y das click en Crear pila.

  Esperar a que se levante por completo y en la cinta de opciones nos vamos a salidas, buscamos la salida que diga Web Tier Load Balancer hacemos click en el link y deberías poder entrar a la página. A veces tarda un poco más en inicializarse las instancias web por lo que puede dar error 504, esperar un momento y refrescar la página.


# Flujo Sugerido para probar aplicación

  - Entrar a home, buscar el botón de login
  - Crear una nueva cuenta
  - Regresar a la pagina de home
  - Presionar sobre un servicio Popular
  - Presionar Schedule
  - Llenar los datos
  - Presionar confirmar