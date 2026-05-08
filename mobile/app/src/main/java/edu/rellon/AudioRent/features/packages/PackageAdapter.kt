package edu.rellon.audiorent.features.packages

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import edu.rellon.audiorent.R
import edu.rellon.audiorent.common.api.PackageResponse

class PackageAdapter(
    private val packages: List<PackageResponse>,
    private val onItemClick: (PackageResponse) -> Unit
) : RecyclerView.Adapter<PackageAdapter.PackageViewHolder>() {

    class PackageViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val imageView: ImageView = view.findViewById(R.id.packageImage)
        val nameText: TextView = view.findViewById(R.id.packageName)
        val priceText: TextView = view.findViewById(R.id.packagePrice)
        val categoryText: TextView = view.findViewById(R.id.packageCategory)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PackageViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_package, parent, false)
        return PackageViewHolder(view)
    }

    override fun onBindViewHolder(holder: PackageViewHolder, position: Int) {
        val pkg = packages[position]
        holder.nameText.text = pkg.name
        holder.priceText.text = "₱${pkg.price} / day"
        holder.categoryText.text = pkg.category

        if (pkg.imageUrls.isNotEmpty()) {
            Glide.with(holder.itemView.context)
                .load(pkg.imageUrls[0])
                .placeholder(R.drawable.ic_launcher_background)
                .into(holder.imageView)
        }

        holder.itemView.setOnClickListener { onItemClick(pkg) }
    }

    override fun getItemCount() = packages.size
}
