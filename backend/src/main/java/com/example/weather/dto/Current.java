package com.example.weather.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Current {
    private double temp_c;
    private Condition condition;
    private double wind_kph;
    private int humidity;
    private double uv;
}
