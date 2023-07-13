package com.example.arview

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.core.view.isGone
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.arview.databinding.ActivitySceneSelectBinding
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.google.gson.Gson
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import okhttp3.OkHttpClient
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory


class SceneSelect : AppCompatActivity() {

    private lateinit var binding:ActivitySceneSelectBinding
    private lateinit var adapter:SceneRecyclerViewAdapter

    private var listaEscenas:ArrayList<SceneParameters> = ArrayList<SceneParameters>()

    lateinit var loadingView: View
    var isLoading = false
        set(value) {
            field = value
            loadingView.isGone = !value
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySceneSelectBinding.inflate(layoutInflater)
        setContentView(binding.root)
        loadingView = findViewById(R.id.loadingView)
        isLoading = true

        findViewById<TextView>(R.id.welcomeUser).text = Firebase.auth.currentUser?.email

        findViewById<Button>(R.id.logoutButton).setOnClickListener {
            Firebase.auth.signOut()
            val myIntent = Intent(this, MainActivity::class.java)
            startActivity(myIntent)
        }

        var recyclerview = findViewById<RecyclerView>(R.id.recyclerViewEscenas)
        adapter = SceneRecyclerViewAdapter(this, listaEscenas)
        recyclerview.layoutManager = LinearLayoutManager(this)
        recyclerview.adapter = adapter

        getScenesFromUser(Firebase.auth.currentUser!!)
    }

    private suspend fun getRetrofit(token: String): Retrofit {
        return Retrofit.Builder()
            .baseUrl(SERVER_URL + "/get/escenas/")
            .addConverterFactory(GsonConverterFactory.create())
            .client(getClient(token))
            .build()
    }

    private suspend fun getClient(token: String): OkHttpClient =
        OkHttpClient.Builder()
            .addInterceptor(HeaderInterceptor(token))
            .build()

    private fun getScenesFromUser(user: FirebaseUser) {
        Firebase.auth.currentUser?.getIdToken(true)?.addOnSuccessListener{
            lifecycleScope.launch {
                val sceneList = getRetrofit(it.token!!).create(ApiService::class.java).getScenesFromUser(user.uid)
                for (scene in sceneList){
                    listaEscenas.add(scene)
                    Log.d("get", scene.toString())
                }
                adapter.update(listaEscenas)
                isLoading = false
            }
        }
    }
}