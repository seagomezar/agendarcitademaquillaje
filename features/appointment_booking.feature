# features/appointment_booking.feature
# SwarmForge four-pack: specifier acceptance criteria

Feature: Agendar Cita de Maquillaje con Vane Pérez por WhatsApp
  Como cliente interesada en servicios de maquillaje profesional en Medellín
  Quiero explorar los servicios de Vane Pérez y agendar mi cita directamente por WhatsApp
  Para asegurar mi fecha de manera rápida, personalizada y sin fricción

  Background:
    Given el usuario visita la landing page de Vane Perez Makeup Artist
    And la plataforma carga el número oficial de WhatsApp y la lista de servicios

  Scenario: Agendamiento rápido desde el botón principal del Hero
    When la usuaria hace clic en el botón principal "Agendar Cita por WhatsApp" en el Hero
    Then el sistema debe abrir WhatsApp con el número oficial de Vane Pérez
    And el mensaje predeterminado debe solicitar información para agendar cita de maquillaje

  Scenario Outline: Agendamiento personalizado según el servicio seleccionado
    When la usuaria selecciona el servicio "<servicio>"
    And la usuaria ingresa su nombre "<nombre>"
    And la usuaria selecciona la fecha "<fecha>"
    And la usuaria elige la modalidad "<modalidad>"
    And la usuaria presiona "Confirmar y Agendar por WhatsApp"
    Then el enlace generado de WhatsApp debe incluir el número con prefijo internacional "57"
    And el texto del mensaje debe contener el nombre "<nombre>", el servicio "<servicio>", la fecha "<fecha>" y la modalidad "<modalidad>"

    Examples:
      | servicio                     | nombre            | fecha      | modalidad                  |
      | Novias / Bridal Glam Luxury  | Carolina Restrepo | 2026-11-14 | Estudio Privado (Medellín) |
      | Maquillaje Social & Eventos  | Mariana Velez     | 2026-10-25 | Servicio a Domicilio       |
      | Quinceañeras & Sweet 15      | Sofia Gomez       | 2026-12-05 | Estudio Privado (Medellín) |
      | Clase VIP de Automaquillaje  | Laura Ramirez     | 2026-10-08 | Estudio Privado (Medellín) |

  Scenario: Disponibilidad permanente del botón flotante de WhatsApp
    When la usuaria navega por cualquier sección de la página
    Then un botón flotante de WhatsApp debe estar visible en la esquina inferior derecha
    And al pulsar el botón flotante se debe iniciar la conversación de WhatsApp con Vane Pérez

  Scenario: Validación de campos obligatorios en el formulario de reserva
    When la usuaria intenta agendar sin ingresar su nombre
    Then el sistema debe mostrar un mensaje de validación indicando que el nombre es requerido
    And el enlace a WhatsApp no debe enviarse con datos incompletos
