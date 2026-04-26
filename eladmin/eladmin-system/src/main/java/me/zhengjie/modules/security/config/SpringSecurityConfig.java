/*
 *  Copyright 2019-2025 Zheng Jie
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package me.zhengjie.modules.security.config;

import lombok.RequiredArgsConstructor;
import me.zhengjie.modules.security.security.*;
import me.zhengjie.modules.security.service.OnlineUserService;
import me.zhengjie.utils.AnonTagUtils;
import me.zhengjie.utils.enums.RequestMethodEnum;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.CorsFilter;

import java.util.Map;
import java.util.Set;

/**
 * Spring Security 6（Spring Boot 3.3）配置：
 *  - antMatchers → requestMatchers
 *  - 取消 .and() 链式，改为 lambda DSL
 *  - @EnableGlobalMethodSecurity 已替换为 @EnableMethodSecurity
 *
 * @author Zheng Jie
 */
@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SpringSecurityConfig {

    private final TokenProvider tokenProvider;
    private final CorsFilter corsFilter;
    private final JwtAuthenticationEntryPoint authenticationErrorHandler;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final ApplicationContext applicationContext;
    private final SecurityProperties properties;
    private final OnlineUserService onlineUserService;

    @Bean
    GrantedAuthorityDefaults grantedAuthorityDefaults() {
        // 去除 ROLE_ 前缀
        return new GrantedAuthorityDefaults("");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // 密码加密方式
        return new BCryptPasswordEncoder();
    }

    @Bean
    protected SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        // 获取匿名标记
        Map<String, Set<String>> anonymousUrls = AnonTagUtils.getAnonymousUrl(applicationContext);

        httpSecurity
                // 禁用 CSRF
                .csrf(AbstractHttpConfigurer::disable)
                .addFilter(corsFilter)
                // 授权异常
                .exceptionHandling(handling -> handling
                        .authenticationEntryPoint(authenticationErrorHandler)
                        .accessDeniedHandler(jwtAccessDeniedHandler))
                // 防止 iframe 造成跨域
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                // 不创建会话
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Spring Boot 默认静态资源（/css/**、/js/**、/images/**、/webjars/**、favicon 等）
                        .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                        // 顶层 html 与 webSocket 直连
                        .requestMatchers(HttpMethod.GET,
                                "/*.html",
                                "/webSocket/**"
                        ).permitAll()
                        // Knife4j / OpenAPI 3 文档
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/swagger-resources/**",
                                "/v3/api-docs/**",
                                "/webjars/**",
                                "/doc.html",
                                "/favicon.ico"
                        ).permitAll()
                        // 文件
                        .requestMatchers("/avatar/**", "/file/**").permitAll()
                        // 阿里巴巴 druid
                        .requestMatchers("/druid/**").permitAll()
                        // 放行 OPTIONS 请求
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // 自定义匿名访问 URL：分别按请求方法放行
                        .requestMatchers(HttpMethod.GET, toArray(anonymousUrls, RequestMethodEnum.GET)).permitAll()
                        .requestMatchers(HttpMethod.POST, toArray(anonymousUrls, RequestMethodEnum.POST)).permitAll()
                        .requestMatchers(HttpMethod.PUT, toArray(anonymousUrls, RequestMethodEnum.PUT)).permitAll()
                        .requestMatchers(HttpMethod.PATCH, toArray(anonymousUrls, RequestMethodEnum.PATCH)).permitAll()
                        .requestMatchers(HttpMethod.DELETE, toArray(anonymousUrls, RequestMethodEnum.DELETE)).permitAll()
                        // 所有类型的接口都放行
                        .requestMatchers(toArray(anonymousUrls, RequestMethodEnum.ALL)).permitAll()
                        // 所有请求都需要认证
                        .anyRequest().authenticated())
                .with(securityConfigurerAdapter(), Customizer.withDefaults());

        return httpSecurity.build();
    }

    private TokenConfigurer securityConfigurerAdapter() {
        return new TokenConfigurer(tokenProvider, properties, onlineUserService);
    }

    private static String[] toArray(Map<String, Set<String>> anonymousUrls, RequestMethodEnum method) {
        Set<String> urls = anonymousUrls.get(method.getType());
        return urls == null ? new String[0] : urls.toArray(new String[0]);
    }
}
