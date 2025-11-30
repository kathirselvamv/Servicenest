package com.servicenest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TodoApp {
	@GetMapping("/home")
	String todo(){
		
		return "hello kathir";
	}

}
