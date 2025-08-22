package com.example.weather.service;

import com.example.weather.dto.WeatherResponse;
import com.example.weather.model.weather;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class weatherSerivce {

    private final String API_KEY = "Include Your API key";
    private final String BASE_URL = "http://api.weatherapi.com/v1/current.json?key=";
    private final String aqi = "&aqp=no";
    public WeatherResponse weatherFromAPI(String location){
        String url = BASE_URL + API_KEY +"&q="+location+aqi;
        System.out.println(url);
//        deserialization
        RestTemplate restTemplate = new RestTemplate();

        WeatherResponse response = restTemplate.getForObject(url, WeatherResponse.class);
        return response;
//         return new weather();
    }
}
