package edu.rellon.audiorent.features.auth

import android.os.Bundle
import android.view.View
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.tabs.TabLayout
import edu.rellon.audiorent.R
import edu.rellon.audiorent.common.api.PackageResponse
import edu.rellon.audiorent.common.api.RetrofitClient
import edu.rellon.audiorent.common.api.UserResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class AdminDashboardActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var tabLayout: TabLayout
    private lateinit var usersCountText: TextView
    private lateinit var packagesCountText: TextView
    private var currentTab = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_dashboard)

        val toolbar = findViewById<Toolbar>(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        toolbar.setNavigationOnClickListener { finish() }

        recyclerView = findViewById(R.id.adminRecyclerView)
        progressBar = findViewById(R.id.progressBar)
        tabLayout = findViewById(R.id.tabLayout)
        usersCountText = findViewById(R.id.totalUsersCount)
        packagesCountText = findViewById(R.id.totalPackagesCount)

        recyclerView.layoutManager = LinearLayoutManager(this)

        tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab?) {
                currentTab = tab?.position ?: 0
                fetchData()
            }
            override fun onTabUnselected(tab: TabLayout.Tab?) {}
            override fun onTabReselected(tab: TabLayout.Tab?) {}
        })

        fetchInitialStats()
        fetchData()
    }

    private fun fetchInitialStats() {
        val prefs = getSharedPreferences("AudioRent", MODE_PRIVATE)
        val token = "Bearer ${prefs.getString("TOKEN", "")}"

        RetrofitClient.instance.getAllUsers(token).enqueue(object : Callback<List<UserResponse>> {
            override fun onResponse(call: Call<List<UserResponse>>, response: Response<List<UserResponse>>) {
                if (response.isSuccessful) {
                    usersCountText.text = response.body()?.size?.toString() ?: "0"
                }
            }
            override fun onFailure(call: Call<List<UserResponse>>, t: Throwable) {}
        })

        RetrofitClient.instance.getAllAdminPackages(token).enqueue(object : Callback<List<PackageResponse>> {
            override fun onResponse(call: Call<List<PackageResponse>>, response: Response<List<PackageResponse>>) {
                if (response.isSuccessful) {
                    packagesCountText.text = response.body()?.size?.toString() ?: "0"
                }
            }
            override fun onFailure(call: Call<List<PackageResponse>>, t: Throwable) {}
        })
    }

    private fun fetchData() {
        val prefs = getSharedPreferences("AudioRent", MODE_PRIVATE)
        val token = "Bearer ${prefs.getString("TOKEN", "")}"

        progressBar.visibility = View.VISIBLE
        if (currentTab == 0) {
            RetrofitClient.instance.getAllUsers(token).enqueue(object : Callback<List<UserResponse>> {
                override fun onResponse(call: Call<List<UserResponse>>, response: Response<List<UserResponse>>) {
                    progressBar.visibility = View.GONE
                    if (response.isSuccessful) {
                        val users = response.body() ?: emptyList()
                        recyclerView.adapter = AdminUserAdapter(users) { userId ->
                            deactivateUser(userId)
                        }
                    } else {
                        Toast.makeText(this@AdminDashboardActivity, "Failed to load users", Toast.LENGTH_SHORT).show()
                    }
                }
                override fun onFailure(call: Call<List<UserResponse>>, t: Throwable) {
                    progressBar.visibility = View.GONE
                    Toast.makeText(this@AdminDashboardActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
        } else {
            RetrofitClient.instance.getAllAdminPackages(token).enqueue(object : Callback<List<PackageResponse>> {
                override fun onResponse(call: Call<List<PackageResponse>>, response: Response<List<PackageResponse>>) {
                    progressBar.visibility = View.GONE
                    if (response.isSuccessful) {
                        val packages = response.body() ?: emptyList()
                        recyclerView.adapter = AdminPackageAdapter(packages) { pkgId ->
                            deletePackage(pkgId)
                        }
                    } else {
                        Toast.makeText(this@AdminDashboardActivity, "Failed to load packages", Toast.LENGTH_SHORT).show()
                    }
                }
                override fun onFailure(call: Call<List<PackageResponse>>, t: Throwable) {
                    progressBar.visibility = View.GONE
                    Toast.makeText(this@AdminDashboardActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
        }
    }

    private fun deactivateUser(userId: String) {
        val prefs = getSharedPreferences("AudioRent", MODE_PRIVATE)
        val token = "Bearer ${prefs.getString("TOKEN", "")}"
        
        RetrofitClient.instance.deactivateUser(token, userId).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@AdminDashboardActivity, "User deactivated", Toast.LENGTH_SHORT).show()
                    fetchData()
                    fetchInitialStats()
                }
            }
            override fun onFailure(call: Call<Void>, t: Throwable) {}
        })
    }

    private fun deletePackage(pkgId: String) {
        val prefs = getSharedPreferences("AudioRent", MODE_PRIVATE)
        val token = "Bearer ${prefs.getString("TOKEN", "")}"
        
        RetrofitClient.instance.deletePackage(token, pkgId).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@AdminDashboardActivity, "Package deleted", Toast.LENGTH_SHORT).show()
                    fetchData()
                    fetchInitialStats()
                }
            }
            override fun onFailure(call: Call<Void>, t: Throwable) {}
        })
    }
}
