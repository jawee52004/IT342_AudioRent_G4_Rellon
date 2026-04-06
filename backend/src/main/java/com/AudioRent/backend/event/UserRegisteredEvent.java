package com.AudioRent.backend.event;

import com.AudioRent.backend.model.User;

public class UserRegisteredEvent {
    private final User user;

    public UserRegisteredEvent(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }
}
