package com.airplane.service.controllers;

import com.airplane.service.dao.FlightDAO;
import com.airplane.service.dao.PackageDAO;
import com.airplane.service.dao.PackgeTicketDetailsDAO;
import com.airplane.service.dao.UserDAO;
import com.airplane.service.dto.*;
import com.airplane.service.models.FlightsDetail;
import com.airplane.service.models.Package;
import com.airplane.service.models.PackgeTicketDetails;
import com.airplane.service.models.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api/Admin")
public class AdminController {

    @Autowired
    UserDAO userDAO;

    @Autowired
    PackageDAO packageDAO;

    @Autowired
    PackgeTicketDetailsDAO packgeTicketDetailsDAO;

    @Autowired
    FlightDAO flightDAO;

    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/GetAllUserList")
    public ResponseEntity<PaginationResponseDTO<List<User>>> getAllUserList(@RequestBody PaginationDTO r){
        PaginationResponseDTO<List<User>> responseDTO = new PaginationResponseDTO<>();
        Page<User> userPage = userDAO.findAll(PageRequest.of(r.getPageNumber()-1, r.getNumberOfRecordPerPage()));
        responseDTO.setData(userPage.stream().filter(user -> !user.getRole().equalsIgnoreCase("admin")).toList());
        responseDTO.setTotalPage(userPage.getTotalPages());
        responseDTO.setCurrentPage(r.getPageNumber());
        responseDTO.setTotalRecords(userPage.getTotalElements());
        responseDTO.setMessage(responseDTO.getData().isEmpty() ? "No records" : "Records found");
        responseDTO.setIsSuccess(true);
        return new  ResponseEntity(responseDTO, HttpStatus.OK);
    }

    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @PutMapping("/ManupulateCustomerAccount")
    public ResponseEntity<BasicResponseDTO<?>> manupulateCustomerAccount(@RequestBody UserManipulateRequestDTO r){
        String Message = "Successful";
        BasicResponseDTO<?> responseDTO = new BasicResponseDTO<>(true, Message, null);
        Optional<User> _user = userDAO.findById(r.getUserID());
        if(_user.isPresent()){
            User user = _user.get();
            if(r.getBlock())
            {
                user.setIsActive(false);
                user.setCount(5);
                responseDTO.setMessage("User Account Blocked");
            }
            if(r.getUnblock()) {
                user.setIsActive(true);
                user.setCount(0);
                responseDTO.setMessage("User Account UnBlocked");
            }
            userDAO.save(user);
            return new  ResponseEntity(responseDTO, HttpStatus.OK);
        }
        responseDTO.setIsSuccess(false);
        responseDTO.setMessage("User not found");
        return new  ResponseEntity(responseDTO, HttpStatus.OK);
    }

    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/GetAllCompanyVendorList")
    public ResponseEntity<BasicResponseDTO<List<String>>> GetAllCompanyVendorList(){
        BasicResponseDTO responseDTO = new BasicResponseDTO();
        responseDTO.setIsSuccess(true);
        responseDTO.setMessage("Successful");
        try{

            List<User> data = userDAO.findAll().stream().filter(x->x.getFlightCompany()!="" && x.getFlightCompany() !=null).distinct().toList();
            if(data.stream().count()==0){
                responseDTO.setIsSuccess(false);
                responseDTO.setMessage("Vendor Record not found");
                return new ResponseEntity(responseDTO, HttpStatus.OK);
            }

            List<String> vendorList = new ArrayList<>();

            data.forEach(x->{
                if(x.getFlightCompany()!="") {
                    vendorList.add(x.getFlightCompany());
                }
            });
            responseDTO.setData(vendorList);
        }catch (Exception ex){
            responseDTO.setIsSuccess(false);
            responseDTO.setMessage("Exception Message : "+ex.getMessage());
        }

        return new ResponseEntity(responseDTO, HttpStatus.OK);
    }

    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/AddPackage")
    public ResponseEntity<BasicResponseDTO> AddPackage(@RequestBody AddPackageDTO r){
        BasicResponseDTO responseDTO = new BasicResponseDTO();
        responseDTO.setIsSuccess(true);
        responseDTO.setMessage("Add Package Successfully");
        try{

            Package request = new Package();
            request.setInsetionDate(new Date());
            request.setPackageName(r.getPackageName());
            request.setSource(r.getSource());
            request.setDestination(r.getDestination());
            request.setPackageList(r.getPackageList());
            request.setTotalPrice(r.getTotalPrice());
            packageDAO.save(request);

        }catch (Exception ex){
            responseDTO.setIsSuccess(true);
            responseDTO.setMessage("Exception Message : "+ex.getMessage());
        }
        return new  ResponseEntity(responseDTO, HttpStatus.OK);
    }

    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/GetPackage")
    public ResponseEntity<BasicResponseDTO<List<Package>>> GetPackage(){
        BasicResponseDTO<List<Package>> responseDTO = new BasicResponseDTO<List<Package>>();
        responseDTO.setIsSuccess(true);
        responseDTO.setMessage("Get Package Successfully");
        try{

            List<Package> response = packageDAO.findAll().stream().toList();
            responseDTO.setData(response);

        }catch (Exception ex){
            responseDTO.setIsSuccess(true);
            responseDTO.setMessage("Exception Message : "+ex.getMessage());
        }
        return new  ResponseEntity(responseDTO, HttpStatus.OK);
    }

    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/AddTourPackage")
    public ResponseEntity<BasicResponseDTO> AddTourPackage(@RequestBody PackgeTicketDetailsDTO r){
        BasicResponseDTO responseDTO = new BasicResponseDTO();
        responseDTO.setIsSuccess(true);
        responseDTO.setMessage("Add Package Successfully");
        try{

            PackgeTicketDetails request = new PackgeTicketDetails();
            request.setInsetionDate(new Date());
            request.setUserID(r.getUserID());
            request.setFlightDate(r.getFlightDate());
            request.setPackageID(r.getPackageID());
            request.setSeatClass(r.getSeatClass());
            request.setPaymentType(r.getPaymentType());
            request.setCartNo(r.getCartNo());
            request.setUpiid(r.getUpiid());
            request.setPrice(r.getPrice());
            request.setStatus(r.getStatus());
            request.setPackageName(r.getPackageName());
            request.setSource(r.getSource());
            request.setDestination(r.getDestination());
            packgeTicketDetailsDAO.save(request);

        }catch (Exception ex){
            responseDTO.setIsSuccess(true);
            responseDTO.setMessage("Exception Message : "+ex.getMessage());
        }
        return new  ResponseEntity(responseDTO, HttpStatus.OK);
    }

    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/GetUserTourPackage")
    public ResponseEntity<BasicResponseDTO<List<PackgeTicketDetails>>> GetUserTourPackage(@RequestParam Long UserID){
        BasicResponseDTO<List<PackgeTicketDetails>> responseDTO = new BasicResponseDTO<List<PackgeTicketDetails>>();
        responseDTO.setIsSuccess(true);
        responseDTO.setMessage("Get Package Successfully");
        try{

            List<PackgeTicketDetails> response = packgeTicketDetailsDAO
                    .findAll()
                    .stream()
                    .filter(x->x.getUserID()==UserID)
                    .toList();
            responseDTO.setData(response);

        }catch (Exception ex){
            responseDTO.setIsSuccess(true);
            responseDTO.setMessage("Exception Message : "+ex.getMessage());
        }
        return new  ResponseEntity(responseDTO, HttpStatus.OK);
    }

    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/GetAllTourPackage")
    public ResponseEntity<BasicResponseDTO<List<GetAllTourPackageDTO>>> GetAllTourPackage(){
        BasicResponseDTO<List<GetAllTourPackageDTO>> responseDTO = new BasicResponseDTO<List<GetAllTourPackageDTO>>();
        responseDTO.setIsSuccess(true);
        responseDTO.setMessage("Get Package Successfully");
        try{

            List<PackgeTicketDetails> response = packgeTicketDetailsDAO
                    .findAll()
                    .stream()
                    .toList();
            if(response.stream().count()==0){
                responseDTO.setIsSuccess(false);
                responseDTO.setMessage("Record Not Found");
                return new  ResponseEntity(responseDTO, HttpStatus.OK);
            }

            List<GetAllTourPackageDTO> resp = new ArrayList<>();
            response.forEach(x->{

                Optional<User> _user = userDAO.findAll().stream().filter(x1->x1.getUserID()==x.getUserID()).findFirst();
                //Optional<FlightsDetail> _flight = flightDAO.findAll().stream().filter(x1->x1.getFlightID()==x.)
                GetAllTourPackageDTO _data = new GetAllTourPackageDTO();
                _data.setPTicketID(x.getPTicketID());
                _data.setInsetionDate(x.getInsetionDate());
                _data.setUserID(x.getUserID());
                _data.setFirstName(_user.get().getFirstName());
                _data.setLastName(_user.get().getLastName());
                _data.setEmailID(_user.get().getEmail());
                _data.setPackageID(x.getPackageID());
                //_data.getFlightDate(x.getFlightDate());
                _data.setSeatClass(x.getSeatClass());
                _data.setPaymentType(x.getPaymentType());
                _data.setCartNo(x.getCartNo());
                _data.setUpiid(x.getUpiid());
                _data.setPrice(x.getPrice());
                _data.setStatus(x.getStatus());
                _data.setPackageName(x.getPackageName());
                _data.setSource(x.getSource());
                _data.setDestination(x.getDestination());

                resp.add(_data);
            });

            responseDTO.setData(resp);

        }catch (Exception ex){
            responseDTO.setIsSuccess(true);
            responseDTO.setMessage("Exception Message : "+ex.getMessage());
        }
        return new  ResponseEntity(responseDTO, HttpStatus.OK);
    }

    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @PutMapping("/ChangeTourPackageStatus")
    public ResponseEntity<BasicResponseDTO> ChangeTourPackageStatus(@RequestParam Long PackageID, String Status){
        BasicResponseDTO responseDTO = new BasicResponseDTO();
        responseDTO.setIsSuccess(true);
        responseDTO.setMessage("Change Status Successfully");
        try{

            Optional<PackgeTicketDetails> response = packgeTicketDetailsDAO
                    .findAll()
                    .stream()
                    .filter(x->x.getPTicketID()==PackageID).findFirst();

            if(!response.isPresent()){
                responseDTO.setIsSuccess(false);
                responseDTO.setMessage("Package Not Found");
                return new  ResponseEntity(responseDTO, HttpStatus.OK);
            }
            response.get().setStatus(Status);
            packgeTicketDetailsDAO.save(response.get());

        }catch (Exception ex){
            responseDTO.setIsSuccess(true);
            responseDTO.setMessage("Exception Message : "+ex.getMessage());
        }
        return new  ResponseEntity(responseDTO, HttpStatus.OK);
    }


}
