package hello;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/mycareer")
public class RoutingController {
	
	private List<String> sections = Arrays.asList("myobjectives", "myfeedback", "mydevelopmentneeds", "myteam");
	
    @RequestMapping("")
    public String myapp(Model model) {
        return "myapp";
    }
    

    @RequestMapping("/{section}")
    public String mycareer(@PathVariable String section, Model model) {
    	model.addAttribute("section", section);
    	if(sections.contains(section)){
    		 return "mycareer";
    	}else{
    		return "myapp";
    	}  
    }

}