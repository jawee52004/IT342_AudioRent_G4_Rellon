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

class RentalHistoryActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var emptyText: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_rental_history)

        val toolbar = findViewById<Toolbar>(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        toolbar.setNavigationOnClickListener { finish() }

        recyclerView = findViewById(R.id.rentalsRecyclerView)
        progressBar = findViewById(R.id.progressBar)
        emptyText = findViewById(R.id.emptyText)

        recyclerView.layoutManager = LinearLayoutManager(this)

        loadRentalHistory()
    }

    private fun loadRentalHistory() {
        val prefs = getSharedPreferences("AudioRent", MODE_PRIVATE)
        val token = prefs.getString("TOKEN", "") ?: ""

        if (token.isEmpty()) {
            Toast.makeText(this, "Please login first", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        progressBar.visibility = View.VISIBLE
        RetrofitClient.instance.getMyRentals("Bearer $token").enqueue(object : Callback<List<RentalResponse>> {
            override fun onResponse(call: Call<List<RentalResponse>>, response: Response<List<RentalResponse>>) {
                progressBar.visibility = View.GONE
                if (response.isSuccessful) {
                    val rentals = response.body() ?: emptyList()
                    if (rentals.isEmpty()) {
                        emptyText.visibility = View.VISIBLE
                    } else {
                        recyclerView.adapter = RentalAdapter(rentals)
                    }
                } else {
                    Toast.makeText(this@RentalHistoryActivity, "Failed to load history", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<RentalResponse>>, t: Throwable) {
                progressBar.visibility = View.GONE
                Toast.makeText(this@RentalHistoryActivity, "Network error", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
