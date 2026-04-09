package com.AudioRent.backend.adapter;

import java.util.Map;

public interface OAuthProvider {
    Map<String, String> verifyTokenAndGetPayload(String token) throws Exception;
}
