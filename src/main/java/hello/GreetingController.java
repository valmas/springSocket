package hello;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Controller
public class GreetingController {


    @MessageMapping("/input")
    @SendTo("/topic/greetings")
    public Greeting greeting(Message m, Input input) {
        System.out.println(input);
        return new Greeting(String.format("Pits owes Gab %s€ , Aris owes Gab %s€", input.getPOwes(), input.getAOwes()));
    }

}
