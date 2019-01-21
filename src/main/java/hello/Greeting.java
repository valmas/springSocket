package hello;

import lombok.Data;
import lombok.NonNull;

@Data
public class Greeting {

    @NonNull
    private String message;

}
