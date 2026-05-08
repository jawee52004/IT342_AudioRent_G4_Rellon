package edu.rellon.audiorent.features.packages

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bumptech.glide.Glide
import edu.rellon.audiorent.R
import edu.rellon.audiorent.common.api.PackageResponse
import edu.rellon.audiorent.common.api.RetrofitClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class PackageDetailActivity : AppCompatActivity() {

    private lateinit var imageView: ImageView
    private lateinit var nameText: TextView
    private lateinit var priceText: TextView
    private lateinit var descriptionText: TextView
    private lateinit var bookButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_package_detail)

        val toolbar = findViewById<androidx.appcompat.widget.Toolbar>(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        toolbar.setNavigationOnClickListener { finish() }

        imageView = findViewById(R.id.detailImage)
        nameText = findViewById(R.id.detailName)
        priceText = findViewById(R.id.detailPrice)
        descriptionText = findViewById(R.id.detailDescription)
        bookButton = findViewById(R.id.bookNowButton)

        val packageId = intent.getStringExtra("PACKAGE_ID") ?: return finish()

        loadPackageDetails(packageId)
    }

    private fun loadPackageDetails(id: String) {
        RetrofitClient.instance.getPackageById(id).enqueue(object : Callback<PackageResponse> {
            override fun onResponse(call: Call<PackageResponse>, response: Response<PackageResponse>) {
                if (response.isSuccessful) {
                    val pkg = response.body() ?: return
                    nameText.text = pkg.name
                    priceText.text = "₱${pkg.price} / day"
                    descriptionText.text = pkg.description

                    if (pkg.imageUrls.isNotEmpty()) {
                        Glide.with(this@PackageDetailActivity)
                            .load(pkg.imageUrls[0])
                            .into(imageView)
                    }

                    bookButton.setOnClickListener {
                        // val intent = Intent(this@PackageDetailActivity, BookingActivity::class.java)
                        // intent.putExtra("PACKAGE_ID", pkg.id)
                        // intent.putExtra("PACKAGE_NAME", pkg.name)
                        // startActivity(intent)
                        Toast.makeText(this@PackageDetailActivity, "Booking coming soon!", Toast.LENGTH_SHORT).show()
                    }
                }
            }

            override fun onFailure(call: Call<PackageResponse>, t: Throwable) {
                Toast.makeText(this@PackageDetailActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
