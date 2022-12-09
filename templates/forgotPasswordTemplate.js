function forgotPasswordTemplate(email, resetLink) {
  return `
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2;background:#000;color:#fff">
  <div style="margin:0px auto;width:30%;padding:20px 0;min-width:300px">
    <div style="border-bottom:1px solid #eee;text-align:center;width:100%;" ;>
      <a href="" style="text-decoration:none;">
        <img src="https://res.cloudinary.com/dfcaehp0b/image/upload/v1670377798/cineplex/lg_q0ffsg.png" alt="logo" style="height:200px" />
      </a>
    </div>
    <p style="font-size:1.1em">Hello,</p>
    <p> We received a request to reset the password for the Stripe account associated with ${email}. If you didn’t request to reset your password, contact us via our support site. No changes were made to your account yet.

    </p>
    <div style="text-align: center">
    <a href="${resetLink}">
    <button style="background: red;margin: 0 auto;width: max-content;padding:20px 40px;color: #fff;border-radius: 4px;font-size: 1.25rem;">Reset Password</button>
  </a>
    </div>
    <p style="font-size:0.9em;">Regards,<br />The Svar Studio</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300;margin:0px 0px 50px 0px">
      <p>The Svar Studio</p>
      <p>Vancouver, BC</p>
      <p>Canada</p>
    </div>
  </div>
</div>
      `;
}

module.exports = forgotPasswordTemplate;
