package com.airplane.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketDetailResponseDTO {
    public Long ticketID ;
    public Long userID ;
    public String firstName ;
    public String lastName ;
    public String email ;
    public Long flightID ;
    public String flightName ;
    public String company ;
    public String to ;
    public String destination ;
    public String flightDate ;
    public String time ;
    public String paymentType ; //Cart,UPI,Cash
    public String cardNo ;
    public String uPIID ;
    public double price ;
    public String status ;
    public String seatClass ; //Economy, Business
}
