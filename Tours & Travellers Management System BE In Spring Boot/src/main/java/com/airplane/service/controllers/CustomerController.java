package com.airplane.service.controllers;

import com.airplane.service.dao.FlightDAO;
import com.airplane.service.dao.TicketDetailDAO;
import com.airplane.service.dao.UserDAO;
import com.airplane.service.dao.UserPersonalDetailsDAO;
import com.airplane.service.dto.*;
import com.airplane.service.models.FlightsDetail;
import com.airplane.service.models.TicketDetail;
import com.airplane.service.models.User;
import com.airplane.service.models.UserPersonalDetail;
import com.airplane.service.services.FileUploadStorage;
import com.airplane.service.services.FilesStorageService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.io.IOException;
import java.util.*;

import static com.cloudinary.utils.ObjectUtils.asMap;
import static java.util.Collections.emptyMap;

@RestController
@CrossOrigin
@RequestMapping("/api/Customer")
public class CustomerController {
    @Autowired
    UserDAO userDAO;

    @Autowired
    FlightDAO flightDAO;

    @Autowired
    UserPersonalDetailsDAO userPersonalDetailsDAO;

    @Autowired
    TicketDetailDAO ticketDetailDAO;

    @Autowired
    FilesStorageService filesStorageService;

    private ModelMapper modelMapper = new ModelMapper();

    @Value("${files.upload.url}")
    private String fileUrl;

    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/SearchAndFilterFlights")
    public ResponseEntity<PaginationResponseDTO<List<FlightsDetail>>> searchAndFilterFlights(@RequestBody CustomerSearchDTO r){
        PaginationResponseDTO<List<FlightsDetail>> responseDTO = new PaginationResponseDTO<>();
        //PageRequest pageRequest = PageRequest.of(r.getPageNumber() -1, r.getNumberOfRecordPerPage());
        List<FlightsDetail> flightsDetailPage = flightDAO.findAll();
//        if(r.isSearch() && r.isFilter()){
//            if(r.getFilterOn().isPrice())
//                flightsDetailPage = flightDAO.findAllByToLevelIgnoreCaseAndDestinationIgnoreCaseOrderByPrice(r.getTo(), r.getDestination(), pageRequest);
//            if(r.getFilterOn().isTime())
//                flightsDetailPage = flightDAO.findAllByToLevelIgnoreCaseAndDestinationIgnoreCaseOrderByFlightTime(r.getTo(), r.getDestination(), pageRequest);
//            if(r.getFilterOn().isName())
//                flightsDetailPage = flightDAO.findAllByToLevelIgnoreCaseAndDestinationIgnoreCaseOrderByFlightName(r.getTo(), r.getDestination(), pageRequest);
//        } else if(r.isFilter()){
//            flightsDetailPage = flightDAO.findAll(pageRequest);
//        } else if(r.isSearch()){
//            flightsDetailPage = flightDAO.findAllByToLevelIgnoreCaseAndDestinationIgnoreCase(r.getTo(), r.getDestination(), pageRequest);
//        }
        responseDTO.setMessage(flightsDetailPage.stream().count()==0 ? "No records" : "Records found");
        responseDTO.setData(flightsDetailPage);
        responseDTO.setTotalRecords(flightsDetailPage.stream().count());
        responseDTO.setCurrentPage(r.getPageNumber());
        responseDTO.setIsSuccess(true);
        responseDTO.setTotalPage((int)Math.ceil(flightsDetailPage.stream().count()/r.getNumberOfRecordPerPage()));
        return new  ResponseEntity(responseDTO, HttpStatus.OK);
    }

    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @PutMapping("/UpdateCustomerInfomation")
    public ResponseEntity<BasicResponseDTO<?>> updateCustomerInfomation(@RequestBody UpdateCustomerDTO r){
        BasicResponseDTO<?> responseDTO = new BasicResponseDTO<>(true, "Process completed", null);
        Optional<UserPersonalDetail> _user = userPersonalDetailsDAO.findByUserID(r.getUserID());
        if(_user.isPresent()){
            UserPersonalDetail p = _user.get();
            p.setUserID(r.getUserID());
            p.setFirstName(r.getFirstName());
            p.setLastName(r.getLastName());
            p.setAddress(r.getAddress());
            p.setCity(r.getCity());
            p.setState(r.getState());
            p.setZipCode(r.getZipCode());
            p.setHomePhone(r.getHomePhone());
            p.setPersonalNumber(r.getPersonalNumber());
            p.setEmail(r.getEmail());
            p.setGender(r.getGender());
            p.setDob(r.getDob());
            p.setOccupation(r.getOccupation());
            userPersonalDetailsDAO.save(p);
            return new  ResponseEntity(responseDTO, HttpStatus.OK);
        }
        responseDTO.setIsSuccess(false);
        responseDTO.setMessage("User not found");
        return new  ResponseEntity(responseDTO, HttpStatus.OK);
    }

    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/GetCustomerInfomation")
    public ResponseEntity<BasicResponseDTO<UserPersonalDetail>> getCustomerInfomation(@RequestParam("UserID") Long userID){
        BasicResponseDTO<UserPersonalDetail> responseDTO = new BasicResponseDTO<>(true, "User found", null);
        Optional<UserPersonalDetail> _user = userPersonalDetailsDAO.findByUserID(userID);
        if(_user.isPresent()){
            responseDTO.setData(_user.get());
        }
        return new  ResponseEntity(responseDTO, HttpStatus.OK);
    }

    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/PaymentGetway")
    public ResponseEntity<BasicResponseDTO<TicketDetail>> paymentGetway(@RequestBody PaymentGatwayReqDTO r){
        BasicResponseDTO<TicketDetail> responseDTO = new BasicResponseDTO<>(true, "Payment Updated", null);
        TicketDetail ticketDetail = modelMapper.map(r, TicketDetail.class);
        ticketDetail.setInsetionDate(new Date());
        ticketDetailDAO.save(ticketDetail);
        responseDTO.setData(ticketDetail);
        return new  ResponseEntity(responseDTO, HttpStatus.OK);
    }

    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @PatchMapping("/UpdateTicket")
    public ResponseEntity<BasicResponseDTO<?>> updateTicket(@RequestBody UpdateTicketReqDTO r){
        BasicResponseDTO<UserPersonalDetail> responseDTO = new BasicResponseDTO<>(true, "Cancel Ticket Successfully", null);
        Optional<TicketDetail> ticketDetail = ticketDetailDAO.findById(r.getTicketID());
        if(ticketDetail.isEmpty()){
            responseDTO.setMessage("Ticket not found");
            return new  ResponseEntity(responseDTO, HttpStatus.OK);
        }
        TicketDetail ticketDetail1 = ticketDetail.get();
        ticketDetail1.setStatus(r.getStatus());
        ticketDetailDAO.save(ticketDetail1);
        return new  ResponseEntity(responseDTO, HttpStatus.OK);
    }

    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/GetUserTickets")
    public ResponseEntity<PaginationResponseDTO<List<GetUserTicketsResponseDTO>>> getUserTickets(@RequestBody GetUserTicketReqDTO r){
        PaginationResponseDTO<List<GetUserTicketsResponseDTO>> responseDTO = new PaginationResponseDTO<>();
        List<GetUserTicketsResponseDTO> response = new ArrayList<>();
        Page<TicketDetail> ticketDetailPage = null;
        if(r.getUserID()==-1){
            ticketDetailPage = ticketDetailDAO.findAll(
                    PageRequest.of(r.getPageNumber() - 1, r.getNumberOfRecordPerPage()));
        }else {
            ticketDetailPage = ticketDetailDAO.findAllByUserID(r.getUserID(),
                    PageRequest.of(r.getPageNumber() - 1, r.getNumberOfRecordPerPage()));
        }
        ticketDetailPage.forEach(X->{
            Optional<User> userDetals = userDAO.findAll().stream().filter(x->x.getUserID()==X.getUserID()).findFirst();

            GetUserTicketsResponseDTO data = new GetUserTicketsResponseDTO();
            data.setTicketID(X.getTicketID());
            data.setUserID(X.getUserID());
            data.setFirstName(userDetals.get().getFirstName());
            data.setLastName(userDetals.get().getLastName());
            data.setEmail(userDetals.get().getEmail());
            data.setFlightID(X.getFlightID());
            FlightsDetail flightsDetail = flightDAO.getReferenceById(X.getFlightID());
            data.setFlightName(flightsDetail.getFlightName());
            data.setCompany(flightsDetail.getCompany());
            data.setTo(flightsDetail.getToLevel());
            //Destination, FlightDate, Time, PaymentType,CardNo, UPIID, Price, Status, SeatClass
            data.setDestination(flightsDetail.getDestination());
            data.setFlightDate(X.getFlightDate());
            data.setTime(flightsDetail.getFlightTime());
            data.setPaymentType(X.getPaymentType());
            data.setCardNo(X.getCartNo());
            data.setUPIID(X.getUpiid());
            data.setPrice(X.getPrice());
            data.setStatus(X.getStatus());
            data.setSeatClass(X.getSeatClass());
            response.add(data);
        });
        responseDTO.setTotalPage(ticketDetailPage.getTotalPages());
        responseDTO.setData(response);
        responseDTO.setTotalRecords(ticketDetailPage.getTotalElements());
        responseDTO.setCurrentPage(r.getPageNumber());
        responseDTO.setIsSuccess(true);
        responseDTO.setMessage(responseDTO.getData().isEmpty() ? "No records": "Records found");
        return new  ResponseEntity(responseDTO, HttpStatus.OK);
    }

    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping(value = "/UpdateImage", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<BasicResponseDTO<?>> updateImage(@ModelAttribute UpdateImageReqDTO r) throws IOException {
        BasicResponseDTO<UserPersonalDetail> responseDTO = new BasicResponseDTO<>(true, "Image Upload Successfully", null);
        try {
            UserPersonalDetail _user = userPersonalDetailsDAO.getReferenceById(r.getUserID());
            if (_user != null) {
                // Cloudinary Image Upload
                // Account Configuration
                Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                        "cloud_name", "dzavgoc9w",
                        "api_key", "842688657531372",
                        "api_secret", "-djtDm1NRXVtjZ3L-HGaLfYnNBw",
                        "secure", true));
                // Upload Image
                Map uploadResult = cloudinary.uploader().upload(r.getFile().getBytes(), ObjectUtils.emptyMap());
                //_user.setImageUrl(FileUploadStorage.uploadFile(r.getFile()));
                // Update Image Url
                _user.setImageUrl(uploadResult.get("url").toString());
                userPersonalDetailsDAO.save(_user);
                responseDTO.setIsSuccess(true);
                responseDTO.setMessage("File upload issue");
                return new ResponseEntity(responseDTO, HttpStatus.OK);
            } else {
                responseDTO.setMessage("user not found");
                responseDTO.setIsSuccess(false);
                return new ResponseEntity(responseDTO, HttpStatus.BAD_REQUEST);
            }
        }catch (Exception ex){
            responseDTO.setIsSuccess(false);
            responseDTO.setMessage("Exception Message : "+ex.getMessage());
            return new ResponseEntity(responseDTO, HttpStatus.BAD_REQUEST);
        }
//        if(_user.isPresent()){
//            //Optional<String> fileName = filesStorageService.save(r.getFile());
//            String fileName = filesStorageService.uploadFile(r.getFile());
//            if(fileName.isEmpty()){
//
//                responseDTO.setIsSuccess(false);
//                responseDTO.setMessage("File upload issue");
//                return new  ResponseEntity(responseDTO, HttpStatus.OK);
//            }
//            UserPersonalDetail userPersonalDetail = _user.get();
//            userPersonalDetail.setImageUrl(fileUrl+fileName.get());
//            userPersonalDetail.setPublicID(UUID.randomUUID().toString());
//            userPersonalDetailsDAO.save(userPersonalDetail);
//            return new  ResponseEntity(responseDTO, HttpStatus.OK);
//        }

    }

    //AvailableSeat
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/AvailableSeat")
    public ResponseEntity<BasicResponseDTO<Long>> AvailableSeat(@RequestParam Long FlightID, String FlightDate){
        BasicResponseDTO<Long> responseDTO = new BasicResponseDTO<>(true, "Successfully", null);
        try{

            Optional<FlightsDetail> flightsDetail = flightDAO.findAll().stream().filter(x->x.getFlightID()==FlightID).findFirst();
            if(flightsDetail==null){
                responseDTO.setIsSuccess(false);
                responseDTO.setMessage("Flight Not Available");
                return new ResponseEntity(responseDTO, HttpStatus.OK);
            }

            Long flightDateCount = ticketDetailDAO
                    .findAll()
                    .stream()
                    .filter(x->x.getFlightDate().equalsIgnoreCase(FlightDate))
                    .count();


            Long availableSeat = flightsDetail.get().getSeat() - flightDateCount;

            if(availableSeat>0){
                responseDTO.setData(availableSeat);
            }else{
                responseDTO.setData(0L);
                responseDTO.setMessage("Seat Not Available");
            }

        }catch (Exception ex){
            responseDTO.setIsSuccess(false);
            responseDTO.setMessage("Exception Message : "+ex.getMessage());
        }

        return new  ResponseEntity(responseDTO, HttpStatus.OK);
    }

    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/GetUserTicketsByVendor")
    public ResponseEntity<PaginationResponseDTO<List<TicketDetailResponseDTO>>> GetUserTicketsByVendor(@RequestBody GetUserTicketsByVendorDTO r){
        PaginationResponseDTO<List<TicketDetailResponseDTO>> responseDTO = new PaginationResponseDTO<>();
        responseDTO.setIsSuccess(true);
        responseDTO.setMessage("Successfully");
        try{

            List<TicketDetailResponseDTO> response = new ArrayList<>();

            List<TicketDetail> _ticketDetails  = ticketDetailDAO.findAll().stream().toList();
            if(_ticketDetails.stream().count()==0){
                responseDTO.setIsSuccess(false);
                responseDTO.setMessage("Ticket details not available");
            }

            _ticketDetails.forEach(x->{
                Optional<FlightsDetail> _flightDetails = flightDAO
                                                                .findAll()
                                                                .stream()
                                                                .filter(x1->x1.getFlightID()==x.getFlightID())
                                                                .findFirst();

                Optional<User> _user = userDAO.findAll()
                                              .stream()
                                              .filter(x1->x1.getUserID()==x.getUserID())
                        .findFirst();

                if(_flightDetails.isPresent()){

                    TicketDetailResponseDTO _ticketData = new TicketDetailResponseDTO();
                    _ticketData.setTicketID(x.getTicketID());
                    _ticketData.setUserID(x.getUserID());
                    _ticketData.setFirstName(_user.get().getFirstName());
                    _ticketData.setLastName(_user.get().getLastName());
                    _ticketData.setEmail(_user.get().getEmail());
                    _ticketData.setFlightID(x.getFlightID());
                    _ticketData.setFlightName(_flightDetails.get().getFlightName());
                    _ticketData.setCompany(_flightDetails.get().getCompany());
                    _ticketData.setTo(_flightDetails.get().getToLevel());
                    _ticketData.setDestination(_flightDetails.get().getDestination());
                    _ticketData.setTime(_flightDetails.get().getFlightTime());
                    _ticketData.setPaymentType(x.getPaymentType());
                    _ticketData.setCardNo(x.getCartNo());
                    _ticketData.setUPIID(x.getUpiid());
                    _ticketData.setPrice(x.getPrice());
                    _ticketData.setStatus(x.getStatus());
                    _ticketData.setSeatClass(x.getSeatClass());
                    _ticketData.setFlightDate(x.getFlightDate());
                    response.add(_ticketData);
                }

            });

           List<TicketDetailResponseDTO> response1 = response.stream().filter(x->x.getCompany().trim().equalsIgnoreCase(r.getVendor())).toList();

            if(response1.stream().count()==0){
                responseDTO.setIsSuccess(false);
                responseDTO.setMessage("Data Not Found");
                return new  ResponseEntity(responseDTO, HttpStatus.OK);
            }

            responseDTO.setData(response1);

        }catch (Exception ex){
            responseDTO.setIsSuccess(false);
            responseDTO.setMessage("Exception Message : "+ex.getMessage());
        }

        return new  ResponseEntity(responseDTO, HttpStatus.OK);
    }

}
