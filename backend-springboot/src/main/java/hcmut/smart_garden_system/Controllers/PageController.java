package hcmut.smart_garden_system.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import hcmut.smart_garden_system.Services.SensorDataService;

@Controller
public class PageController {

    @Autowired
    private SensorDataService sensorDataService;
    
    @RequestMapping(value = {"/", "/index"}, method = RequestMethod.GET)
    String webcomePage(){
        return "index";
    }

    @GetMapping("/sensorData")
    public String sensorData(Model model) {
        model.addAttribute("sensorData", sensorDataService.getLatestData());
        return "sensorData";
    }

    @GetMapping("/sendEmail")
    String sendEmailPage(){
        return "emailForm";
    }

    @RequestMapping("/login")
    String loginPage(){
        return "login";
    }

    @RequestMapping("/signout")
    public String signoutPage(HttpServletResponse response){
        Cookie cookie = new Cookie("jwt", "");
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
        return "redirect:/index";
    }

    @Controller
    public class AcceptedPage {

        @GetMapping("/home")
        String homePage(){
            return "homePage";
        }

        @GetMapping("/sendEmail")
        String sendEmailPage(){
            return "emailForm";
        }
    }
}
