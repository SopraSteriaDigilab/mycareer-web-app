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
public class RoutingController {
	
	private List<String> sections = Arrays.asList("myobjectives", "myfeedback", "mydevelopmentneeds", "myteam");
	
    @RequestMapping("")
    public String myapp(Model model) {
    	model.addAttribute("section", "myobjectives");
        return "reroute";
    }
    

    @RequestMapping("/{section}")
    public String mycareer(@PathVariable String section, Model model) {
    	if(!sections.contains(section))
    		return "reroute";
    	
    	model.addAttribute("section", section);
    	return "mycareer";
    }
    
    @RequestMapping("/access-issue")
    public String myapp() {
        return "access-issue";
    }

}