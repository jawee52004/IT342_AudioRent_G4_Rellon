package edu.rellon.audiorent.features.rental

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import edu.rellon.audiorent.R
import edu.rellon.audiorent.common.api.RentalResponse

class RentalAdapter(private val rentals: List<RentalResponse>) :
    RecyclerView.Adapter<RentalAdapter.RentalViewHolder>() {

    class RentalViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val image: ImageView = view.findViewById(R.id.rentalImage)
        val name: TextView = view.findViewById(R.id.rentalPackageName)
        val dates: TextView = view.findViewById(R.id.rentalDates)
        val price: TextView = view.findViewById(R.id.rentalPrice)
        val status: TextView = view.findViewById(R.id.rentalStatus)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RentalViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_rental, parent, false)
        return RentalViewHolder(view)
    }

    override fun onBindViewHolder(holder: RentalViewHolder, position: Int) {
        val rental = rentals[position]
        holder.name.text = rental.packageName
        holder.dates.text = "${rental.startDate} - ${rental.endDate}"
        holder.price.text = "₱${rental.totalPrice}"
        holder.status.text = rental.status

        if (rental.status == "PENDING") {
            holder.status.setBackgroundResource(R.drawable.bg_status_pending)
        } else {
            holder.status.setBackgroundResource(R.drawable.bg_status_success)
        }

        Glide.with(holder.itemView.context)
            .load(rental.packageImageUrl)
            .placeholder(R.drawable.ic_launcher_background)
            .into(holder.image)
    }

    override fun getItemCount() = rentals.size
}
