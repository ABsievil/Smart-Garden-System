package hcmut.smart_garden_system.Services.RestfulAPI;

import java.math.BigDecimal;
import java.sql.Date; // Import java.sql.Date
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.DayOfWeek;
import java.time.format.TextStyle; // Import TextStyle
import java.util.ArrayList;
import java.util.Arrays; // Import Arrays
import java.util.Collections; // Import Collections
import java.util.HashMap;
import java.util.LinkedHashMap; // Import LinkedHashMap
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.Locale; // Import Locale

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import hcmut.smart_garden_system.Controllers.SensorController;
import hcmut.smart_garden_system.DTOs.ResponseObject;
import hcmut.smart_garden_system.Models.SensorData;
import hcmut.smart_garden_system.Models.DBTable.Notification;
import hcmut.smart_garden_system.Repositories.DeviceRepository;
import hcmut.smart_garden_system.Repositories.NotificationRepository;
import hcmut.smart_garden_system.Repositories.RecordRepository;
import hcmut.smart_garden_system.Repositories.ScheduleRepository;
import hcmut.smart_garden_system.Repositories.StaffScheduleRepository;
import hcmut.smart_garden_system.Repositories.TreeRepository;

@Service
public class DashboardService {
    @Autowired
    private TreeRepository treeRepository;

    @Autowired
    private StaffScheduleRepository staffScheduleRepository;

    @Autowired
    private RecordRepository recordRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public ResponseEntity<ResponseObject> getSummaryData() {
        try {
            // Lấy dữ liệu từ các repository
            Long plants = treeRepository.countAllPlants();
            Long staff = staffScheduleRepository.countDistinctStaff();
            Long events = recordRepository.countAllEvents();
            Long devices = deviceRepository.countAllDevices();

            // Gói 4 biến thành một Map để trả về dưới dạng JSON
            Map<String, Object> summaryData = new LinkedHashMap<>();
            summaryData.put("plants", plants);
            summaryData.put("staff", staff);
            summaryData.put("events", events);
            summaryData.put("devices", devices);

            // Trả về response thành công với dữ liệu JSON
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query to get summary data successfully", summaryData));
        } catch (DataAccessException e) {
            // Xử lý lỗi liên quan đến truy cập cơ sở dữ liệu
            System.err.println("Database error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (IllegalArgumentException e) {
            // Xử lý lỗi do tham số không hợp lệ
            System.err.println("Invalid argument error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseObject("ERROR", "Invalid argument: " + e.getMessage(), null));
        } catch (Exception e) {
            // Xử lý các lỗi chung khác
            System.err.println("Unexpected error in getSummaryData(): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Unexpected error: " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> getTemperatureData(Long areaId) {
        try {
            LocalDate today = LocalDate.now();
            YearMonth currentYearMonth = YearMonth.from(today);
            YearMonth lastYearMonth = currentYearMonth.minusMonths(1);

            LocalDateTime startOfLastMonthDateTime = lastYearMonth.atDay(1).atStartOfDay();
            LocalDateTime startOfNextMonthDateTime = currentYearMonth.plusMonths(1).atDay(1).atStartOfDay();

            // Gọi phương thức mới từ repository với areaId
            List<Object[]> dailyAveragesRaw = recordRepository.findDailyAverageTemperatureByArea(
                startOfLastMonthDateTime,
                startOfNextMonthDateTime,
                areaId // Truyền areaId vào query
            );

            Map<LocalDate, Double> dailyAverages = new HashMap<>();
            for (Object[] row : dailyAveragesRaw) {
                LocalDate recordDate = null;
                Double avgTemp = null;
                if (row[0] instanceof java.sql.Date) {
                    recordDate = ((java.sql.Date) row[0]).toLocalDate();
                } else if (row[0] != null) {
                     System.err.println("Unexpected date type: " + row[0].getClass().getName());
                }
                if (row[1] instanceof Double) {
                    avgTemp = (Double) row[1];
                } else if (row[1] instanceof BigDecimal) {
                    avgTemp = ((BigDecimal) row[1]).doubleValue();
                } else if (row[1] != null) {
                     System.err.println("Unexpected temperature type: " + row[1].getClass().getName());
                }
                if (recordDate != null && avgTemp != null) {
                    dailyAverages.put(recordDate, avgTemp);
                }
            }

            // Xác định các ngày mục tiêu
            List<Integer> targetDays = Arrays.asList(1, 5, 10, 15, 20, 25, 30);

            int daysInLastMonth = lastYearMonth.lengthOfMonth();
            int daysInThisMonth = currentYearMonth.lengthOfMonth();
            int currentDayOfMonth = today.getDayOfMonth();

            List<Double> lastMonthData = new ArrayList<>();
            // Lặp qua các ngày mục tiêu
            for (int day : targetDays) {
                if (day <= daysInLastMonth) {
                    lastMonthData.add(dailyAverages.get(lastYearMonth.atDay(day)));
                } else {
                    // Ngày mục tiêu không tồn tại trong tháng trước (ví dụ: 30/2)
                    lastMonthData.add(null);
                }
            }

            List<Double> thisMonthData = new ArrayList<>();
            // Lặp qua các ngày mục tiêu
            for (int day : targetDays) {
                if (day > daysInThisMonth) {
                    // Ngày mục tiêu không tồn tại trong tháng này (ví dụ: 30/2)
                    thisMonthData.add(null);
                } else if (day > currentDayOfMonth) {
                    // Ngày mục tiêu trong tương lai của tháng này
                    thisMonthData.add(null);
                } else {
                    thisMonthData.add(dailyAverages.get(currentYearMonth.atDay(day)));
                }
            }

            // Tính trung bình chỉ dựa trên dữ liệu của các ngày mục tiêu đã lấy
            double lastMonthSum = 0;
            int lastMonthCount = 0;
            for (Double temp : lastMonthData) {
                if (temp != null) {
                    lastMonthSum += temp;
                    lastMonthCount++;
                }
            }
            // Sử dụng Locale.US để đảm bảo dấu thập phân là '.'
            double lastMonthAverage = (lastMonthCount > 0) ? Double.parseDouble(String.format(Locale.US, "%.1f", lastMonthSum / lastMonthCount)) : 0.0;

            double thisMonthSum = 0;
            int thisMonthCount = 0;
            for (Double temp : thisMonthData) {
                if (temp != null) {
                    thisMonthSum += temp;
                    thisMonthCount++;
                }
            }
            // Sử dụng Locale.US để đảm bảo dấu thập phân là '.'
            double thisMonthAverage = (thisMonthCount > 0) ? Double.parseDouble(String.format(Locale.US, "%.1f", thisMonthSum / thisMonthCount)) : 0.0;

            // Tạo danh sách các ngày mục tiêu dưới dạng chuỗi
            List<String> dates = targetDays.stream()
                                           .map(day -> String.format("%02d", day))
                                           .collect(Collectors.toList());

            // Sử dụng LinkedHashMap để duy trì thứ tự chèn
            Map<String, Object> temperatureData = new LinkedHashMap<>();
            // Giữ nguyên thứ tự put mong muốn
            temperatureData.put("thisMonth", thisMonthData);
            temperatureData.put("lastMonth", lastMonthData);
            temperatureData.put("thisMonthAverage", thisMonthAverage);
            temperatureData.put("lastMonthAverage", lastMonthAverage);
            temperatureData.put("dates", dates);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query getTemperatureData() successfully for specific days", temperatureData));
        } catch (DataAccessException e) {
            System.err.println("Database error in getTemperatureData(): " + e.getMessage());
             e.printStackTrace(); // In chi tiết lỗi ra console để debug
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            System.err.println("Unexpected error in getTemperatureData(): " + e.getMessage());
            e.printStackTrace(); // In chi tiết lỗi ra console để debug
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Unexpected error: " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> getHumidityData(Long areaId) {
        try {
            LocalDate today = LocalDate.now();
            LocalDate sevenDaysAgo = today.minusDays(6); // Bao gồm cả ngày hôm nay
            LocalDateTime startDateTime = sevenDaysAgo.atStartOfDay();
            LocalDateTime endDateTime = today.plusDays(1).atStartOfDay(); // Ngày mai để bao gồm hết hôm nay

            // Lấy dữ liệu trung bình hàng ngày từ repository
            List<Object[]> dailyAveragesRaw = recordRepository.findDailyAverageHumidityAndSoilMoistureByAreaForLastNDays(
                areaId,
                startDateTime,
                endDateTime
            );

            // Lưu trữ kết quả theo ngày
            Map<LocalDate, Map<String, Double>> dailyAverages = new HashMap<>();
            for (Object[] row : dailyAveragesRaw) {
                LocalDate recordDate = null;
                Double avgHumidity = null;
                Double avgSoilMoisture = null;

                if (row[0] instanceof java.sql.Date) {
                    recordDate = ((java.sql.Date) row[0]).toLocalDate();
                } else if (row[0] != null) {
                    System.err.println("Unexpected date type: " + row[0].getClass().getName());
                }

                if (row[1] instanceof Double) {
                    avgHumidity = (Double) row[1];
                } else if (row[1] instanceof BigDecimal) {
                    avgHumidity = ((BigDecimal) row[1]).doubleValue();
                } else if (row[1] != null) {
                    System.err.println("Unexpected humidity type: " + row[1].getClass().getName());
                }

                if (row[2] instanceof Double) {
                    avgSoilMoisture = (Double) row[2];
                } else if (row[2] instanceof BigDecimal) {
                    avgSoilMoisture = ((BigDecimal) row[2]).doubleValue();
                } else if (row[2] != null) {
                    System.err.println("Unexpected soil moisture type: " + row[2].getClass().getName());
                }

                if (recordDate != null) {
                    Map<String, Double> values = new HashMap<>();
                    // Làm tròn đến 1 chữ số thập phân (nếu không null)
                    values.put("humidity", (avgHumidity != null) ? Double.parseDouble(String.format(Locale.US, "%.1f", avgHumidity)) : null);
                    values.put("soil_moisture", (avgSoilMoisture != null) ? Double.parseDouble(String.format(Locale.US, "%.1f", avgSoilMoisture)) : null);
                    dailyAverages.put(recordDate, values);
                }
            }

            // Chuẩn bị danh sách cho 7 ngày gần nhất
            List<Double> airHumidityData = new ArrayList<>();
            List<Double> soilMoistureData = new ArrayList<>();
            List<String> daysOfWeekData = new ArrayList<>();

            for (int i = 0; i < 7; i++) {
                LocalDate date = sevenDaysAgo.plusDays(i);
                Map<String, Double> values = dailyAverages.get(date);
                if (values != null) {
                    airHumidityData.add(values.get("humidity"));
                    soilMoistureData.add(values.get("soil_moisture"));
                } else {
                    // Thêm null nếu không có dữ liệu cho ngày đó
                    airHumidityData.add(null);
                    soilMoistureData.add(null);
                }
                // Thêm tên viết tắt của ngày trong tuần (ví dụ: "Mon")
                daysOfWeekData.add(date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.US));
            }

            // Tạo Map kết quả
            Map<String, Object> humidityData = new LinkedHashMap<>(); // Dùng LinkedHashMap để giữ thứ tự
            humidityData.put("airHumidity", airHumidityData);
            humidityData.put("soilMoisture", soilMoistureData);
            humidityData.put("daysOfWeek", daysOfWeekData);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query getHumidityData() successfully for last 7 days", humidityData));

        } catch (DataAccessException e) {
            System.err.println("Database error in getHumidityData(): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            System.err.println("Unexpected error in getHumidityData(): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Unexpected error: " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> getNotifications() {
        try {
            List<Notification> notifications = notificationRepository.findAllNotifications();

            List<Map<String, Object>> notificationData = notifications.stream().map(n -> {
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("userId", n.getId().getUserId());   // Lấy userId từ NotificationId
                map.put("content", n.getId().getContent());  // Lấy content từ NotificationId
                return map;
            }).collect(Collectors.toList());

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query to get notifications successfully", notificationData));

        } catch (DataAccessException e) {
            System.err.println("Database error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            System.err.println("Unexpected error in getNotifications(): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Unexpected error: " + e.getMessage(), null));
        }
    }
}
