package hcmut.smart_garden_system.Services.RestfulAPI;

import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.DTOs.RestfulAPI.TreeDTO;
import hcmut.smart_garden_system.Models.DBTable.Tree;
import hcmut.smart_garden_system.Repositories.TreeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class TreeService {

    @Autowired
    private TreeRepository treeRepository;

    public ResponseEntity<ResponseObject> getAllPlantList() {
        try {
            List<Tree> allPlants = treeRepository.findAll();
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("plants", allPlants);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Get all plant list successfully", data));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Failed to get all plant list: " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> addNewPlant(TreeDTO treeDTO) {
        try {
            Tree tree = new Tree();
            tree.setName(treeDTO.getName());
            tree.setSoldMoistureRecommend(treeDTO.getSoldMoistureRecommend());
            tree.setGrowthTime(treeDTO.getGrowthTime());
            tree.setSeason(treeDTO.getSeason());
            tree.setAmount(treeDTO.getAmount());

            treeRepository.save(tree);
     
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("createdPlant", tree);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ResponseObject("CREATED", "New plant added successfully", data));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Failed to add new plant: " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> editPlantInformation(Integer areaId, TreeDTO updatedTreeDetails) {
        try {
            Tree existingTree = treeRepository.findById(areaId)
                    .orElseThrow(() -> new EntityNotFoundException("Tree not found with id: " + areaId));

            existingTree.setName(updatedTreeDetails.getName());
            existingTree.setSoldMoistureRecommend(updatedTreeDetails.getSoldMoistureRecommend());
            existingTree.setGrowthTime(updatedTreeDetails.getGrowthTime());
            existingTree.setSeason(updatedTreeDetails.getSeason());
            existingTree.setAmount(updatedTreeDetails.getAmount());

            treeRepository.save(existingTree);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Plant information updated successfully", null));

        } catch (EntityNotFoundException e) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND)
                     .body(new ResponseObject("NOT_FOUND", e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Failed to edit plant information: " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> deletePlant(Integer areaId) {
        try {
            if (!treeRepository.existsById(areaId)) {
                throw new EntityNotFoundException("Tree not found with id: " + areaId);
            }
            treeRepository.deleteById(areaId);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Plant deleted successfully", null));

        } catch (EntityNotFoundException e) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND)
                     .body(new ResponseObject("NOT_FOUND", e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Failed to delete plant: " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> getPlantById(Integer areaId) {
        try {
            Tree tree = treeRepository.findById(areaId)
                    .orElseThrow(() -> new EntityNotFoundException("Tree not found with id: " + areaId));
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("plant", tree);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Get plant by id successfully", data));
        } catch (EntityNotFoundException e) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND)
                     .body(new ResponseObject("NOT_FOUND", e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Failed to get plant by id: " + e.getMessage(), null));
        }
    }
} 