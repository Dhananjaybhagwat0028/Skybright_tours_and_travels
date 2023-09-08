using Tours_Traveller_System_.Net.CommonLayer;

namespace Tours_Traveller_System_.Net.RepositoryLayer
{
    public interface IEmailRL
    {
        public Task<EmailServiceResponse> EmailService(EmailServiceRequest request);
    }
}
