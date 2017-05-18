package application;

import static java.time.Month.DECEMBER;
import static java.time.Month.FEBRUARY;
import static java.time.Month.JANUARY;
import static java.time.Month.NOVEMBER;
import static java.time.Month.OCTOBER;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.Month;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class RoutingController
{

  private List<String> sections = Arrays.asList("myobjectives", "myfeedback", "mydevelopmentneeds", "myratings",
      "myteam", "hrdashboard", "myhistory", "employeesearch");
  private String host;

  @RequestMapping("")
  public String myapp(Model model)
  {
    try
    {
      host = InetAddress.getLocalHost().getHostName();
    }
    catch (UnknownHostException e)
    {
      e.printStackTrace();
    }
    model.addAttribute("section", "myobjectives");
    model.addAttribute("env", host);
    return "reroute";
  }

  @RequestMapping("/{section}")
  public String mycareer(@PathVariable String section, Model model)
  {
    try
    {
      host = InetAddress.getLocalHost().getHostName();
    }
    catch (UnknownHostException e)
    {
      e.printStackTrace();
    }
    
    if (!sections.contains(section)) return "reroute";
    
    if (section.equals("myratings")){
      if(!isRatingPeriod()){
        return "reroute";
      }
    }
    
    model.addAttribute("section", section);
    model.addAttribute("env", host);
    
    return "mycareer";
  }

  @RequestMapping("/access-issue")
  public String myapp()
  {
    return "access-issue";
  }

  private static boolean isRatingPeriod()
  {
    Month currentMonth = YearMonth.now().getMonth();

    return currentMonth.equals(OCTOBER) || currentMonth.equals(NOVEMBER) || currentMonth.equals(DECEMBER)
        || currentMonth.equals(JANUARY) || currentMonth.equals(FEBRUARY);
  }
}