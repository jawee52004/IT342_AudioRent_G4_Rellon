package edu.rellon.audiorent

import edu.rellon.audiorent.R
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val userNameText = findViewById<TextView>(R.id.userNameText)
        val logoutButton = findViewById<Button>(R.id.logoutButton)

        val fullName = intent.getStringExtra("USER_NAME") ?: "User"
        userNameText.text = "Hello, $fullName!"

        logoutButton.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }
    }
}