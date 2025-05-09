package com.sliit.skillsharingplatform.controller;

import com.sliit.skillsharingplatform.model.User;
import com.sliit.skillsharingplatform.service.UserService;
import com.sliit.skillsharingplatform.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class OAuthConfigController {

    private static final Logger logger = LoggerFactory.getLogger(OAuthConfigController.class);

    @Autowired
    private Environment env;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri:Not configured}")
    private String redirectUri;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    // Existing endpoint to expose config to frontend
    @GetMapping("/oauth-config")
    public ResponseEntity<Map<String, String>> getOAuthConfig() {
        logger.info("Fetching OAuth configuration");

        Map<String, String> config = new HashMap<>();

        String clientId = env.getProperty("spring.security.oauth2.client.registration.google.client-id");
        if (clientId != null && !clientId.isEmpty()) {
            config.put("clientId", clientId.substring(0, 5) + "..." + clientId.substring(clientId.length() - 5));
        } else {
            config.put("clientId", "Not configured");
        }

        String actualRedirectUri = redirectUri
            .replace("{baseUrl}", "http://localhost:8080")
            .replace("{registrationId}", "google");

        config.put("redirectUri", actualRedirectUri);

        return ResponseEntity.ok(config);
    }

    // ✅ NEW endpoint to handle successful login and redirect to frontend with token
    @GetMapping("/oauth2/success")
    public RedirectView onOAuthSuccess(@AuthenticationPrincipal OAuth2User oauthUser) {
        logger.info("Handling OAuth2 success");

        String email = oauthUser.getAttribute("email");
        String firstName = oauthUser.getAttribute("given_name");
        String lastName = oauthUser.getAttribute("family_name");

        if (email == null) {
            return new RedirectView(frontendUrl + "/error?type=email_missing");
        }

        Optional<User> optionalUser = userService.getUserByEmail(email);
        User user = optionalUser.orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFirstName(firstName);
            newUser.setLastName(lastName);
            newUser.setRole("user");
            newUser.setTermsAccepted(true);
            return userService.createUser(newUser);
        });

        String token = jwtUtil.generateToken(user);

        String redirectUrl = String.format(
            "%s/oauth2/callback?token=%s&userId=%s&firstName=%s&lastName=%s&email=%s",
            frontendUrl,
            token,
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail()
        );

        logger.info("Redirecting to: {}", redirectUrl);

        return new RedirectView(redirectUrl);
    }
}
