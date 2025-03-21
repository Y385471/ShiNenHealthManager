import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  loginSchema,
  insertUserSchema,
  insertPatientSchema,
  insertAppointmentSchema,
  insertInventoryItemSchema,
  insertServiceSchema,
  insertTreatmentPlanSchema,
  insertFinancialTransactionSchema,
  insertInventoryConsumptionSchema,
  insertWhatsappMessageSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up express session
  app.use(
    session({
      cookie: {
        maxAge: 86400000, // 1 day
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "shinenwhite-clinic-secret",
    })
  );

  // Authentication middleware
  const authenticate = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Check if user has required role
  const checkRole = (roles: string[]) => {
    return async (req: any, res: any, next: any) => {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    };
  };

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(data.username);

      if (!user || user.password !== data.password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Store user data in session
      req.session.userId = user.id;
      req.session.userRole = user.role;

      res.json({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    });
  });

  // User routes
  app.get("/api/users", authenticate, checkRole(["manager"]), async (req, res) => {
    const users = await storage.getUsers();
    res.json(users.map(user => ({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      phoneNumber: user.phoneNumber,
      email: user.email
    })));
  });

  app.get("/api/users/doctors", authenticate, async (req, res) => {
    const doctors = await storage.getUsersByRole("doctor");
    res.json(doctors.map(doctor => ({
      id: doctor.id,
      username: doctor.username,
      fullName: doctor.fullName,
      phoneNumber: doctor.phoneNumber,
      email: doctor.email
    })));
  });

  app.post("/api/users", authenticate, checkRole(["manager"]), async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const user = await storage.createUser(data);
      res.status(201).json({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        phoneNumber: user.phoneNumber,
        email: user.email
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Patient routes
  app.get("/api/patients", authenticate, async (req, res) => {
    const patients = await storage.getPatients();
    res.json(patients);
  });

  app.get("/api/patients/search", authenticate, async (req, res) => {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const patients = await storage.searchPatients(query);
    res.json(patients);
  });

  app.get("/api/patients/:id", authenticate, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const patient = await storage.getPatient(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  });

  app.post("/api/patients", authenticate, async (req, res) => {
    try {
      const data = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(data);
      res.status(201).json(patient);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/patients/:id", authenticate, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      // Partial validation without requiring all fields
      const data = insertPatientSchema.partial().parse(req.body);
      const patient = await storage.updatePatient(id, data);
      
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      res.json(patient);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Appointment routes
  app.get("/api/appointments", authenticate, async (req, res) => {
    const appointments = await storage.getAppointments();
    res.json(appointments);
  });

  app.get("/api/appointments/today", authenticate, async (req, res) => {
    const today = new Date();
    const appointments = await storage.getAppointmentsByDate(today);
    
    // Get additional data needed for the dashboard
    const patientsMap = new Map();
    const doctorsMap = new Map();
    const servicesMap = new Map();
    
    for (const appt of appointments) {
      if (!patientsMap.has(appt.patientId)) {
        const patient = await storage.getPatient(appt.patientId);
        if (patient) {
          patientsMap.set(appt.patientId, patient);
        }
      }
      
      if (!doctorsMap.has(appt.doctorId)) {
        const doctor = await storage.getUser(appt.doctorId);
        if (doctor) {
          doctorsMap.set(appt.doctorId, doctor);
        }
      }
      
      if (appt.serviceId && !servicesMap.has(appt.serviceId)) {
        const service = await storage.getService(appt.serviceId);
        if (service) {
          servicesMap.set(appt.serviceId, service);
        }
      }
    }
    
    const result = appointments.map(appt => ({
      ...appt,
      patient: patientsMap.get(appt.patientId),
      doctor: doctorsMap.get(appt.doctorId) ? {
        id: doctorsMap.get(appt.doctorId).id,
        fullName: doctorsMap.get(appt.doctorId).fullName
      } : null,
      service: servicesMap.get(appt.serviceId) ? {
        id: servicesMap.get(appt.serviceId).id,
        name: servicesMap.get(appt.serviceId).name
      } : null
    }));
    
    res.json(result);
  });

  app.get("/api/appointments/doctor/:id", authenticate, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    const appointments = await storage.getAppointmentsByDoctor(id);
    res.json(appointments);
  });

  app.get("/api/appointments/patient/:id", authenticate, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }

    const appointments = await storage.getAppointmentsByPatient(id);
    res.json(appointments);
  });

  app.post("/api/appointments", authenticate, async (req, res) => {
    try {
      const data = insertAppointmentSchema.parse({
        ...req.body,
        createdBy: req.session.userId
      });
      const appointment = await storage.createAppointment(data);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/appointments/:id", authenticate, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      const data = insertAppointmentSchema.partial().parse(req.body);
      const appointment = await storage.updateAppointment(id, data);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.json(appointment);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Service routes
  app.get("/api/services", authenticate, async (req, res) => {
    const services = await storage.getServices();
    res.json(services);
  });

  app.post("/api/services", authenticate, checkRole(["manager"]), async (req, res) => {
    try {
      const data = insertServiceSchema.parse(req.body);
      const service = await storage.createService(data);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Inventory routes
  app.get("/api/inventory", authenticate, async (req, res) => {
    const items = await storage.getInventoryItems();
    res.json(items);
  });

  app.get("/api/inventory/low-stock", authenticate, async (req, res) => {
    const items = await storage.getLowStockItems();
    res.json(items);
  });

  app.post("/api/inventory", authenticate, checkRole(["manager", "secretary"]), async (req, res) => {
    try {
      const data = insertInventoryItemSchema.parse(req.body);
      const item = await storage.createInventoryItem(data);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/inventory/:id", authenticate, checkRole(["manager", "secretary"]), async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      const data = insertInventoryItemSchema.partial().parse(req.body);
      const item = await storage.updateInventoryItem(id, data);
      
      if (!item) {
        return res.status(404).json({ message: "Inventory item not found" });
      }

      res.json(item);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/inventory/consumption", authenticate, checkRole(["doctor", "nurse"]), async (req, res) => {
    try {
      const data = insertInventoryConsumptionSchema.parse({
        ...req.body,
        usedBy: req.session.userId
      });
      const consumption = await storage.createInventoryConsumption(data);
      res.status(201).json(consumption);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Treatment plan routes
  app.get("/api/treatment-plans/patient/:id", authenticate, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }

    const plans = await storage.getTreatmentPlansByPatient(id);
    res.json(plans);
  });

  app.post("/api/treatment-plans", authenticate, checkRole(["manager", "doctor"]), async (req, res) => {
    try {
      const data = insertTreatmentPlanSchema.parse(req.body);
      const plan = await storage.createTreatmentPlan(data);
      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/treatment-plans/:id", authenticate, checkRole(["manager", "doctor"]), async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      const data = insertTreatmentPlanSchema.partial().parse(req.body);
      const plan = await storage.updateTreatmentPlan(id, data);
      
      if (!plan) {
        return res.status(404).json({ message: "Treatment plan not found" });
      }

      res.json(plan);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Financial routes
  app.get("/api/finances", authenticate, checkRole(["manager", "secretary"]), async (req, res) => {
    const transactions = await storage.getFinancialTransactions();
    res.json(transactions);
  });

  app.get("/api/finances/patient/:id", authenticate, checkRole(["manager", "secretary"]), async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }

    const transactions = await storage.getFinancialTransactionsByPatient(id);
    res.json(transactions);
  });

  app.post("/api/finances", authenticate, checkRole(["manager", "secretary"]), async (req, res) => {
    try {
      const data = insertFinancialTransactionSchema.parse({
        ...req.body,
        createdBy: req.session.userId
      });
      const transaction = await storage.createFinancialTransaction(data);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // WhatsApp routes
  app.get("/api/whatsapp/messages", authenticate, checkRole(["manager", "secretary"]), async (req, res) => {
    const messages = await storage.getWhatsappMessages();
    
    // Get patient names
    const patientsMap = new Map();
    for (const msg of messages) {
      if (msg.patientId && !patientsMap.has(msg.patientId)) {
        const patient = await storage.getPatient(msg.patientId);
        if (patient) {
          patientsMap.set(msg.patientId, patient);
        }
      }
    }
    
    const result = messages.map(msg => ({
      ...msg,
      patient: msg.patientId ? {
        id: patientsMap.get(msg.patientId)?.id,
        fullName: patientsMap.get(msg.patientId)?.fullName,
        phoneNumber: patientsMap.get(msg.patientId)?.phoneNumber
      } : null
    }));
    
    res.json(result);
  });

  app.post("/api/whatsapp/send", authenticate, checkRole(["manager", "secretary"]), async (req, res) => {
    try {
      const data = insertWhatsappMessageSchema.parse({
        ...req.body,
        sentBy: req.session.userId
      });
      
      // In a real app, you would integrate with WhatsApp API here
      
      const message = await storage.createWhatsappMessage(data);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Analytics and KPI routes
  app.get("/api/analytics/revenue", authenticate, checkRole(["manager"]), async (req, res) => {
    const data = await storage.getMonthlyRevenue();
    res.json(data);
  });

  app.get("/api/analytics/patient-growth", authenticate, checkRole(["manager"]), async (req, res) => {
    const data = await storage.getPatientGrowth();
    res.json(data);
  });

  app.get("/api/analytics/appointment-stats", authenticate, checkRole(["manager"]), async (req, res) => {
    const data = await storage.getAppointmentStatusStats();
    res.json(data);
  });

  app.get("/api/analytics/inventory-consumption", authenticate, checkRole(["manager"]), async (req, res) => {
    const data = await storage.getInventoryConsumptionStats();
    res.json(data);
  });

  app.get("/api/analytics/dashboard", authenticate, async (req, res) => {
    // Get today's appointments count
    const today = new Date();
    const appointments = await storage.getAppointmentsByDate(today);
    
    // Get new patients this month
    const patients = await storage.getPatients();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const newPatientsThisMonth = patients.filter(p => {
      const patientDate = new Date(p.createdAt);
      return patientDate.getMonth() === currentMonth && patientDate.getFullYear() === currentYear;
    }).length;
    
    // Get low stock items
    const lowStockItems = await storage.getLowStockItems();
    
    // Get monthly revenue
    const transactions = await storage.getFinancialTransactions();
    const currentMonthTransactions = transactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear && t.type === 'income';
    });
    
    const monthlyRevenue = currentMonthTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
    
    res.json({
      appointmentsToday: appointments.length,
      newPatientsThisMonth,
      lowStockItems: lowStockItems.length,
      monthlyRevenue
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
