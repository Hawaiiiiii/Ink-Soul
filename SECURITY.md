# Política de Seguridad - Ink & Soul

## Alcance del Programa

Este programa de divulgación de vulnerabilidades se aplica a todos los productos y servicios asociados con el proyecto Ink & Soul. Valoramos la seguridad de nuestros usuarios y agradecemos los esfuerzos de los investigadores de seguridad responsables que nos ayudan a mantener nuestro proyecto seguro.

## Vulnerabilidades que Buscamos

Estamos interesados en recibir informes sobre vulnerabilidades que podrían afectar la seguridad de nuestros usuarios y sistemas, incluyendo pero no limitándose a:

- Vulnerabilidades de inyección (SQL, NoSQL, LDAP, OS, etc.)
- Problemas de autenticación y gestión de sesiones
- Cross-Site Scripting (XSS) y Cross-Site Request Forgery (CSRF)
- Exposición de datos sensibles (credenciales, información personal)
- Escalación de privilegios local o remota
- Vulnerabilidades de configuración de seguridad
- Problemas de control de acceso
- Vulnerabilidades en APIs y endpoints
- Problemas de validación de entrada
- Inclusión de archivos locales o remotos
- Vulnerabilidades de serialización
- Problemas de lógica de negocio
- Ataques de denegación de servicio
- Vulnerabilidades de encriptación

## Alcance adicional: /admin

### Manejo de PII (Datos Personales)

La sección `/admin` maneja información personal identificable (PII) que requiere protección especial:

**Tipos de PII gestionados:**
- Nombres completos y direcciones de correo electrónico
- Información de perfiles de usuario
- Datos de autenticación y preferencias
- Metadatos de actividad de usuarios
- Información de contacto

**Medidas de protección:**
- Cifrado de datos sensibles en reposo y en tránsito
- Acceso estrictamente controlado por roles
- Auditoría completa de accesos a datos de usuarios
- Minimización de recolección de datos
- Políticas de retención y eliminación de datos

### Roles de Administrador

**Administrador Principal:**
- Acceso completo a todas las funcionalidades del panel administrativo
- Gestión de usuarios y permisos
- Acceso a configuraciones críticas del sistema
- Supervisión de logs y auditorías

**Administrador de Contenido:**
- Gestión de contenido del sitio web
- Moderación de publicaciones de usuarios
- Acceso limitado a métricas y reportes

**Administrador de Soporte:**
- Acceso a herramientas de atención al cliente
- Visualización limitada de datos de usuario necesarios para soporte
- Sin acceso a información de pago o credenciales

## Procedimiento de Reporte

### Reporte Privado vía GitHub Security

Para reportar vulnerabilidades de forma privada, utilice el sistema de seguridad integrado de GitHub:

1. **Vaya a la pestaña "Security" en el repositorio**
2. **Seleccione " advisories"**
3. **Haga clic en "Report a vulnerability"**
4. **Complete el formulario con los siguientes detalles:**
   - Descripción detallada de la vulnerabilidad
   - Pasos para reproducir el problema
   - Impacto potencial
   - Posibles soluciones (si las conoce)

### Información Requerida en el Reporte

**Para vulnerabilidades generales:**
- Descripción clara y concisa del problema
- Pasos de reproducción detallados
- Comportamiento esperado vs. observado
- Screenshots o logs relevantes (sin datos sensibles)
- Versión afectada del software
- Configuración del entorno

**Para vulnerabilidades en /admin:**
- **CRÍTICO:** NO incluya datos personales reales en el reporte
- Use datos ficticios para las pruebas
- Describa el tipo de PII que podría estar en riesgo
- Indique el nivel de acceso requerido para explotar la vulnerabilidad
- Mencione si la vulnerabilidad afecta la confidencialidad, integridad o disponibilidad de los datos

## SLA de Respuesta

Nos comprometemos a responder a todos los informes de seguridad dentro de los siguientes tiempos:

- **Acuse de recibo:** 24-48 horas
- **Evaluación inicial:** 3-5 días hábiles
- **Estado de clasificación:** 7 días hábiles
- **Actualizaciones de progreso:** Cada 7 días hasta la resolución
- **Tiempo objetivo de resolución:**
  - Críticas: 30 días
  - Altas: 60 días
  - Medias: 90 días
  - Bajas: 120 días

## Política de Divulgación

- **Divulgación responsable:** Coordinamos la divulgación para minimizar el riesgo a los usuarios
- **Ventana de tiempo:** Proporcionamos 90 días para resolver vulnerabilidades antes de la divulgación pública
- **Reconocimiento:** Reconocemos a los investigadores que nos ayudan (a menos que prefieran permanecer anónimos)
- **Divulgación completa:** Una vez resuelta la vulnerabilidad, se puede divulgar públicamente

## Qué NO Buscamos

- Ataques que requieran acceso físico al equipo
- Ingeniería social (phishing, baiting, tailgating)
- Ataques de denegación de servicio que interrompanservicios
- Vulnerabilidades en servicios de terceros
- Problemas en sitios web de terceros que enlazan a nuestro sitio
- Vulnerabilidades que requieren acceso de administrador ya comprometido
- Bugs relacionados con certificados SSL/TLS que no representen una vulnerabilidad exploitable
- Versiones desactualizadas de navegadores o plataformas

## Reconocimiento

Mantenemos una página pública de reconocimiento para investigadores de seguridad que contribuyen al proyecto:

- **Wall of Fame:** Lista de investigadores que han reportado vulnerabilidades exitosamente
- **Hall of Fame:** Reconocimiento especial por contribuciones significativas
- **Tiempo mínimo:** Las vulnerabilidades deben ser válidas y estar dentro del alcance

## Contacto

### Propietario del Repositorio

**Nombre:** Equipo de Desarrollo Ink & Soul  
**Email de Seguridad:** security@inkand soul.dev  
**Email General:** admin@inkand soul.dev  
**GitHub:** [@ink-and-soul-admin](https://github.com/ink-and-soul-admin)

### Tiempo de Respuesta del Contacto

- **Consultas generales de seguridad:** 48-72 horas
- **Vulnerabilidades urgentes:** 24 horas
- **Preguntas sobre el programa:** 48 horas

## Legal

### Buenas Prácticas

Al participar en nuestro programa, usted se compromete a:

- Reportar vulnerabilidades de manera responsable
- No acceder, modificar o eliminar datos de usuarios
- No degradar el rendimiento de nuestros servicios
- No realizar ingeniería social
- No solicitar compensación antes del reporte
- Mantener la confidencialidad de la información hasta que se resuelva la vulnerabilidad

### Protección Legal

- No emprenderemos acciones legales contra investigadores que sigan esta política
- Trabajamos de buena fe para resolver problemas de seguridad
- Reconocemos el trabajo de investigación responsable

## Actualizaciones de la Política

Esta política puede actualizarse periódicamente. Los cambios significativos serán comunicados a través de:

- Anuncios en el repositorio
- Notificaciones a investigadores que hayan reportado vulnerabilidades
- Página web oficial del proyecto

**Última actualización:** 6 de noviembre de 2025

---

**¡Gracias por ayudar a mantener Ink & Soul seguro para todos nuestros usuarios!**