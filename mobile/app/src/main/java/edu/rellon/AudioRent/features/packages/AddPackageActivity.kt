package edu.rellon.audiorent.features.packages

import android.net.Uri
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import com.google.android.material.textfield.TextInputEditText
import edu.rellon.audiorent.R
import edu.rellon.audiorent.common.api.PackageResponse
import edu.rellon.audiorent.common.api.RetrofitClient
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.File
import java.io.FileOutputStream

class AddPackageActivity : AppCompatActivity() {

    private val selectedImages = mutableListOf<Uri>()
    private lateinit var photosCountText: TextView

    private val pickMultipleMedia = registerForActivityResult(ActivityResultContracts.PickMultipleVisualMedia(5)) { uris ->
        if (uris.isNotEmpty()) {
            selectedImages.clear()
            selectedImages.addAll(uris)
            photosCountText.text = "${uris.size} photos selected"
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_package)

        val toolbar = findViewById<Toolbar>(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        toolbar.setNavigationOnClickListener { finish() }

        val nameInput = findViewById<TextInputEditText>(R.id.pkgNameInput)
        val priceInput = findViewById<TextInputEditText>(R.id.pkgPriceInput)
        val quantityInput = findViewById<TextInputEditText>(R.id.pkgQuantityInput)
        val descInput = findViewById<TextInputEditText>(R.id.pkgDescInput)
        val categoryDropdown = findViewById<AutoCompleteTextView>(R.id.categoryDropdown)
        val pickButton = findViewById<Button>(R.id.pickImagesButton)
        val saveButton = findViewById<Button>(R.id.savePkgButton)
        photosCountText = findViewById(R.id.selectedPhotosCountText)

        // Setup Category Dropdown
        val categories = arrayOf("Basic (Small Events)", "Standard (Medium Events)", "Professional (Large Events)")
        val adapter = ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, categories)
        categoryDropdown.setAdapter(adapter)

        pickButton.setOnClickListener {
            pickMultipleMedia.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
        }

        saveButton.setOnClickListener {
            val name = nameInput.text.toString().trim()
            val price = priceInput.text.toString().trim()
            val quantity = quantityInput.text.toString().trim()
            val desc = descInput.text.toString().trim()
            val category = categoryDropdown.text.toString()

            if (name.isEmpty() || price.isEmpty() || quantity.isEmpty() || category.isEmpty()) {
                Toast.makeText(this, "Please fill all required fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            savePackage(name, price, quantity, category, desc)
        }
    }

    private fun savePackage(name: String, price: String, quantity: String, category: String, desc: String) {
        val prefs = getSharedPreferences("AudioRent", MODE_PRIVATE)
        val token = "Bearer ${prefs.getString("TOKEN", "")}"

        val namePart = name.toRequestBody("text/plain".toMediaTypeOrNull())
        val descPart = desc.toRequestBody("text/plain".toMediaTypeOrNull())
        val pricePart = price.toRequestBody("text/plain".toMediaTypeOrNull())
        val quantityPart = quantity.toRequestBody("text/plain".toMediaTypeOrNull())
        val categoryPart = category.toRequestBody("text/plain".toMediaTypeOrNull())

        val imageParts = selectedImages.mapNotNull { uri ->
            val file = getFileFromUri(uri)
            if (file != null) {
                val requestFile = file.asRequestBody("image/*".toMediaTypeOrNull())
                MultipartBody.Part.createFormData("images", file.name, requestFile)
            } else null
        }

        RetrofitClient.instance.createProviderPackage(token, namePart, descPart, pricePart, quantityPart, categoryPart, imageParts)
            .enqueue(object : Callback<PackageResponse> {
                override fun onResponse(call: Call<PackageResponse>, response: Response<PackageResponse>) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@AddPackageActivity, "Listing Published!", Toast.LENGTH_SHORT).show()
                        finish()
                    } else {
                        Toast.makeText(this@AddPackageActivity, "Failed: ${response.message()}", Toast.LENGTH_SHORT).show()
                    }
                }
                override fun onFailure(call: Call<PackageResponse>, t: Throwable) {
                    Toast.makeText(this@AddPackageActivity, "Network Error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun getFileFromUri(uri: Uri): File? {
        try {
            val inputStream = contentResolver.openInputStream(uri) ?: return null
            val file = File(cacheDir, "upload_${System.currentTimeMillis()}.jpg")
            val outputStream = FileOutputStream(file)
            inputStream.copyTo(outputStream)
            outputStream.close()
            inputStream.close()
            return file
        } catch (e: Exception) {
            return null
        }
    }
}
