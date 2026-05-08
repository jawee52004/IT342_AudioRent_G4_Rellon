package edu.rellon.audiorent.features.auth

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import edu.rellon.audiorent.R
import edu.rellon.audiorent.common.api.UserResponse

class AdminUserAdapter(
    private val users: List<UserResponse>,
    private val onDeactivate: (String) -> Unit
) : RecyclerView.Adapter<AdminUserAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val name: TextView = view.findViewById(R.id.userName)
        val email: TextView = view.findViewById(R.id.userEmail)
        val role: TextView = view.findViewById(R.id.userRole)
        val deactivateBtn: Button = view.findViewById(R.id.deactivateButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_admin_user, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val user = users[position]
        holder.name.text = user.fullName
        holder.email.text = user.email
        holder.role.text = user.role
        holder.deactivateBtn.setOnClickListener { onDeactivate(user.id ?: "") }
    }

    override fun getItemCount() = users.size
}
