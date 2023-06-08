package com.example.arview

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.media.MediaPlayer
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.view.ViewGroup
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.core.view.isGone
import androidx.core.view.isVisible
import com.google.android.gms.auth.api.signin.internal.Storage
import com.google.android.gms.tasks.Task
import com.google.android.gms.tasks.Tasks
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton
import com.google.ar.core.Anchor
import com.google.ar.core.AugmentedImage
import com.google.ar.core.AugmentedImageDatabase
import com.google.ar.core.Config
import com.google.ar.core.TrackingState
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageReference
import com.google.gson.Gson
import io.github.sceneview.ar.ArSceneView
import io.github.sceneview.ar.arcore.ArSession
import io.github.sceneview.ar.arcore.createAnchor
import io.github.sceneview.ar.arcore.isTracking
import io.github.sceneview.ar.node.ArModelNode
import io.github.sceneview.ar.node.PlacementMode
import io.github.sceneview.math.Position
import io.github.sceneview.math.Rotation
import io.github.sceneview.utils.doOnApplyWindowInsets
import io.github.sceneview.utils.setFullScreen
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL

class ArActivity : AppCompatActivity()
{
    lateinit var placeModelButton: ExtendedFloatingActionButton
    lateinit var newModelButton: ExtendedFloatingActionButton

    lateinit var sceneView: ArSceneView
    lateinit var loadingView: View
    lateinit var parameters: SceneParameters
    var audio: MediaPlayer? = null
    var playedAnimations :Boolean = false
    lateinit var imageBitmap: Bitmap

    lateinit var urlImagen : String

    var modelNode = ArrayList<ArModelNode>()
    var modelNodeGround : ArModelNode? = null
    var modelIndex = 0

    lateinit var storageRef: StorageReference

    var isLoading = false
        set(value) {
            field = value
            loadingView.isGone = !value
        }

    var gson = Gson()

    var posicionFijada: Boolean = false

    override fun onCreate(savedInstanceState: Bundle?)
    {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_ar)

        // Inicializamos Google Firebase
        val firebase = FirebaseStorage.getInstance()
        storageRef = firebase.reference

        setFullScreen(
            findViewById(R.id.rootView),
            fullScreen = true,
            hideSystemBars = false,
            fitsSystemWindows = false
        )

        // Cargamos elementos de la UI
        sceneView = findViewById(R.id.sceneView)
        loadingView = findViewById(R.id.loadingView)
        newModelButton = findViewById<ExtendedFloatingActionButton>(R.id.newModelButton).apply {
            // Add system bar margins
            val bottomMargin = (layoutParams as ViewGroup.MarginLayoutParams).bottomMargin
            doOnApplyWindowInsets { systemBarsInsets ->
                (layoutParams as ViewGroup.MarginLayoutParams).bottomMargin =
                    systemBarsInsets.bottom + bottomMargin
            }
            setOnClickListener { createModelNodeGround() }
        }
        placeModelButton = findViewById<ExtendedFloatingActionButton>(R.id.placeModelButton).apply {
            setOnClickListener { placeModelNodeGround() }
        }
        newModelButton.isVisible = false
        placeModelButton.isVisible = false

        val jsonData = applicationContext.resources.openRawResource(
            applicationContext.resources.getIdentifier(
                "escena_test",
                "raw", applicationContext.packageName
            )
        ).bufferedReader().use{it.readText()}
        parameters = gson.fromJson(jsonData, SceneParameters::class.java )

        isLoading = true

        storageRef.child(parameters.image_url).downloadUrl.addOnSuccessListener { documents ->
            urlImagen = documents.toString()
            setUpScene()}
            .addOnFailureListener { Log.d("firebase", "Fracaso") }
    }

    fun setUpScene()
    {
        if (parameters.sound != "")
        {
            storageRef.child(parameters.sound).downloadUrl.addOnSuccessListener { documents ->
                var urlAudio = documents.toString()
                audio = MediaPlayer.create(this, Uri.parse(parameters.sound))
                // Se activa la reproducción automática de audios al finalizar si el contenido loopea
                if (parameters.loop == true) {
                    audio!!.setOnCompletionListener {
                        audio!!.start()
                    }
                }
                }
                .addOnFailureListener { Log.d("firebase", "Fracaso") }
        }

        if (parameters.type == "augmented_images")
        {
            loadImage(urlImagen)
            createModelNodes(true)
            sceneView.instructions.searchPlaneInfoNode.isVisible = false

            // Sceneview config
            newModelButton.isVisible = false
            placeModelButton.isVisible = false
            sceneView.configureSession(this::initialiseSceneViewSession)
            sceneView.planeFindingMode = Config.PlaneFindingMode.DISABLED
            sceneView.onAugmentedImageUpdate += this::checkAugmentedImageUpdate
            sceneView.planeRenderer.isVisible=false
            sceneView.planeRenderer.isShadowReceiver=false
        }
        else if (parameters.type == "ground")
        {
            // Esta funcion debe ejecutarse una vez al principio antes de poder colocar nodos
            placeModelNodeGround();

            // Texto que aparece cuando se busca un plano en AugmentedGround
            sceneView.apply {
                onArFrame = {
                    sceneView.instructions.searchPlaneInfoNode.textView?.text = "Buscando una superficie..."
                }
            }
        }
        else if (parameters.type == "geospatial")
        {
            Log.d("Geo", "Modo geospacial")
            askLocationPermissions()
            var locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
            val gpsLocationListener: LocationListener = object : LocationListener {
                override fun onLocationChanged(location: Location) {
                    var locationByGps = location
                }

                override fun onStatusChanged(provider: String, status: Int, extras: Bundle) {}
                override fun onProviderEnabled(provider: String) {}
                override fun onProviderDisabled(provider: String) {}
            }

            sceneView.planeFindingMode = Config.PlaneFindingMode.DISABLED
            newModelButton.isVisible = false
            placeModelButton.isVisible = false
            sceneView.cameraNode.farClipPlane = 10000000000.0f

            sceneView.onArSessionCreated = {
                Log.d("Geo", "Creando sesion")
                sceneView.geospatialEnabled=true
                sceneView.configureSession(this::initialiseSceneViewSession)
                createModelNodes(false)
            }

            // En cada frame comprueba si se ha podido crear los nodos y si no, intentalo de nuevo
            sceneView.onArFrame = {

                if (sceneView.arSession?.earth?.trackingState == TrackingState.TRACKING && !posicionFijada){
                    Log.d("Geo", "OnArFrame")
                    createNodesGeospatial()
                }
            }
        }
    }
    fun createModelNodes(poseRotation: Boolean)
    {
        Log.d("Geo", "Creando nodos")
        for (model in parameters.models) {

            /*isLoading = true
            if(modelNode?.size!! > i) {
                modelNode?.get(i)?.takeIf { !it.isAnchored }?.let {
                    sceneView.removeChild(it)
                    it.destroy()
                }
            }*/
            var urlModel = ""
            storageRef.child(model.model_url).downloadUrl.addOnSuccessListener { documents ->
                urlModel = documents.toString()

                modelNode.add( ArModelNode(PlacementMode.PLANE_VERTICAL).apply {
                    applyPoseRotation = false
                    loadModelGlbAsync(
                        context = this@ArActivity,
                        lifecycle = lifecycle,
                        glbFileLocation = urlModel,
                        autoAnimate = false,
                        scaleToUnits = model.scale,
                        // Place the model origin at the bottom center
                        centerOrigin = Position(model.position[0], model.position[1], model.position[2])
                    ) {
                        sceneView.planeRenderer.isVisible = false
                        isLoading = false
                    }

                    modelRotation = Rotation(model.rotation[0], model.rotation[1], model.rotation[2])
                })
            }
                .addOnFailureListener { Log.d("firebase", "Fracaso") }
        }
    }

    private fun createModelNodeGround()
    {
        isLoading = true
        modelNodeGround?.takeIf { !it.isAnchored }?.let {
            sceneView.removeChild(it)
            it.destroy()
        }

        val model = parameters.models[modelIndex]
        modelIndex = modelIndex + 1
        if (modelIndex == parameters.models.size){
            newModelButton.isVisible = false
        }

        var urlModel = ""
        storageRef.child(model.model_url).downloadUrl.addOnSuccessListener { documents ->
            urlModel = documents.toString()

            modelNodeGround = ArModelNode(PlacementMode.BEST_AVAILABLE).apply {
                applyPoseRotation = false
                loadModelGlbAsync(
                    context = this@ArActivity,
                    lifecycle = lifecycle,
                    glbFileLocation = model.model_url,
                    autoAnimate = false,
                    scaleToUnits = model.scale,
                    centerOrigin = Position(model.position[0], model.position[1], model.position[2])
                ) {
                    sceneView.planeRenderer.isVisible = true
                    isLoading = false
                }
                onAnchorChanged = { node, _ ->
                    placeModelButton.isGone = node.isAnchored
                }
                onHitResult = { node, _ ->
                    placeModelButton.isGone = !node.isTracking
                }
            }
            sceneView.addChild(modelNodeGround!!)
            // Select the model node by default (the model node is also selected on tap)
            sceneView.selectedNode = modelNodeGround
        }
            .addOnFailureListener { Log.d("firebase", "Fracaso") }
    }

    fun createNodesGeospatial()
    {
        lateinit var earthAnchor : Anchor
        Log.d("Geo", "Create geospatial")
        for (model in modelNode) {
            var earth = sceneView.arSession?.earth ?: return
            Log.d("Geo", earth.trackingState.toString())
            if (earth.trackingState == TrackingState.TRACKING) {

                val latitude = parameters.coordinates[0]
                val longitude = parameters.coordinates[1]
                val altitude = parameters.coordinates[2]
                earthAnchor = earth.createAnchor(latitude, longitude, altitude, Rotation())
                Log.d("Geo", "Latitud $latitude Longitud $longitude altitud $altitude")
            }

            model.anchor=earthAnchor
            sceneView.addChild(model)
        }
        posicionFijada=true

        audio?.let {
            if (!audio!!.isPlaying){
                audio!!.start()
            }
        }


    }

    fun placeModelNodeGround()
    {
        modelNodeGround?.anchor()
        placeModelButton.isVisible = false
        sceneView.planeRenderer.isVisible = false
        //modelNode.remove(modelNode[0])


        audio?.let {
            if (!audio!!.isPlaying){
                audio!!.start()
            }
        }
    }

    private fun initialiseSceneViewSession(session: ArSession, config: Config)
    {

        if (parameters.type == "augmented_images") {
            val imageDatabase = AugmentedImageDatabase(session)
            val imageWidthInMeters = 0.10f // 10 cm
            imageDatabase.addImage("marcador", imageBitmap, imageWidthInMeters)
            config.augmentedImageDatabase = imageDatabase
        }
        session.configure(config)
    }

    private fun checkAugmentedImageUpdate(augmentedImage: AugmentedImage)
    {
        sceneView.instructions.searchPlaneInfoNode.isVisible = false

        // Reproduce audio asociado si procede

        audio?.let {
            if (!audio!!.isPlaying){
                audio!!.start()
            }
        }


        if (!playedAnimations)
        {
            Log.d("Debug", "Dentro de played animations")
            for (model in modelNode)
            {
                Log.d("Debug", "Dentro de played animations")
                val count = model.animator?.animationCount ?: 0
                if (count > 0) {
                    model.playAnimation("Dance", parameters.loop)
                    model.playAnimation("animation_0", parameters.loop)
                }
                //model.playAnimation("name", parameters.loop)
            }
            playedAnimations = true
        }

        /*
        // Reproduce la animación del modelo en caso de tener
        if (playedAnimations[augmentedImage.index] == false) {
            Log.d("Debug", augmentedImage.index.toString())
            Log.d("Debug", modelNode.size.toString())
            var count = modelNode[augmentedImage.index].animator?.animationCount ?: 0
            if (count > 0) {
                modelNode[augmentedImage.index].playAnimation(0, loop[augmentedImage.index])
            }
            playedAnimations[augmentedImage.index] = true
        }
         */

        // Ajusta el modelo a la imagen si está siendo trackeada
        if(augmentedImage.isTracking) {
            val anchorImage = augmentedImage.createAnchor(augmentedImage.centerPose)
            for (model in modelNode) {
                model.anchor = anchorImage
                sceneView.addChild(model)
            }
        }
    }

    private fun loadImage(url: String) = runBlocking {
        launch {
            imageBitmap = withContext(Dispatchers.IO) { getBitmapFromURL(url)!! }
        }
    }

    suspend fun getBitmapFromURL(src: String?): Bitmap?
    {

        if (lifecycle != null) {
            val url = URL(src)
            val connection: HttpURLConnection = url
                .openConnection() as HttpURLConnection
            connection.setDoInput(true)
            connection.connect()
            val input: InputStream = connection.getInputStream()
            return BitmapFactory.decodeStream(input)
        }
        else {
            return getBitmapFromURL(src)
        }
    }

    private fun askLocationPermissions()
    {
        val locationPermissionRequest = registerForActivityResult(
            ActivityResultContracts.RequestMultiplePermissions()
        ) { permissions ->
            when {
                permissions.getOrDefault(Manifest.permission.ACCESS_FINE_LOCATION, false) -> {
                    // Precise location access granted.
                }
                permissions.getOrDefault(Manifest.permission.ACCESS_COARSE_LOCATION, false) -> {
                    // Only approximate location access granted.
                } else -> {
                // No location access granted.
            }
            }
        }
        when {
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED -> {
                Log.d("Geo","YA TENGO LOS PERMISOS")
            }
            else -> {
                locationPermissionRequest.launch(arrayOf( Manifest.permission.ACCESS_COARSE_LOCATION,
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.CAMERA))
            }
        }
    }
}