using Tours_Traveller_System_.Net.CommonLayer;

namespace Tours_Traveller_System_.Net.ServiceLayer
{
    public interface IEmailSL
    {
        public Task<EmailServiceResponse> EmailService(EmailServiceRequest request);
    }
}
