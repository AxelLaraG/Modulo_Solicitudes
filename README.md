# Nexa - Request Management Portal 

Plataforma Full-Stack desarrollada en Next.js para la captura, seguimiento y administración centralizada de solicitudes corporativas. El sistema proporciona un flujo de trabajo optimizado desde la ingesta de datos a través de formularios dinámicos hasta la persistencia y exportación de reportes analíticos.

## Características Principales

* **Arquitectura Full-Stack (Serverless):** Implementación de rutas de API integradas (`/api/solicitudes`) utilizando el App Router de Next.js para el manejo seguro de operaciones CRUD/route.js].
* **Persistencia de Datos NoSQL:** Modelado robusto de datos e integración con MongoDB mediante Mongoose para garantizar la consistencia de los registros (`solicitud.js`).
* **Generación de Reportes Empresariales:** Funcionalidad nativa para procesar y exportar los conjuntos de datos de solicitudes a formatos tabulares interactivos (`exportToExcel.js`).
* **Interfaz Responsiva y Moderna:** Sistema de diseño construido íntegramente con Tailwind CSS, garantizando tiempos de carga óptimos y adaptabilidad en cualquier dispositivo.

## Stack Tecnológico

* **Framework Principal:** Next.js (App Router).
* **Frontend:** React, Tailwind CSS.
* **Backend:** Node.js, Next.js API Routes.
* **Base de Datos:** MongoDB (Mongoose ORM).

## Instalación y Configuración Local

1. **Clonar el repositorio:**
   ```
     git clone https://github.com/AxelLaraG/request-management-portal.git
     cd request-management-portal
   ```
2. **Instalar Dependencias:**
  ```bash
    npm install
  ```
3. **Configuración de Variables de Entorno:**
  Crea un archivo `.env.local` en la raíz del proyecto. Deberás incluir la cadena de conexión a tu clúster de MongoDB:
    ```
      MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/tu_base_de_datos
    ```
4. Ejecutar el servidor de desarrollo:
  ```bash
    npm run dev
  ```
## Estructura del proyecto
La arquitectura del proyecto sigue las convenciones modernas de Next.js:

- `/src/app`: Contiene las rutas de interfaz de usuario (/formulario, /) y la lógica de renderizado.
- `/src/app/api`: Endpoints del backend que actúan como controladores para las transacciones con la base de datos.
- `/src/components`: Componentes reutilizables de React que conforman la interfaz gráfica.
- `/src/models` & `/src/libs`: Definición de esquemas de datos y gestión de la conexión a la base de datos para prevenir saturación de conexiones en entornos serverless.
