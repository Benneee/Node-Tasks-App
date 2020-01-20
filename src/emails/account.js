const sgMail = require("@sendgrid/mail");

const sendgridAPIKey =
  "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";

sgMail.setApiKey(sendgridAPIKey);

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

module.exports = {
  sendWelcomeEmail
};
