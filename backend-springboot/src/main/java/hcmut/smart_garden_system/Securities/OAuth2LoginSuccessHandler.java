package hcmut.smart_garden_system.Securities;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import hcmut.smart_garden_system.Models.Role;
import hcmut.smart_garden_system.Models.User;
import hcmut.smart_garden_system.Repositories.UserRepository;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtUtilities jwtUtilities;

    public OAuth2LoginSuccessHandler(JwtUtilities jwtUtilities) {
        this.jwtUtilities = jwtUtilities;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        OAuth2User principal = (OAuth2User) authentication.getPrincipal();
        // String email = (String) principal.getAttribute("email");       // error: github not public email
        String nameUser = (String) principal.getName();
        User user = userRepository.findByEmail(nameUser);
        Optional<User> optionalUser = Optional.ofNullable(user);

        optionalUser.ifPresentOrElse(u -> {
            String token = jwtUtilities.generateToken(u.getUsername(), u.getRole().toString());
            Cookie cookie = new Cookie("jwt", token);
            cookie.setHttpOnly(true); 
            cookie.setPath("/");
            cookie.setMaxAge(3600); 
            response.addCookie(cookie);
        }, () -> {
            // save user into db to checking with jwt token on later request
            User userEntity = new User();
            userEntity.setUsername(nameUser);
            userEntity.setEmail(nameUser);
            userEntity.setPassword(nameUser);
            userEntity.setRole(Role.USER);
            userRepository.save(userEntity);

            String token = jwtUtilities.generateToken(nameUser, Role.USER.toString());
            Cookie cookie = new Cookie("jwt", token);
            cookie.setHttpOnly(true); 
            cookie.setPath("/");
            cookie.setMaxAge(3600); 
            response.addCookie(cookie);
        });

        // super.onAuthenticationSuccess(request, response, authentication);
        getRedirectStrategy().sendRedirect(request, response, "/home");    }
}