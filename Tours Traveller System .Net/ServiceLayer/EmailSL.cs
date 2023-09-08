using Tours_Traveller_System_.Net.CommonLayer;
using Tours_Traveller_System_.Net.RepositoryLayer;

namespace Tours_Traveller_System_.Net.ServiceLayer
{
    public class EmailSL : IEmailSL
    {
        private readonly IEmailRL _emailRL;
        public EmailSL(IEmailRL emailRL) 
        {
            _emailRL = emailRL;
        }
        public async Task<EmailServiceResponse> EmailService(EmailServiceRequest request)
        {
            return await _emailRL.EmailService(request);
        }
    }
}
