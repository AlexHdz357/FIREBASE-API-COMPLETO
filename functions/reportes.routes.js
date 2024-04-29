const {Router} = require("express");
const admin = require("firebase-admin");
const router = Router();
const cors = require("cors");

const corsOptions = {
  origin: "https://fb-api-1fbee.web.app",
  optionsSuccessStatus: 200
};

router.use(cors(corsOptions));

module.exports = router;

admin.initializeApp({
  credential: admin.credential.cert("./permissions.json"),
  databaseURL: "http://fb-api-1fbee.firebaseio.com",
});

const db = admin.firestore();

router.post("/api/reportes", async (req, res) => {
  try {
    await db.collection("reportes")
        .add({
          nombreProducto: req.body.nombreProducto,
          idEmpleado: req.body.idEmpleado,
          prioridad: req.body.prioridad,
          descripcion: req.body.descripcion,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          imagenTexto: req.body.imagenTexto,
          aprobado: req.body.aprobado || 0,
          completado: req.body.completado || 0,
          fechaIngreso: new Date(),
        });
    return res.status(204).json();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});  
router.get("/api/reportes/:idReporte", async (req, res) => {
    (async () => {
      try {
        const doc = db.collection("reportes").doc(req.params.id);
        const item = await doc.get();
        const response = item.data();
        return res.status(200).json(response);
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    })();
  });
  
router.get("/api/reportes", async (req, res) => {
    try {
      const query = db.collection("reportes");
      const querySnapshot = await query.get();
      const docs = querySnapshot.docs;
      const response = docs.map((doc) => ({
        id: doc.id,
        nombreProducto: doc.data().nombreProducto,
        idEmpleado: doc.data().idEmpleado,
        prioridad: doc.data().prioridad,
        descripcion: doc.data().descripcion,
        latitude: doc.data().latitude,
        longitude: doc.data().longitude,
        imagenTexto: doc.data().imagenTexto,
        aprobado: doc.data().aprobado,
        completado: doc.data().completado,
        fecha: doc.data().fecha,
      }));
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json();
    }
  });
  
  
router.put("/api/reportes/:idReporte", async (req, res) => {
    const {id} = req.params;
    const {aprobado, completado} = req.body;
    try {
      const doc = db.collection("reportes").doc(id);
      const currentData = (await doc.get()).data() || {};
      const reporteActualizado = {
        ...currentData,
        ...(aprobado !== undefined && {aprobado}),
        ...(completado !== undefined && {completado}),
      };
      await doc.update(reporteActualizado);
      return res.status(200).json({idReporte, ...reporteActualizado});
    } catch (error) {
      return res.status(500).json({error: error.toString()});
    }
  });

  
router.post("/api/empleados", async (req, res) => {
  try {
    await db.collection("empleados")
        .doc("/" + req.body.id + "/")
        .create({
          NombreCompleto: req.body.NombreCompleto,
          Rol: req.body.Rol,
          Puntos: req.body.Puntos,
          fecha: new Date(),
        });
    return res.status(204).json();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

