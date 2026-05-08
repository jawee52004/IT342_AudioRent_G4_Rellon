package edu.rellon.audiorent.features.rental

import android.os.Bundle
import android.view.View
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import edu.rellon.audiorent.R
import edu.rellon.audiorent.common.api.RentalResponse
import edu.rellon.audiorent.common.api.RetrofitClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ProviderEarningsActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var totalEarningsText: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_provider_earnings)

        val toolbar = findViewById<Toolbar>(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        toolbar.setNavigationOnClickListener { finish() }

        recyclerView = findViewById(R.id.ordersRecyclerView)
        progressBar = findViewById(R.id.progressBar)
        totalEarningsText = findViewById(R.id.totalEarningsText)

        recyclerView.layoutManager = LinearLayoutManager(this)

        loadEarnings()
    }

    private fun loadEarnings() {
        val prefs = getSharedPreferences("AudioRent", MODE_PRIVATE)
        val token = "Bearer ${prefs.getString("TOKEN", "")}"

        progressBar.visibility = View.VISIBLE
        RetrofitClient.instance.getProviderRentals(token).enqueue(object : Callback<List<RentalResponse>> {
            override fun onResponse(call: Call<List<RentalResponse>>, response: Response<List<RentalResponse>>) {
                progressBar.visibility = View.GONE
                if (response.isSuccessful) {
                    val rentals = response.body() ?: emptyList()
                    displayRentals(rentals)
                } else {
                    Toast.makeText(this@ProviderEarningsActivity, "Failed to load orders", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<RentalResponse>>, t: Throwable) {
                progressBar.visibility = View.GONE
                Toast.makeText(this@ProviderEarningsActivity, "Network Error", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun displayRentals(rentals: List<RentalResponse>) {
        val total = rentals.filter { it.status == "CONFIRMED" || it.status == "COMPLETED" }
            .sumOf { it.totalPrice }
        
        totalEarningsText.text = "₱%.2f".format(total)
        recyclerView.adapter = RentalAdapter(rentals)
    }
}
