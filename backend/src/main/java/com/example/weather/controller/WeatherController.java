package com.example.weather.controller;

import com.example.weather.dto.WeatherResponse;
import com.example.weather.model.weather;
import com.example.weather.service.weatherSerivce;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/Weather")
public class WeatherController {
    @Autowired
    private weatherSerivce weatherSerivce;
    @GetMapping("/getWeather")
    public WeatherResponse getWeather(@RequestParam String city){

        return weatherSerivce.weatherFromAPI(city);
//        return city;
    }
}
