package com.example.arview

import android.content.ContentValues.TAG
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase

class LoginActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login_singin)

        findViewById<Button>(R.id.singinButton2)
            .setOnClickListener {
                Firebase.auth.signInWithEmailAndPassword(findViewById<EditText>(R.id.username).text.toString(), findViewById<EditText>(R.id.password).text.toString())
                    .addOnCompleteListener(this) { task ->
                        if (task.isSuccessful) {
                            // Sign in success, update UI with the signed-in user's information
                            Log.d(TAG, "signInWithEmail:success")
                            Toast.makeText(
                                baseContext,
                                "Sesión iniciada.",
                                Toast.LENGTH_SHORT,
                            ).show()
                            val myIntent = Intent(this, MainActivity::class.java)
                            startActivity(myIntent)
                        } else {
                            // If sign in fails, display a message to the user.
                            Log.w(TAG, "signInWithEmail:failure", task.exception)
                            Toast.makeText(
                                baseContext,
                                "Usuario incorrecto.",
                                Toast.LENGTH_SHORT,
                            ).show()
                            //updateUI(null)
                        }
                    }
            }

    }

    public override fun onStart() {
        super.onStart()
        // Check if user is signed in (non-null) and update UI accordingly.
        //val currentUser = auth.currentUser
        //if (currentUser != null) {
            //reload()
        //}
    }

    private fun checkPasswords(pass1: String, pass2: String): Boolean {
        return (pass1 == pass2) and (pass1.length >= 6)
    }



}