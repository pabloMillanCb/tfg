package com.example.arview

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView


class SceneRecyclerViewAdapter(var context: Context, var listaEscenas:ArrayList<SceneParameters>):
    RecyclerView.Adapter<SceneRecyclerViewAdapter.MiHolder>() {

    inner class MiHolder(itemView: View):RecyclerView.ViewHolder(itemView){
        lateinit var nombreEscena: TextView
        lateinit var tipoEscena: TextView
        lateinit var boton: Button

        init {
            nombreEscena = itemView.findViewById(R.id.tituloEscena)
            tipoEscena = itemView.findViewById(R.id.tipoEscena)
            boton = itemView.findViewById(R.id.botonIniciarEscena)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MiHolder {
        var itemView = LayoutInflater.from(context).inflate(R.layout.recycler_view_row, parent, false)
        return MiHolder(itemView)
    }

    override fun getItemCount(): Int {
        return listaEscenas.size
    }

    fun update(sceneList: ArrayList<SceneParameters>) {
        listaEscenas = sceneList
        // replace your adapter data with argument data
        this.notifyDataSetChanged()
    }

    override fun onBindViewHolder(holder: MiHolder, position: Int) {
        var escena = listaEscenas[position]
        holder.nombreEscena.text = escena.name
        if (escena.scene_type == "augmented_images") { holder.tipoEscena.text = "Marcador" }
        if (escena.scene_type == "ground") { holder.tipoEscena.text = "Superficie" }
        if (escena.scene_type == "geospatial") { holder.tipoEscena.text = "Geoespacial" }

        holder.boton.setOnClickListener {
            val intent = Intent(context, ArActivity::class.java)
            intent.putExtra("parameters", escena)
            context.startActivity(intent)
        }
    }

}