package com.example.arview

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val user = Firebase.auth.currentUser

        // Si el usuario está logeado acceder a la lista de escenas
        if (user != null)
        {
            val myIntent = Intent(this, SceneSelect::class.java)
            startActivity(myIntent)
        }
        // En caso contrario iniciar la sesión
        else
        {
            val myIntent = Intent(this, LoginActivity::class.java)
            startActivity(myIntent)
        }
    }

    override fun onResume() {
        super.onResume()

        val user = Firebase.auth.currentUser

        // Si el usuario está logeado acceder a la lista de escenas
        if (user != null)
        {
            val myIntent = Intent(this, SceneSelect::class.java)
            startActivity(myIntent)
        }
        // En caso contrario iniciar la sesión
        else
        {
            val myIntent = Intent(this, LoginActivity::class.java)
            startActivity(myIntent)
        }
    }
}