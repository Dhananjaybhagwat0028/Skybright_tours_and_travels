package com.airplane.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class AddPackageDTO {
    public String packageName;
    public String packageList;
    public String source;
    public  String destination;
    public String totalPrice;
}
