using System.ComponentModel.DataAnnotations;

namespace Tours_Traveller_System_.Net.CommonLayer
{
    public class EmailServiceRequest
    {
        public int PackageID { get; set; }
        //public int UserID { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? EmailID { get; set; }
        public string? PackageName { get; set; }
        public string? To { get; set; }
        public string? Destination { get; set; }
        public string? PaymentType { get; set; } //Cart,UPI,Cash
        public double Price { get; set; }
        public string? Status { get; set; }
        public string? SeatClass { get; set; }
        /*[Required]
        public string? FirstName { get; set; }
        [Required]
        public string? LastName { get; set; }
        [Required]
        public string? EmailID { get; set; }*/
    }
}
