package com.airplane.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PackageResponseDTO {
    private Long packageID;
    private Date insetionDate;
    public String packageName;
    public String packageList;
    public String source;
    public String destination;
}
