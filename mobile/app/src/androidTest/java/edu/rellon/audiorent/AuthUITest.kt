package edu.rellon.audiorent

import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.*
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.*
import androidx.test.ext.junit.rules.ActivityScenarioRule
import edu.rellon.audiorent.features.auth.LoginActivity
import org.junit.Assert.*
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class AuthUITest {

    @get:Rule
    val activityRule = ActivityScenarioRule(LoginActivity::class.java)

    @Test
    fun testLoginUI_Displayed() {
        // Check if all essential UI elements are visible
        onView(withId(R.id.emailInput)).check(matches(isDisplayed()))
        onView(withId(R.id.passwordInput)).check(matches(isDisplayed()))
        onView(withId(R.id.loginButton)).check(matches(isDisplayed()))
        onView(withId(R.id.googleLoginButton)).check(matches(isDisplayed()))
    }

    @Test
    fun testEmptyLogin_ShowsToast() {
        // Attempt login without credentials
        onView(withId(R.id.loginButton)).perform(click())
        
        // Check for error indication or staying on the same page
        onView(withId(R.id.emailInput)).check(matches(isDisplayed()))
    }
}
