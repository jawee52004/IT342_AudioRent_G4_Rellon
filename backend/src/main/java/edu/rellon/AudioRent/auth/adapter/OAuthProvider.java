package edu.rellon.AudioRent.auth.adapter;

import java.util.Map;

public interface OAuthProvider {
    Map<String, String> verifyTokenAndGetPayload(String token) throws Exception;
}
