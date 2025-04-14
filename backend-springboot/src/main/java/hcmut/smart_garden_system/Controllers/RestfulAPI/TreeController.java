package hcmut.smart_garden_system.Controllers.RestfulAPI;

import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.DTOs.RestfulAPI.TreeDTO;
import hcmut.smart_garden_system.Models.DBTable.Tree;
import hcmut.smart_garden_system.Services.RestfulAPI.TreeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/trees")
public class TreeController {

    @Autowired
    private TreeService treeService;

    // GET /api/trees - Lấy danh sách tất cả cây trồng
    @GetMapping
    public ResponseEntity<ResponseObject> getAllPlantList() {
        return treeService.getAllPlantList();
    }

    // POST /api/trees - Thêm một cây trồng mới
    @PostMapping
    public ResponseEntity<ResponseObject> addNewPlant(@RequestBody TreeDTO treeDTO) {
        // Lưu ý: Cần đảm bảo phương thức treeService.addNewPlant cũng được cập nhật
        // để chấp nhận TreeDTO hoặc bạn cần chuyển đổi TreeDTO thành Tree ở đây.
        return treeService.addNewPlant(treeDTO); // Truyền treeDTO vào service
    }

    // GET /api/trees/{areaId} - Lấy thông tin cây trồng theo ID (chỉ dùng areaId)
    @GetMapping("/{areaId}")
    public ResponseEntity<ResponseObject> getPlantById(
        @PathVariable Integer areaId) { 
        return treeService.getPlantById(areaId); // Truyền thẳng areaId
    }

    // PUT /api/trees/{areaId} - Chỉnh sửa thông tin cây trồng theo ID (chỉ dùng areaId)
    @PutMapping("/{areaId}")
    public ResponseEntity<ResponseObject> editPlantInformation(
        @PathVariable Integer areaId,
        @RequestBody TreeDTO treeDetails) { // Lưu ý: treeDetails giờ nên chứa cả 'name' nếu muốn cập nhật
        
        return treeService.editPlantInformation(areaId, treeDetails); // Truyền thẳng areaId
    }

    // DELETE /api/trees/{areaId} - Xóa cây trồng theo ID (chỉ dùng areaId)
    @DeleteMapping("/{areaId}")
    public ResponseEntity<ResponseObject> deletePlant(
        @PathVariable Integer areaId) {
        return treeService.deletePlant(areaId); // Truyền thẳng areaId
    }
} 