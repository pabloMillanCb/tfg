package com.example.arview

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class SceneRecyclerViewAdapter(var context: Context, var listaEscenas:ArrayList<SceneParameters>):
    RecyclerView.Adapter<SceneRecyclerViewAdapter.MiHolder>() {

    inner class MiHolder(itemView: View):RecyclerView.ViewHolder(itemView){
        lateinit var nombreEscena: TextView
        lateinit var tipoEscena: TextView

        init {
            nombreEscena = itemView.findViewById(R.id.tituloEscena)
            tipoEscena = itemView.findViewById(R.id.tipoEscena)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MiHolder {
        var itemView = LayoutInflater.from(context).inflate(R.layout.recycler_view_row, parent, false)
        return MiHolder(itemView)
    }

    override fun getItemCount(): Int {
        return listaEscenas.size
    }

    override fun onBindViewHolder(holder: MiHolder, position: Int) {
        var escena = listaEscenas[position]
        holder.nombreEscena.text = escena.name
        holder.tipoEscena.text = "Marcador"
    }

}