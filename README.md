# 🧙‍♂️ Hackathon: Casas de Hogwarts – Tienda Mágica de Animales y Herbolaria ✨


![Animales Mágicos](https://github.com/velazquez-diego-ant/Hufflepuff-CH71/blob/5993f58a6e8429cb2f4491995b1c90cfcf8383f0/assets/logo.jpeg)

¡Bienvenido al repositorio oficial de nuestro proyecto para la **Hackathon de las Casas de Hogwarts**! 🏰✨  
Hemos creado una **tienda mágica en línea** inspirada en los valores y la estética de **Hufflepuff** 🦡💛🖤, centrada en el cuidado de criaturas fantásticas y la botánica mágica.

---

## 👥 Equipo y Distribución de Tareas

Alineado con el mapa de arquitectura del proyecto y las labores de soporte técnico:

| 🪄 Módulo / Sección | 👤 Integrantes Asignados | 🛠️ Tareas y Componentes |
|---|---|---|
| **🏠 Inicio** | **Mafer**, **Jaz**, **Aslan** | 🧭 NavBar general<br>📜 Div de Reclutamiento<br>🛍️ Div principal de la tienda |
| **📜 Sobre Hufflepuff & Reclutamiento** | **Jaime**, **Dayana** | 📝 Formulario interactivo del Sombrero Seleccionador |
| **🐾 Tienda: Animales & Herbolaria** | **Brenfer**, **Adrian**, **Christian**, **Zaira** | 🖼️ Cards dinámicas (imagen, descripción, botón "Añadir al carrito") |
| **🛒 Carrito & Compra** | **Diego**, **Brian**, **Ruperto** | 📦 Lógica del carrito de compras<br>💳 Flujo de confirmación / checkout de compra |
| **🐛 Depuración & Bug Fixing** | **Mafer**, **Brian** | 🔧 Resolución de incidencias, corrección de errores en código y optimización transversal |

---

## 🗺️ Mapa de Arquitectura del Sitio

```text
                     [ 🏠 INICIO ]
         (NavBar · Div Reclutamiento · Div Tienda)
             [ Mafer · Jaz · Aslan ]
                        │
    ┌───────────────────┼───────────────────┬───────────────────┐
    ▼                   ▼                   ▼                   ▼
[ 📜 Reclutamiento ]  [ 🐾 Tienda Animales ] [ 🌿 Tienda Herbolaria ] [ 🛒 Carrito ]
   (Formulario)         (Cards: Imagen, Descripción y Botón)       [ Diego · Brian · Ruperto ]
 [ Jaime · Dayana ]    [ Brenfer · Adrian · Christian · Zaira ]                 │
                                                                                ▼
                                                                        [ 💳 Compra / Pago ]
  ──────────────────────────────────────────────────────────────────────────────────────────
  🔧 Corrección de errores y depuración transversal de código: [ Mafer · Brian ]

