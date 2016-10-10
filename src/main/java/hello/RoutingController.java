package hello;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class RoutingController {

    @RequestMapping("/greeting")
    public String greeting() {
        return "greeting";
    }

}