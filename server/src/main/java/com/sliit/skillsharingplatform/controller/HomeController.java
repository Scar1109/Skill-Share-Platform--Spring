package com.sliit.skillsharingplatform.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class HomeController {

    // Redirect root URL to the frontend application
    @GetMapping("/")
    public RedirectView redirectToFrontend() {
        return new RedirectView("http://localhost:3000");
    }
    
    // Handle error page
    @GetMapping("/error")
    public RedirectView handleError() {
        return new RedirectView("http://localhost:3000/error");
    }
}
