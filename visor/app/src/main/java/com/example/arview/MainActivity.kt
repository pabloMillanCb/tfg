package com.example.arview

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        findViewById<Button>(R.id.devButton)
            .setOnClickListener {
                val myIntent = Intent(this, ArActivity::class.java)
                startActivity(myIntent)
            }

        findViewById<Button>(R.id.selectButton)
            .setOnClickListener {
                val myIntent = Intent(this, SceneSelect::class.java)
                startActivity(myIntent)
            }
    }
}