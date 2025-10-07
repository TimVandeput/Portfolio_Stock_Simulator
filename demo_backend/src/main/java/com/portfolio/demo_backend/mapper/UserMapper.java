package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.user.CreateUserDTO;
import com.portfolio.demo_backend.dto.user.UpdateUserDTO;
import com.portfolio.demo_backend.model.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "username", source = "username")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "password", source = "password")
    User toEntity(CreateUserDTO dto);

    @Mapping(target = "password", ignore = true)
    CreateUserDTO toDTO(User user);

    @BeanMapping(ignoreByDefault = true)
    @Mappings({
            @Mapping(target = "username", source = "username"),
            @Mapping(target = "email", source = "email"),
            @Mapping(target = "password", source = "password")
    })
    User fromUpdateDTO(UpdateUserDTO dto);
}
