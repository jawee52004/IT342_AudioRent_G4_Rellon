package edu.rellon.AudioRent.auth.strategy;

import edu.rellon.AudioRent.common.model.User;

public interface UserValidationStrategy {
    void validate(User user);
}
