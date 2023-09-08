using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tours_Traveller_System_.Net.CommonLayer;
using Tours_Traveller_System_.Net.ServiceLayer;

namespace Tours_Traveller_System_.Net.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailSL _emailSL;
        public EmailController(IEmailSL emailSL) 
        {
            _emailSL = emailSL;
        }

        [HttpPost]
        public async Task<IActionResult> EmailService(EmailServiceRequest request)
        {
            EmailServiceResponse response = new EmailServiceResponse();
            try
            {
                response = await _emailSL.EmailService(request);
            }catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message : "+ ex.Message;
            }

            return Ok(response);
        }
    }
}
