package edu.rellon.AudioRent.auth.adapter;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Component
public class GoogleAuthAdapter implements OAuthProvider {

    private final String GOOGLE_CLIENT_ID = "1075750667833-kisopk6s1pl2egd1a6l7cuh28aodtfrd.apps.googleusercontent.com";

    @Override
    public Map<String, String> verifyTokenAndGetPayload(String token) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                .build();

        GoogleIdToken idToken = verifier.verify(token);
        if (idToken == null) {
            throw new RuntimeException("Invalid Google Token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        Map<String, String> result = new HashMap<>();
        result.put("email", payload.getEmail());
        result.put("name", (String) payload.get("name"));
        return result;
    }
}
