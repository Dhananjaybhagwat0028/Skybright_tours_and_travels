package com.airplane.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PackgeTicketDetailsDTO {
    private Long userID;
    private Long packageID;
    private String flightDate;
    private String seatClass; // Economy, Business
    private String paymentType; //Cart,UPI,Cash
    private String cartNo;
    private String upiid;
    private Double price;
    private String status;

    public String packageName;
    public String source;
    public String destination;
}
