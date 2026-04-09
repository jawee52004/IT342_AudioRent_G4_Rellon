package com.AudioRent.backend.strategy;

import com.AudioRent.backend.model.User;

public interface UserValidationStrategy {
    void validate(User user);
}
