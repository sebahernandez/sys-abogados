import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_APIKEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    const { name, email, phone, message, service } = data;

    if (!name || !email || !phone || !message || !service) {
      return new Response(
        JSON.stringify({
          error: "Todos los campos obligatorios deben estar completos.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    // codigo resend para el envio
    const { data: emailData, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "jose.sanchez@sysabogadopenaflor.cl",
      subject: `📩 Nueva solicitud de cotización de ${name}`,
      html: `
          <h2>📌 Nueva solicitud de cotización desde el sitio web</h2>

          <h2>📞 Datos de Contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone}</p>
          <p><strong>Servicio solicitado:</strong> ${service}</p>
  
          <h3>📩 Mensaje adicional:</h3>
          <p>${message || "Sin comentarios adicionales"}</p>
        `,
    });

    // manejo de errores
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    // cuando la respuesta sea exitosa
    return new Response(JSON.stringify({ success: true, data: emailData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Manejo de errores generales
    console.error("Error interno del servidor:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
