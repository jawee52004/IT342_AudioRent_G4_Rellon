package edu.rellon.audiorent.features.auth

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import edu.rellon.audiorent.R
import edu.rellon.audiorent.common.api.PackageResponse

class AdminPackageAdapter(
    private val packages: List<PackageResponse>,
    private val onDelete: (String) -> Unit
) : RecyclerView.Adapter<AdminPackageAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val name: TextView = view.findViewById(R.id.packageName)
        val provider: TextView = view.findViewById(R.id.providerName)
        val deleteBtn: Button = view.findViewById(R.id.deleteButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_admin_package, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val pkg = packages[position]
        holder.name.text = pkg.name
        holder.provider.text = "by ${pkg.providerName}"
        holder.deleteBtn.setOnClickListener { onDelete(pkg.id) }
    }

    override fun getItemCount() = packages.size
}
