package com.airplane.service.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Date;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PackgeTicketDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pTicketID;
    private Date insetionDate;
    private Long userID;
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
