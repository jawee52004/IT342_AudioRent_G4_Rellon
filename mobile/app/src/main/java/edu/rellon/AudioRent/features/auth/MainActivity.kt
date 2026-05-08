package edu.rellon.audiorent.features.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import edu.rellon.audiorent.R
import edu.rellon.audiorent.features.packages.PackageListActivity
import edu.rellon.audiorent.features.packages.ProviderPackagesActivity
import edu.rellon.audiorent.features.rental.RentalHistoryActivity
import edu.rellon.audiorent.features.rental.ProviderEarningsActivity
import edu.rellon.audiorent.features.auth.AdminDashboardActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val userNameText = findViewById<TextView>(R.id.userNameText)
        val exploreButton = findViewById<Button>(R.id.exploreButton)
        val rentalsButton = findViewById<Button>(R.id.rentalsButton)
        val logoutButton = findViewById<Button>(R.id.logoutButton)
        
        val customerSection = findViewById<LinearLayout>(R.id.customerSection)
        val providerSection = findViewById<LinearLayout>(R.id.providerSection)
        val adminSection = findViewById<LinearLayout>(R.id.adminSection)
        
        val managePackagesButton = findViewById<Button>(R.id.managePackagesButton)
        val providerDashboardButton = findViewById<Button>(R.id.providerDashboardButton)
        val adminDashboardButton = findViewById<Button>(R.id.adminDashboardButton)

        val prefs = getSharedPreferences("AudioRent", MODE_PRIVATE)
        val fullName = prefs.getString("USER_NAME", "User")
        val role = prefs.getString("USER_ROLE", "CUSTOMER")
        
        userNameText.text = "Hello, $fullName!"

        // Role-based visibility
        when (role) {
            "ADMIN" -> {
                adminSection.visibility = View.VISIBLE
                customerSection.visibility = View.GONE
                providerSection.visibility = View.GONE
            }
            "PROVIDER" -> {
                providerSection.visibility = View.VISIBLE
                customerSection.visibility = View.GONE
                adminSection.visibility = View.GONE
            }
            else -> {
                customerSection.visibility = View.VISIBLE
                providerSection.visibility = View.GONE
                adminSection.visibility = View.GONE
            }
        }

        exploreButton.setOnClickListener {
            startActivity(Intent(this, PackageListActivity::class.java))
        }

        rentalsButton.setOnClickListener {
            startActivity(Intent(this, RentalHistoryActivity::class.java))
        }
        
        managePackagesButton.setOnClickListener {
            startActivity(Intent(this, ProviderPackagesActivity::class.java))
        }
        
        providerDashboardButton.setOnClickListener {
            startActivity(Intent(this, ProviderEarningsActivity::class.java))
        }
        
        adminDashboardButton.setOnClickListener {
            startActivity(Intent(this, AdminDashboardActivity::class.java))
        }

        logoutButton.setOnClickListener {
            // Google Sign Out
            val gso = com.google.android.gms.auth.api.signin.GoogleSignInOptions.Builder(com.google.android.gms.auth.api.signin.GoogleSignInOptions.DEFAULT_SIGN_IN).build()
            val googleSignInClient = com.google.android.gms.auth.api.signin.GoogleSignIn.getClient(this, gso)
            googleSignInClient.signOut().addOnCompleteListener {
                prefs.edit().clear().apply()
                startActivity(Intent(this, LoginActivity::class.java))
                finish()
            }
        }
    }
}
