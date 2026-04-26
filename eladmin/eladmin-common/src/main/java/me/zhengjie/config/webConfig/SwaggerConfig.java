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
package me.zhengjie.config.webConfig;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * api页面 /doc.html （Knife4j 4.x + springdoc-openapi 3）
 * @author Zheng Jie
 * @date 2018-11-23
 */
@Configuration
public class SwaggerConfig {

    @Value("${jwt.header:Authorization}")
    private String tokenHeader;

    @Bean
    public OpenAPI eladminOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("ELADMIN 接口文档")
                        .description("一个简单且易上手的 Spring Boot 后台管理框架")
                        .version("1.1"))
                .components(new Components()
                        .addSecuritySchemes(tokenHeader, new SecurityScheme()
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.HEADER)
                                .name(tokenHeader)))
                .addSecurityItem(new SecurityRequirement().addList(tokenHeader));
    }
}
