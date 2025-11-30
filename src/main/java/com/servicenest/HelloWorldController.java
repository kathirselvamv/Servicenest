package com.servicenest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorldController{
	@GetMapping("/hello")
	String Sayhelloworld()
	{
		
		return "Hello world";
	}
	
	
	

}
