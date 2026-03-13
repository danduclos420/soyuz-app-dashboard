export const getOrderConfirmationTemplate = (order: any) => {
  const itemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #333;">
        <p style="margin: 0; color: #ffffff; font-weight: bold; text-transform: uppercase; font-size: 14px;">${item.description}</p>
        <p style="margin: 5px 0 0; color: #888888; font-size: 12px;">Qty: ${item.quantity}</p>
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #333; text-align: right; color: #ffffff; font-weight: bold;">
        $${(item.unit_amount * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmed | SOYUZ BC</title>
    </head>
    <body style="background-color: #0D0D0D; color: #ffffff; font-family: sans-serif; margin: 0; padding: 0;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #0D0D0D;">
        <tr>
          <td style="padding: 40px 20px; text-align: center;">
            <h1 style="color: #00E5FF; text-transform: uppercase; letter-spacing: 5px; font-size: 12px; margin-bottom: 10px;">Transmission Confirmed</h1>
            <h2 style="font-size: 32px; font-weight: 900; font-style: italic; text-transform: uppercase; margin: 0;">Gear <span style="color: #ffffff;">Secured</span></h2>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 20px 40px;">
            <div style="background-color: #1A1A1A; border: 1px solid #333; border-radius: 20px; padding: 30px;">
              <p style="color: #888888; text-transform: uppercase; font-size: 10px; font-weight: bold; letter-spacing: 2px; margin-bottom: 20px;">Order Summary</p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                ${itemsHtml}
              </table>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
                <tr>
                  <td style="color: #888888; font-size: 12px; padding: 5px 0;">Subtotal</td>
                  <td style="color: #ffffff; font-size: 14px; text-align: right; font-weight: bold;">$${order.subtotal?.toFixed(2)}</td>
                </tr>
                ${order.discount_amount > 0 ? `
                <tr>
                  <td style="color: #00E5FF; font-size: 12px; padding: 5px 0;">Discount</td>
                  <td style="color: #00E5FF; font-size: 14px; text-align: right; font-weight: bold;">-$${order.discount_amount.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="color: #888888; font-size: 12px; padding: 5px 0;">Taxes</td>
                  <td style="color: #ffffff; font-size: 14px; text-align: right; font-weight: bold;">$${(order.total - order.subtotal + order.discount_amount).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding-top: 20px; color: #ffffff; font-weight: 900; text-transform: uppercase; font-size: 16px;">Total Paid</td>
                  <td style="padding-top: 20px; color: #ffffff; font-weight: 900; text-align: right; font-size: 24px; font-style: italic;">$${order.total?.toFixed(2)}</td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 20px 40px; text-align: center;">
            <p style="color: #888888; font-size: 12px; margin-bottom: 20px;">Our technicians are preparing your gear for priority dispatch from the locker.</p>
            <div style="border-top: 1px solid #333; padding-top: 20px;">
              <p style="color: #ffffff; font-weight: 900; text-transform: uppercase; font-size: 10px; letter-spacing: 3px;">SOYUZ BC NORTH AMERICA</p>
              <p style="color: #444444; font-size: 10px; margin-top: 5px;">Elite Performance Hardware</p>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const getRepApplicationReceivedTemplate = (data: any) => {
  return `
    <!DOCTYPE html>
    <html>
    <body style="background-color: #0D0D0D; color: #ffffff; font-family: sans-serif; margin: 0; padding: 40px;">
      <table width="100%" style="max-width: 600px; margin: 0 auto; background-color: #1A1A1A; border-radius: 24px; border: 1px solid #333; overflow: hidden;">
        <tr>
          <td style="padding: 40px; text-align: center; border-bottom: 1px solid #333;">
            <p style="color: #00E5FF; text-transform: uppercase; font-size: 10px; font-weight: bold; letter-spacing: 4px; margin-bottom: 15px;">Elite Partner Program</p>
            <h1 style="font-size: 28px; font-weight: 900; text-transform: uppercase; margin: 0; font-style: italic;">Transmission <span style="color: #00E5FF;">Received</span></h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px;">
            <p style="color: #ffffff; font-size: 16px; font-weight: bold; margin-bottom: 20px;">Bonjour ${data.firstName},</p>
            <p style="color: #888888; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
              Merci de votre intérêt pour rejoindre l'équipe SOYUZ BC North America. Votre candidature est actuellement en cours d'examen par notre direction commerciale.
            </p>
            <div style="background-color: #0D0D0D; border-radius: 12px; padding: 20px; border: 1px solid #333;">
              <p style="color: #ffffff; font-size: 12px; font-weight: bold; margin-bottom: 15px; text-transform: uppercase;">Prochaines étapes :</p>
              <ul style="color: #888888; font-size: 13px; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Analyse de votre profil et de votre rayonnement local.</li>
                <li style="margin-bottom: 10px;">Validation de votre code partenaire personnalisé.</li>
                <li>Prise de contact par un responsable régional (sous 48-72h).</li>
              </ul>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 40px 40px; text-align: center;">
            <p style="color: #444444; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">Strength In Unity • Power With SOYUZ</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const getAdminNewRepAlertTemplate = (data: any) => {
  return `
    <!DOCTYPE html>
    <html>
    <body style="background-color: #0D0D0D; color: #ffffff; font-family: sans-serif; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #000; border: 2px solid #CC0000; padding: 30px; border-radius: 8px;">
        <h2 style="color: #CC0000; text-transform: uppercase; font-weight: 900;">NOUVELLE DEMANDE REPRESENTANT</h2>
        <div style="margin-top: 20px; font-size: 14px; color: #fff;">
          <p><strong>Nom :</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email :</strong> ${data.email}</p>
          <p><strong>Social :</strong> ${data.social}</p>
          <p><strong>Code Souhaité :</strong> ${data.repCode}</p>
          <hr style="border: 0; border-top: 1px solid #222; margin: 20px 0;">
          <p><strong>Motivation :</strong></p>
          <p style="color: #888; background: #111; padding: 15px; border-radius: 4px;">${data.motivation}</p>
        </div>
        <div style="margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" style="background: #CC0000; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">VOIR DANS LE DASHBOARD</a>
        </div>
      </div>
    </body>
    </html>
  `;
};
