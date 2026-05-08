package edu.rellon.AudioRent.auth.strategy;

import edu.rellon.AudioRent.common.model.User;
import org.springframework.stereotype.Component;

@Component
public class EmailValidationStrategy implements UserValidationStrategy {
    @Override
    public void validate(User user) {
        if (user.getEmail() == null || !user.getEmail().contains("@")) {
            throw new IllegalArgumentException("Invalid email format. Strategy execution failed.");
        }
    }
}
