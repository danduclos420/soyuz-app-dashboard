export const getOrderConfirmationTemplate = (order: any) => {
  const itemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding: 20px 0; border-bottom: 1px solid #1A1A1A;">
        <p style="margin: 0; color: #ffffff; font-weight: 900; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">${item.description}</p>
        <p style="margin: 5px 0 0; color: #444444; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">QTY: ${item.quantity}</p>
      </td>
      <td style="padding: 20px 0; border-bottom: 1px solid #1A1A1A; text-align: right; color: #ffffff; font-weight: 900; font-size: 16px;">
        $${(item.unit_amount * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Transmission Confirmed | SOYUZ BC</title>
    </head>
    <body style="background-color: #000000; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #000000;">
        <tr>
          <td style="padding: 60px 20px; text-align: center;">
            <p style="color: #CC0000; text-transform: uppercase; letter-spacing: 6px; font-size: 10px; font-weight: 900; margin-bottom: 15px;">TRANS-ID: ${(order.id || '').slice(-8).toUpperCase()}</p>
            <h1 style="font-size: 48px; font-weight: 900; font-style: italic; text-transform: uppercase; margin: 0; line-height: 0.9; letter-spacing: -2px;">GEAR <span style="color: #ffffff; -webkit-text-stroke: 1px #888888;">SECURED</span></h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 20px 40px;">
            <div style="background-color: #0A0A0A; border: 1px solid #1A1A1A; padding: 40px;">
              <p style="color: #444444; text-transform: uppercase; font-size: 9px; font-weight: 900; letter-spacing: 3px; margin-bottom: 30px;">MANIFEST SUMMARY</p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                ${itemsHtml}
              </table>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 30px;">
                <tr>
                  <td style="color: #444444; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; padding: 8px 0;">Subtotal</td>
                  <td style="color: #ffffff; font-size: 14px; text-align: right; font-weight: 900;">$${order.subtotal?.toFixed(2)}</td>
                </tr>
                ${order.discount_amount > 0 ? `
                <tr>
                  <td style="color: #CC0000; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; padding: 8px 0;">Rep Discount</td>
                  <td style="color: #CC0000; font-size: 14px; text-align: right; font-weight: 900;">-$${order.discount_amount.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="color: #444444; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; padding: 8px 0;">Taxes</td>
                  <td style="color: #ffffff; font-size: 14px; text-align: right; font-weight: 900;">$${(order.total - order.subtotal + order.discount_amount).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding-top: 30px; color: #ffffff; font-weight: 900; text-transform: uppercase; font-size: 12px; letter-spacing: 3px;">TOTAL SETTLED</td>
                  <td style="padding-top: 30px; color: #ffffff; font-weight: 900; text-align: right; font-size: 32px; font-style: italic; line-height: 1;">$${order.total?.toFixed(2)}</td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 20px 80px; text-align: center;">
            <p style="color: #444444; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; line-height: 1.8; margin-bottom: 40px;">
              Our technicians are preparing your high-performance <br /> hardware for priority dispatch from the Soyuz North American locker.
            </p>
            <div style="border-top: 1px solid #1A1A1A; padding-top: 40px;">
              <p style="color: #ffffff; font-weight: 900; text-transform: uppercase; font-size: 11px; letter-spacing: 5px;">SOYUZ BC NORTH AMERICA</p>
              <p style="color: #222222; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; margin-top: 10px;">Elite Performance Engineering • Montreal • KHL Roots</p>
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
    <head>
      <meta charset="utf-8">
    </head>
    <body style="background-color: #000000; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 40px;">
      <table width="100%" style="max-width: 600px; margin: 0 auto; background-color: #0A0A0A; border: 1px solid #1A1A1A; overflow: hidden;">
        <tr>
          <td style="padding: 60px 40px; text-align: center; border-bottom: 1px solid #1A1A1A;">
            <p style="color: #CC0000; text-transform: uppercase; font-size: 9px; font-weight: 900; letter-spacing: 5px; margin-bottom: 20px;">Elite Partner Onboarding</p>
            <h1 style="font-size: 36px; font-weight: 900; text-transform: uppercase; margin: 0; font-style: italic; line-height: 1;">ACCESS <span style="color: #ffffff; -webkit-text-stroke: 1px #888888;">PENDING</span></h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px;">
            <p style="color: #ffffff; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 25px;">Transmission Received, ${data.firstName}</p>
            <p style="color: #888888; font-size: 12px; font-weight: 700; text-transform: uppercase; line-height: 1.8; letter-spacing: 0.5px; margin-bottom: 40px;">
              Thank you for applying to the SOYUZ BC North American Team. Your profile is currently being audited by our regional directors.
            </p>
            <div style="background-color: #000000; padding: 30px; border: 1px solid #1A1A1A;">
              <p style="color: #ffffff; font-size: 10px; font-weight: 900; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 2px;">PROTOCOL STAGES:</p>
              <ul style="color: #444444; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; padding-left: 20px; list-style-type: square;">
                <li style="margin-bottom: 15px;">Network Auditing & Reach Verification</li>
                <li style="margin-bottom: 15px;">Custom Referral Node Activation (Code: ${data.repCode})</li>
                <li>Direct Outreach by Regional Lead (Target: 48-72h)</li>
              </ul>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 40px 60px; text-align: center;">
            <p style="color: #222222; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 4px;">STRENGTH IN UNITY • POWER WITH SOYUZ</p>
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
    <body style="background-color: #000000; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background: #0A0A0A; border: 1px solid #CC0000; padding: 40px;">
        <p style="color: #CC0000; font-[10px] font-weight: 900; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 10px;">SYSTEM ALERT</p>
        <h2 style="color: #ffffff; text-transform: uppercase; font-weight: 900; font-style: italic; font-size: 24px; margin-top: 0;">NEW AGENT APPLICATION</h2>
        
        <div style="margin-top: 40px; font-size: 11px; color: #888888; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">
          <p style="margin-bottom: 10px;"><strong style="color: #ffffff; letter-spacing: 2px;">OPERATOR:</strong> ${data.firstName} ${data.lastName}</p>
          <p style="margin-bottom: 10px;"><strong style="color: #ffffff; letter-spacing: 2px;">NETWORK:</strong> ${data.social}</p>
          <p style="margin-bottom: 10px;"><strong style="color: #ffffff; letter-spacing: 2px;">DESIRED NODE:</strong> ${data.repCode}</p>
          
          <div style="margin: 30px 0; padding: 25px; background: #000000; border: 1px solid #1A1A1A;">
            <p style="color: #ffffff; margin-bottom: 10px; font-size: 9px;">MOTIVATION DATA:</p>
            <p style="color: #444444; margin: 0; line-height: 1.6;">${data.motivation}</p>
          </div>
        </div>
        
        <div style="margin-top: 40px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" style="background: #CC0000; color: #ffffff; padding: 18px 30px; text-decoration: none; font-weight: 900; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; display: inline-block;">ACCESS COMMAND CENTER</a>
        </div>
      </div>
    </body>
    </html>
  `;
};
