using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using Tours_Traveller_System_.Net.CommonLayer;

namespace Tours_Traveller_System_.Net.RepositoryLayer
{
    public class EmailRL : IEmailRL
    {
        private EmailSettings _emailSettings = null;
        public EmailRL(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public async Task<EmailServiceResponse> EmailService(EmailServiceRequest request)
        {
            EmailServiceResponse response = new EmailServiceResponse();
            response.IsSuccess = true;
            response.Message = "Send Email Successfully";
            try
            {
                string htmlBody = @"
                                    <h3>TICKET INVOICE</h3>
                                    <hr/>
                                    <h5>Package ID : " + request.PackageID + @"</h5>
                                    <h5>First Name : " + request.FirstName + @"</h5>
                                    <h5>Last Name : " + request.LastName + @"</h5>
                                    <h5>Email ID : " + request.EmailID + @"</h5>
                                    <h5>Package Name : " + request.PackageName + @"</h5>
                                    <h5>Source : " + request.To + @"</h5>
                                    <h5>Destination : " + request.Destination + @"</h5>
                                    <h5>Payment Type : " + request.PaymentType + @"</h5>
                                    <h5>Ticket Price : " + request.Price + @"</h5>
                                    <h5>Ticket System : " + request.Status + @"</h5>
                                    <h5>Ticket Class : " + request.SeatClass + @"</h5>
                                    ";

                MimeMessage emailMessage = new MimeMessage();
                MailboxAddress emailFrom = new MailboxAddress(_emailSettings.Name, _emailSettings.EmailId);
                emailMessage.From.Add(emailFrom);
                MailboxAddress emailTo = new MailboxAddress("Booking Confirmation", request.EmailID);
                emailMessage.To.Add(emailTo);
                emailMessage.Subject = "Tours & Travels Booking Confirmation";
                BodyBuilder emailBodyBuilder = new BodyBuilder();
                emailBodyBuilder.HtmlBody = htmlBody;
                //emailBodyBuilder.TextBody = "Hello ashitosh";
                emailMessage.Body = emailBodyBuilder.ToMessageBody();
                SmtpClient emailClient = new SmtpClient();
                emailClient.Connect(_emailSettings.Host, _emailSettings.Port, _emailSettings.UseSSL);
                emailClient.Authenticate(_emailSettings.EmailId, _emailSettings.Password);
                emailClient.Send(emailMessage);
                emailClient.Disconnect(true);
                emailClient.Dispose();

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message : " + ex.Message;
            }

            return response;
        }
    }
}
