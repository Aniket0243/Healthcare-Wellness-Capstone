package com.healthcare.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors()  // ✅ enable cors via CorsConfigurationSource bean
            .and()
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Swagger (optional)
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                // Public auth + registration
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/patients/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/providers/register").permitAll()

                // Wellness
                .requestMatchers(HttpMethod.GET, "/api/wellness/services").permitAll()
                .requestMatchers("/api/wellness/enroll/**").hasRole("PATIENT")
                .requestMatchers("/api/wellness/my-enrollments").hasRole("PATIENT")
                .requestMatchers(HttpMethod.PUT, "/api/wellness/progress/**").hasRole("PATIENT")

                // Appointments
             // Appointments
                .requestMatchers(HttpMethod.POST, "/api/appointments").hasRole("PATIENT")
                .requestMatchers(HttpMethod.PUT, "/api/appointments/**").hasRole("PATIENT")
                .requestMatchers(HttpMethod.DELETE, "/api/appointments/**").hasRole("PATIENT")
                .requestMatchers("/api/appointments/my").hasRole("PATIENT")
                .requestMatchers("/api/appointments/provider/**").hasAnyRole("DOCTOR","WELLNESS_PROVIDER","ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/appointments").hasRole("ADMIN")


                // Admin
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Payments
                .requestMatchers(HttpMethod.POST, "/api/payments").hasRole("PATIENT")
                .requestMatchers("/api/payments/my").hasRole("PATIENT")
                .requestMatchers("/api/payments/all").hasRole("ADMIN")
                .requestMatchers("/api/payments/tx/**").hasRole("ADMIN")

                // Everything else
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    // ✅ Global CORS configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000")); // frontend
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        config.setAllowCredentials(true); // if using cookies/session

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() { 
        return new BCryptPasswordEncoder(); 
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
