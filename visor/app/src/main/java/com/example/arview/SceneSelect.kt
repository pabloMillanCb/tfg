package com.example.arview

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.arview.databinding.ActivitySceneSelectBinding
import com.google.gson.Gson

class SceneSelect : AppCompatActivity() {

    private lateinit var binding:ActivitySceneSelectBinding
    private var listaEscenas:ArrayList<SceneParameters> = ArrayList<SceneParameters>()
    private lateinit var recyclerEscenas:RecyclerView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySceneSelectBinding.inflate(layoutInflater)
        setContentView(R.layout.activity_scene_select)

        // obtención de lista de escenas del usuario
        var gson = Gson()
        var jsonData = applicationContext.resources.openRawResource(
            applicationContext.resources.getIdentifier(
                "escena_test",
                "raw", applicationContext.packageName
            )
        ).bufferedReader().use{it.readText()}
        var parameters = gson.fromJson(jsonData, SceneParameters::class.java )
        listaEscenas.add(parameters)

        jsonData = applicationContext.resources.openRawResource(
            applicationContext.resources.getIdentifier(
                "escena_test_geo",
                "raw", applicationContext.packageName
            )
        ).bufferedReader().use{it.readText()}
        parameters = gson.fromJson(jsonData, SceneParameters::class.java )
        listaEscenas.add(parameters)

        jsonData = applicationContext.resources.openRawResource(
            applicationContext.resources.getIdentifier(
                "escena_test_suelo",
                "raw", applicationContext.packageName
            )
        ).bufferedReader().use{it.readText()}
        parameters = gson.fromJson(jsonData, SceneParameters::class.java )
        listaEscenas.add(parameters)

        var recyclerview = findViewById<RecyclerView>(R.id.recyclerViewEscenas)
        var adapter = SceneRecyclerViewAdapter(this, listaEscenas)

        recyclerview.layoutManager = LinearLayoutManager(this)
        recyclerview.adapter = adapter
    }

}