package com.AudioRent.backend.observer;

import com.AudioRent.backend.event.UserRegisteredEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class EmailNotificationListener {

    @EventListener
    public void onUserRegistered(UserRegisteredEvent event) {
        // Observer pattern: reacting to UserRegisteredEvent
        System.out.println("OBSERVER PATTERN: Sending welcome email to " + event.getUser().getEmail());
    }
}
