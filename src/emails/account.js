const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// sgMail.send({
//   to: "benedictiknkeonye@gmail.com",
//   from: "benedictiknkeonye@gmail.com",
//   subject: "First mail using SendGrid",
//   text:
//     "Lorem ipsum would have been much more fun to use but I am going to enjoy writing this really long, ok, not so long text. Node.js has been fun so far and I cannot wait to start building fun applications with it.... and my website too!"
// });

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "benedictiknkeonye@gmail.com",
    subject: "Thanks for creating a Task App account",
    text: `Hello ${name}, Welcome to the Task App. Let me know how you get along with the application`
  });
};

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "benedictiknkeonye@gmail.com",
    subject: "Goodbye friend...",
    text: `Goodbye dear ${name}, we will definitely miss you. If there is anything we could have done to keep you with us, please shoot us a mail. Cheers!`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail
};
