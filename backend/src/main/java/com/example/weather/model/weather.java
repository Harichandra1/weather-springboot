package com.example.weather.model;
import com.example.weather.enums.Condition;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Data
@ToString
public class weather {
    String temp_c ;
    String temp_f;
    Condition cond;
    String feelsLike;
    String uv;
}
