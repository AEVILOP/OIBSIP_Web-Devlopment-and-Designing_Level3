const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
}[character]));

const shell = (title, body) => `
<!doctype html>
<html>
  <body style="margin:0;background:#0D0D0D;color:#F5F5F5;font-family:Arial,sans-serif">
    <div style="max-width:600px;margin:0 auto;padding:40px 20px">
      <div style="background:#161616;border:1px solid #2A2A2A;border-radius:20px;padding:32px">
        <div style="color:#FF4500;font-weight:800;font-size:14px;letter-spacing:2px">PIZZAAPP</div>
        <h1 style="font-size:28px;margin:14px 0 12px">${title}</h1>
        ${body}
        <p style="color:#888888;font-size:12px;margin-top:28px">This message was sent by PizzaApp. Please do not share secure links.</p>
      </div>
    </div>
  </body>
</html>`;

const button = (label, url) => `
  <a href="${url}" style="display:inline-block;margin-top:18px;background:#FF4500;color:#fff;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:10px">${label}</a>`;

const verificationEmail = (name, url) => shell(
  'One click. Then pizza.',
  `<p style="color:#c4c4c4;line-height:1.7">Hi ${escapeHtml(name)}, verify your email to finish creating your account. This link expires in 24 hours.</p>${button('Verify my email', url)}`,
);

const welcomeEmail = (name, url) => shell(
  `Welcome, ${escapeHtml(name)}.`,
  `<p style="color:#c4c4c4;line-height:1.7">Your email is verified and your next pizza is ready to be designed.</p>${button('Explore the menu', url)}`,
);

const passwordResetEmail = (name, url) => shell(
  'Reset your password',
  `<p style="color:#c4c4c4;line-height:1.7">Hi ${escapeHtml(name)}, use the secure link below to choose a new password. It expires in one hour. If you did not request this, you can ignore this email.</p>${button('Reset password', url)}`,
);

const lowStockEmail = (ingredients) => {
  const rows = ingredients.map((item) => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #2A2A2A">${escapeHtml(item.name)}</td>
      <td style="padding:10px;border-bottom:1px solid #2A2A2A">${escapeHtml(item.category)}</td>
      <td style="padding:10px;border-bottom:1px solid #2A2A2A;color:#EF4444">${item.stock}</td>
      <td style="padding:10px;border-bottom:1px solid #2A2A2A">${item.threshold}</td>
    </tr>`).join('');

  return shell(
    'Inventory needs attention',
    `<p style="color:#c4c4c4;line-height:1.7">The following ingredients are at or below their stock threshold.</p>
    <table style="width:100%;border-collapse:collapse;color:#F5F5F5;font-size:14px">
      <thead><tr><th align="left">Ingredient</th><th align="left">Category</th><th align="left">Stock</th><th align="left">Threshold</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`,
  );
};

module.exports = {
  verificationEmail,
  welcomeEmail,
  passwordResetEmail,
  lowStockEmail,
};
