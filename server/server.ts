import express from "express";
import pgPromise from "pg-promise";
import dotenv from "dotenv";
import cors from "cors"; // حل مشكلة CORS

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// تفعيل استقبال البيانات بصيغة JSON
app.use(express.json());

// حل مشكلة CORS
app.use(cors());

// إعداد قاعدة البيانات
const pgp = pgPromise();
const db = pgp(process.env.DATABASE_URL);

// التحقق من الاتصال بقاعدة البيانات
db.connect()
  .then((obj) => {
    obj.done(); // إغلاق الاتصال بعد نجاحه
    console.log("✅ Connected to the database successfully!");
  })
  .catch((error) => {
    console.error("❌ Database connection error:", error);
  });

// الراوت الأساسي
app.get("/", (req, res) => {
  res.send("ShiNenHealthManager API is running...");
});

// راوت جلب المرضى
app.get("/patients", async (req, res) => {
  try {
    const patients = await db.any("SELECT * FROM patients");
    res.json(patients);
  } catch (error) {
    console.error("❌ Error fetching patients:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// راوت لإضافة مريض جديد
app.post("/patients", async (req, res) => {
  const { name, age, diagnosis } = req.body;
  if (!name || !age || !diagnosis) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newPatient = await db.one(
      "INSERT INTO patients (name, age, diagnosis) VALUES ($1, $2, $3) RETURNING *",
      [name, age, diagnosis]
    );
    res.status(201).json(newPatient);
  } catch (error) {
    console.error("❌ Error adding patient:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// تشغيل السيرفر
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
