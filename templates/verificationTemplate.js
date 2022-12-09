function verificationHtml(otp) {
  return `
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2;background:#000;color:#fff;padding:0px 0px 50px 0px">
  <div style="margin:0px auto;width:30%;padding:20px 0;min-width:300px">
    <div style="border-bottom:1px solid #eee;text-align:center;width:100%;" ;>
      <a href="" style="text-decoration:none;">
        <img src="https://res.cloudinary.com/dfcaehp0b/image/upload/v1670377798/cineplex/lg_q0ffsg.png" alt="logo" style="height:200px" />
      </a>
    </div>
    <p style="font-size:1.1em; color:#fff;">Hi,</p>
    <p style="font-size:1.1em; color:#fff;">Thank you for choosing The Svar Studio. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
    <h2 style="background: red;margin: 0 auto;width: max-content;padding: 0 20px;color: #fff;border-radius: 4px;letter-spacing:10px;">${otp}</h2>
    <p style="font-size:1.1em; color:#fff;">Regards,<br />The Svar Studio</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>The Svar Studio</p>
      <p>Vancouver, BC</p>
      <p>Canada</p>
    </div>
  </div>
</div>
    `;
}

module.exports = verificationHtml;
