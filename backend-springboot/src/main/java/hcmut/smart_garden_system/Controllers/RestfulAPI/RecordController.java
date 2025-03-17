package hcmut.smart_garden_system.Controllers.RestfulAPI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import hcmut.smart_garden_system.Config.MqttPublisher;
import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.Services.RestfulAPI.RecordService;

@RestController
@RequestMapping("/api/v1/record")
public class RecordController {
    @Autowired
    private RecordService recordService;

    @GetMapping("/getCurrentRecord/{area}")
    public ResponseEntity<ResponseObject> getCurrentRecord(@PathVariable Integer area) {
        return recordService.FNC_getCurrentRecord(area);
    }

    @GetMapping("/getAllRecord")
    public ResponseEntity<ResponseObject> getAllRecord() {
        return recordService.FNC_getAllRecord();
    }
}
