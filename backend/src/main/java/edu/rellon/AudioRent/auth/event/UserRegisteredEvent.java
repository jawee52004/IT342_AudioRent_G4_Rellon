package edu.rellon.AudioRent.auth.event;

import edu.rellon.AudioRent.common.model.User;

public class UserRegisteredEvent {
    private final User user;

    public UserRegisteredEvent(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }
}
