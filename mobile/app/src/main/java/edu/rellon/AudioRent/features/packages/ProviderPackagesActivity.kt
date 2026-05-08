package edu.rellon.audiorent.features.packages

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.chip.Chip
import com.google.android.material.chip.ChipGroup
import com.google.android.material.floatingactionbutton.FloatingActionButton
import edu.rellon.audiorent.R
import edu.rellon.audiorent.common.api.PackageResponse
import edu.rellon.audiorent.common.api.RetrofitClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ProviderPackagesActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var chipGroup: ChipGroup
    private var allPackages = listOf<PackageResponse>()
    private var selectedCategory = "All"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_package_list)

        val toolbar = findViewById<Toolbar>(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        toolbar.title = "My Inventory"
        toolbar.setNavigationOnClickListener { finish() }

        recyclerView = findViewById(R.id.packagesRecyclerView)
        progressBar = findViewById(R.id.progressBar)
        chipGroup = findViewById(R.id.categoryChipGroup)
        val fab = findViewById<FloatingActionButton>(R.id.addPackageFab)
        
        fab.visibility = View.VISIBLE
        fab.setOnClickListener {
            startActivity(Intent(this, AddPackageActivity::class.java))
        }

        recyclerView.layoutManager = LinearLayoutManager(this)

        chipGroup.setOnCheckedStateChangeListener { group, checkedIds ->
            val chip = group.findViewById<Chip>(checkedIds.first())
            selectedCategory = chip.text.toString()
            filterPackages()
        }

        loadMyPackages()
    }

    override fun onStart() {
        super.onStart()
        loadMyPackages() // Auto-refresh when returning from AddPackage
    }

    private fun loadMyPackages() {
        val prefs = getSharedPreferences("AudioRent", MODE_PRIVATE)
        val token = "Bearer ${prefs.getString("TOKEN", "")}"

        progressBar.visibility = View.VISIBLE
        RetrofitClient.instance.getMyProviderPackages(token).enqueue(object : Callback<List<PackageResponse>> {
            override fun onResponse(call: Call<List<PackageResponse>>, response: Response<List<PackageResponse>>) {
                progressBar.visibility = View.GONE
                if (response.isSuccessful) {
                    allPackages = response.body() ?: emptyList()
                    filterPackages()
                } else {
                    Toast.makeText(this@ProviderPackagesActivity, "Failed to load inventory", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<PackageResponse>>, t: Throwable) {
                progressBar.visibility = View.GONE
                Toast.makeText(this@ProviderPackagesActivity, "Network error", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun filterPackages() {
        val filtered = if (selectedCategory == "All") {
            allPackages
        } else {
            allPackages.filter { it.category == selectedCategory }
        }
        
        recyclerView.adapter = PackageAdapter(filtered) { pkg ->
            // Detail logic
        }
    }
}
