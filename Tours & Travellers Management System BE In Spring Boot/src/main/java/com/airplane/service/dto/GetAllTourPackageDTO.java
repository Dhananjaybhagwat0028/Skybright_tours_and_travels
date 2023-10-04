package com.airplane.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data

public class GetAllTourPackageDTO {
    private Long pTicketID;
    private Date insetionDate;
    private Long userID;
    private String FirstName;
    private String LastName;
    private String EmailID;
    private Long packageID;
    private String flightDate;
    private String seatClass; // Economy, Business
    private String paymentType; //Cart,UPI,Cash
    private String cartNo;
    private String upiid;
    private Double price;
    private String status;

    //
    public String packageName;
    public String source;
    public String destination;
}
