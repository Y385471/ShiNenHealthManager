// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  patients;
  services;
  inventoryItems;
  appointments;
  treatmentPlans;
  financialTransactions;
  inventoryConsumption;
  whatsappMessages;
  userCurrentId;
  patientCurrentId;
  serviceCurrentId;
  inventoryItemCurrentId;
  appointmentCurrentId;
  treatmentPlanCurrentId;
  financialTransactionCurrentId;
  inventoryConsumptionCurrentId;
  whatsappMessageCurrentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.patients = /* @__PURE__ */ new Map();
    this.services = /* @__PURE__ */ new Map();
    this.inventoryItems = /* @__PURE__ */ new Map();
    this.appointments = /* @__PURE__ */ new Map();
    this.treatmentPlans = /* @__PURE__ */ new Map();
    this.financialTransactions = /* @__PURE__ */ new Map();
    this.inventoryConsumption = /* @__PURE__ */ new Map();
    this.whatsappMessages = /* @__PURE__ */ new Map();
    this.userCurrentId = 1;
    this.patientCurrentId = 1;
    this.serviceCurrentId = 1;
    this.inventoryItemCurrentId = 1;
    this.appointmentCurrentId = 1;
    this.treatmentPlanCurrentId = 1;
    this.financialTransactionCurrentId = 1;
    this.inventoryConsumptionCurrentId = 1;
    this.whatsappMessageCurrentId = 1;
    this.createUser({
      username: "admin",
      password: "admin123",
      fullName: "System Administrator",
      role: "manager",
      phoneNumber: "0123456789",
      email: "admin@example.com"
    });
    this.initializeTestData();
  }
  initializeTestData() {
    const doctor1 = this.createUser({
      username: "doctor1",
      password: "doctor123",
      fullName: "\u062F. \u0623\u062D\u0645\u062F \u0645\u062D\u0645\u062F",
      role: "doctor",
      phoneNumber: "0123456789",
      email: "doctor1@example.com"
    });
    const doctor2 = this.createUser({
      username: "doctor2",
      password: "doctor123",
      fullName: "\u062F. \u0645\u062D\u0645\u062F \u0639\u0644\u064A",
      role: "doctor",
      phoneNumber: "0123456780",
      email: "doctor2@example.com"
    });
    const doctor3 = this.createUser({
      username: "doctor3",
      password: "doctor123",
      fullName: "\u062F. \u0639\u0645\u0631\u0648 \u062E\u0627\u0644\u062F",
      role: "doctor",
      phoneNumber: "0123456781",
      email: "doctor3@example.com"
    });
    this.createUser({
      username: "secretary",
      password: "secretary123",
      fullName: "\u0633\u0645\u064A\u0629 \u0639\u0627\u062F\u0644",
      role: "secretary",
      phoneNumber: "0123456782",
      email: "secretary@example.com"
    });
    this.createUser({
      username: "nurse",
      password: "nurse123",
      fullName: "\u0647\u0628\u0629 \u0645\u062D\u0645\u0648\u062F",
      role: "nurse",
      phoneNumber: "0123456783",
      email: "nurse@example.com"
    });
    const service1 = this.createService({
      name: "\u062A\u0646\u0638\u064A\u0641 \u0627\u0644\u0623\u0633\u0646\u0627\u0646",
      description: "\u062A\u0646\u0638\u064A\u0641 \u0627\u0644\u0623\u0633\u0646\u0627\u0646 \u0628\u0627\u0644\u062A\u0642\u0646\u064A\u0627\u062A \u0627\u0644\u062D\u062F\u064A\u062B\u0629",
      price: 500,
      duration: 60,
      category: "\u0627\u0644\u062A\u0646\u0638\u064A\u0641"
    });
    const service2 = this.createService({
      name: "\u062D\u0634\u0648 \u0639\u0635\u0628",
      description: "\u0639\u0644\u0627\u062C \u0639\u0635\u0628 \u0627\u0644\u0623\u0633\u0646\u0627\u0646",
      price: 1200,
      duration: 90,
      category: "\u0639\u0644\u0627\u062C \u0639\u0635\u0628"
    });
    const service3 = this.createService({
      name: "\u062A\u0631\u0643\u064A\u0628 \u062A\u0642\u0648\u064A\u0645 \u0623\u0633\u0646\u0627\u0646",
      description: "\u062A\u0631\u0643\u064A\u0628 \u0627\u0644\u062A\u0642\u0648\u064A\u0645 \u0627\u0644\u0634\u0641\u0627\u0641",
      price: 8e3,
      duration: 120,
      category: "\u062A\u0642\u0648\u064A\u0645"
    });
    const service4 = this.createService({
      name: "\u0641\u062D\u0635 \u062F\u0648\u0631\u064A",
      description: "\u0641\u062D\u0635 \u062F\u0648\u0631\u064A \u0644\u0644\u0623\u0633\u0646\u0627\u0646",
      price: 300,
      duration: 30,
      category: "\u0641\u062D\u0635"
    });
    this.createInventoryItem({
      name: "\u062D\u0634\u0648 \u0643\u0648\u0645\u0628\u0648\u0632\u064A\u062A",
      description: "\u0645\u0627\u062F\u0629 \u062D\u0634\u0648 \u0633\u0646\u064A\u0629",
      quantity: 2,
      minQuantity: 10,
      unit: "\u0639\u0628\u0648\u0629",
      price: 350,
      category: "\u0645\u0648\u0627\u062F \u062D\u0634\u0648"
    });
    this.createInventoryItem({
      name: "\u0625\u0628\u0631 \u062A\u062E\u062F\u064A\u0631",
      description: "\u0625\u0628\u0631 \u062A\u062E\u062F\u064A\u0631 \u0645\u0648\u0636\u0639\u064A",
      quantity: 15,
      minQuantity: 50,
      unit: "\u0642\u0637\u0639\u0629",
      price: 5,
      category: "\u062A\u062E\u062F\u064A\u0631"
    });
    this.createInventoryItem({
      name: "\u0642\u0641\u0627\u0632\u0627\u062A \u0637\u0628\u064A\u0629",
      description: "\u0642\u0641\u0627\u0632\u0627\u062A \u0644\u0627\u062A\u0643\u0633",
      quantity: 3,
      minQuantity: 10,
      unit: "\u0639\u0644\u0628\u0629",
      price: 120,
      category: "\u0645\u0633\u062A\u0644\u0632\u0645\u0627\u062A"
    });
    this.createInventoryItem({
      name: "\u0645\u0639\u062C\u0648\u0646 \u062A\u0646\u0638\u064A\u0641",
      description: "\u0645\u0639\u062C\u0648\u0646 \u062E\u0627\u0635 \u0644\u0644\u062A\u0646\u0638\u064A\u0641 \u0627\u0644\u0645\u0647\u0646\u064A",
      quantity: 8,
      minQuantity: 5,
      unit: "\u0639\u0628\u0648\u0629",
      price: 200,
      category: "\u062A\u0646\u0638\u064A\u0641"
    });
    const patient1 = this.createPatient({
      fullName: "\u0633\u0627\u0631\u0629 \u0623\u062D\u0645\u062F",
      phoneNumber: "0123456789",
      email: "sara@example.com",
      address: "\u0627\u0644\u0642\u0627\u0647\u0631\u0629\u060C \u0627\u0644\u0645\u0639\u0627\u062F\u064A",
      birthDate: new Date(1990, 5, 12),
      notes: "\u062A\u0639\u0627\u0646\u064A \u0645\u0646 \u062D\u0633\u0627\u0633\u064A\u0629 \u0641\u064A \u0627\u0644\u0623\u0633\u0646\u0627\u0646"
    });
    const patient2 = this.createPatient({
      fullName: "\u0645\u062D\u0645\u0648\u062F \u062E\u0627\u0644\u062F",
      phoneNumber: "0123456790",
      email: "mahmoud@example.com",
      address: "\u0627\u0644\u0642\u0627\u0647\u0631\u0629\u060C \u0645\u062F\u064A\u0646\u0629 \u0646\u0635\u0631",
      birthDate: new Date(1985, 8, 25),
      notes: ""
    });
    const patient3 = this.createPatient({
      fullName: "\u0644\u064A\u0644\u0649 \u0633\u0639\u064A\u062F",
      phoneNumber: "0123456791",
      email: "laila@example.com",
      address: "\u0627\u0644\u0642\u0627\u0647\u0631\u0629\u060C \u0627\u0644\u0632\u0645\u0627\u0644\u0643",
      birthDate: new Date(1995, 2, 7),
      notes: "\u062A\u062D\u062A\u0627\u062C \u0625\u0644\u0649 \u062A\u0642\u0648\u064A\u0645 \u0623\u0633\u0646\u0627\u0646"
    });
    const patient4 = this.createPatient({
      fullName: "\u0643\u0631\u064A\u0645 \u0639\u0627\u062F\u0644",
      phoneNumber: "0123456792",
      email: "karim@example.com",
      address: "\u0627\u0644\u0642\u0627\u0647\u0631\u0629\u060C \u0627\u0644\u0645\u0647\u0646\u062F\u0633\u064A\u0646",
      birthDate: new Date(1980, 11, 10),
      notes: ""
    });
    const patient5 = this.createPatient({
      fullName: "\u0646\u0648\u0631\u0627 \u062D\u0633\u064A\u0646",
      phoneNumber: "0123456793",
      email: "noura@example.com",
      address: "\u0627\u0644\u0642\u0627\u0647\u0631\u0629\u060C \u0645\u0635\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629",
      birthDate: new Date(1992, 7, 18),
      notes: ""
    });
    const patient6 = this.createPatient({
      fullName: "\u0623\u0645\u064A\u0631 \u0633\u0627\u0645\u064A",
      phoneNumber: "0123456794",
      email: "amir@example.com",
      address: "\u0627\u0644\u0642\u0627\u0647\u0631\u0629\u060C \u0627\u0644\u0645\u0639\u0627\u062F\u064A",
      birthDate: new Date(1988, 4, 22),
      notes: ""
    });
    const patient7 = this.createPatient({
      fullName: "\u0633\u0644\u0645\u0649 \u0639\u0627\u062F\u0644",
      phoneNumber: "0123456795",
      email: "salma@example.com",
      address: "\u0627\u0644\u0642\u0627\u0647\u0631\u0629\u060C \u0627\u0644\u0634\u0631\u0648\u0642",
      birthDate: new Date(1997, 9, 5),
      notes: ""
    });
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    this.createAppointment({
      patientId: patient1.id,
      doctorId: doctor2.id,
      serviceId: service3.id,
      startTime: new Date(today.getTime() + 10 * 60 * 60 * 1e3),
      // 10:00 AM
      endTime: new Date(today.getTime() + 12 * 60 * 60 * 1e3),
      // 12:00 PM
      status: "confirmed",
      notes: "",
      createdBy: 1
    });
    this.createAppointment({
      patientId: patient2.id,
      doctorId: doctor1.id,
      serviceId: service1.id,
      startTime: new Date(today.getTime() + 11.5 * 60 * 60 * 1e3),
      // 11:30 AM
      endTime: new Date(today.getTime() + 12.5 * 60 * 60 * 1e3),
      // 12:30 PM
      status: "pending",
      notes: "",
      createdBy: 1
    });
    this.createAppointment({
      patientId: patient3.id,
      doctorId: doctor3.id,
      serviceId: service2.id,
      startTime: new Date(today.getTime() + 13 * 60 * 60 * 1e3),
      // 1:00 PM
      endTime: new Date(today.getTime() + 14.5 * 60 * 60 * 1e3),
      // 2:30 PM
      status: "confirmed",
      notes: "",
      createdBy: 1
    });
    this.createAppointment({
      patientId: patient4.id,
      doctorId: doctor1.id,
      serviceId: service4.id,
      startTime: new Date(today.getTime() + 15.5 * 60 * 60 * 1e3),
      // 3:30 PM
      endTime: new Date(today.getTime() + 16 * 60 * 60 * 1e3),
      // 4:00 PM
      status: "confirmed",
      notes: "",
      createdBy: 1
    });
    this.createTreatmentPlan({
      patientId: patient5.id,
      doctorId: doctor1.id,
      title: "\u0639\u0644\u0627\u062C \u062A\u0633\u0648\u0633 \u0645\u062A\u0639\u062F\u062F",
      description: "\u0639\u0644\u0627\u062C 4 \u0623\u0633\u0646\u0627\u0646 \u0645\u0635\u0627\u0628\u0629 \u0628\u0627\u0644\u062A\u0633\u0648\u0633",
      totalCost: 4800,
      startDate: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1e3),
      // 20 days ago
      endDate: new Date(today.getTime() + 40 * 24 * 60 * 60 * 1e3),
      // 40 days later
      progress: 75
    });
    this.createTreatmentPlan({
      patientId: patient6.id,
      doctorId: doctor3.id,
      title: "\u062A\u0631\u0643\u064A\u0628 \u062A\u0642\u0648\u064A\u0645 \u0645\u0639 \u0645\u062A\u0627\u0628\u0639\u0629",
      description: "\u062A\u0631\u0643\u064A\u0628 \u062A\u0642\u0648\u064A\u0645 \u0634\u0641\u0627\u0641 \u0645\u0639 12 \u062C\u0644\u0633\u0629 \u0645\u062A\u0627\u0628\u0639\u0629",
      totalCost: 15e3,
      startDate: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1e3),
      // 60 days ago
      endDate: new Date(today.getTime() + 305 * 24 * 60 * 60 * 1e3),
      // 305 days later
      progress: 100
    });
    this.createTreatmentPlan({
      patientId: patient7.id,
      doctorId: doctor2.id,
      title: "\u0632\u0631\u0627\u0639\u0629 \u0623\u0633\u0646\u0627\u0646",
      description: "\u0632\u0631\u0627\u0639\u0629 \u0633\u0646\u064A\u0646 \u0645\u0639 \u0627\u0644\u062A\u0631\u0643\u064A\u0628\u0627\u062A",
      totalCost: 12e3,
      startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1e3),
      // 30 days ago
      endDate: new Date(today.getTime() + 150 * 24 * 60 * 60 * 1e3),
      // 150 days later
      progress: 30
    });
    this.createFinancialTransaction({
      patientId: patient1.id,
      appointmentId: 1,
      amount: 8e3,
      type: "income",
      category: "treatment fee",
      description: "\u062F\u0641\u0639\u0629 \u0623\u0648\u0644\u0649 - \u062A\u0642\u0648\u064A\u0645 \u0623\u0633\u0646\u0627\u0646",
      date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1e3),
      // 5 days ago
      createdBy: 1
    });
    this.createFinancialTransaction({
      patientId: patient2.id,
      appointmentId: 2,
      amount: 500,
      type: "income",
      category: "treatment fee",
      description: "\u062A\u0646\u0638\u064A\u0641 \u0623\u0633\u0646\u0627\u0646",
      date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1e3),
      // 7 days ago
      createdBy: 1
    });
    this.createFinancialTransaction({
      amount: 2e3,
      type: "expense",
      category: "purchase",
      description: "\u0634\u0631\u0627\u0621 \u0645\u0648\u0627\u062F \u0627\u0633\u062A\u0647\u0644\u0627\u0643\u064A\u0629",
      date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1e3),
      // 10 days ago
      createdBy: 1
    });
    this.createInventoryConsumption({
      itemId: 1,
      appointmentId: 3,
      patientId: patient3.id,
      quantity: 1,
      usedBy: doctor3.id,
      notes: "\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0644\u0639\u0644\u0627\u062C \u0639\u0635\u0628"
    });
    this.createInventoryConsumption({
      itemId: 2,
      appointmentId: 3,
      patientId: patient3.id,
      quantity: 2,
      usedBy: doctor3.id,
      notes: "\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0644\u0639\u0644\u0627\u062C \u0639\u0635\u0628"
    });
    this.createWhatsappMessage({
      patientId: patient1.id,
      appointmentId: 1,
      messageType: "appointment_reminder",
      message: "\u062A\u0630\u0643\u064A\u0631 \u0628\u0645\u0648\u0639\u062F\u0643 \u063A\u062F\u0627\u064B \u0627\u0644\u0633\u0627\u0639\u0629 10:00 \u0635\u0628\u0627\u062D\u0627\u064B \u0645\u0639 \u062F. \u0645\u062D\u0645\u062F \u0639\u0644\u064A",
      status: "sent",
      sentBy: 4
    });
    this.createWhatsappMessage({
      patientId: patient5.id,
      messageType: "followup",
      message: "\u0643\u064A\u0641 \u062D\u0627\u0644\u062A\u0643 \u0628\u0639\u062F \u0627\u0644\u062C\u0644\u0633\u0629 \u0627\u0644\u0633\u0627\u0628\u0642\u0629\u061F \u0647\u0644 \u0647\u0646\u0627\u0643 \u0623\u064A \u0623\u0644\u0645 \u0623\u0648 \u0627\u0646\u0632\u0639\u0627\u062C\u061F",
      status: "read",
      sentBy: 4
    });
    this.createWhatsappMessage({
      patientId: patient6.id,
      messageType: "payment_reminder",
      message: "\u062A\u0630\u0643\u064A\u0631 \u0628\u0645\u0648\u0639\u062F \u062F\u0641\u0639 \u0627\u0644\u0642\u0633\u0637 \u0627\u0644\u0645\u0633\u062A\u062D\u0642 \u0628\u062A\u0627\u0631\u064A\u062E 20/6/2023 \u0628\u0642\u064A\u0645\u0629 2000 \u062C\u0646\u064A\u0647",
      status: "delivered",
      sentBy: 4
    });
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userCurrentId++;
    const createdAt = /* @__PURE__ */ new Date();
    const user = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  async getUsers() {
    return Array.from(this.users.values());
  }
  async getUsersByRole(role) {
    return Array.from(this.users.values()).filter((user) => user.role === role);
  }
  // Patient operations
  async getPatient(id) {
    return this.patients.get(id);
  }
  async getPatients() {
    return Array.from(this.patients.values());
  }
  async createPatient(insertPatient) {
    const id = this.patientCurrentId++;
    const createdAt = /* @__PURE__ */ new Date();
    const patient = { ...insertPatient, id, createdAt };
    this.patients.set(id, patient);
    return patient;
  }
  async updatePatient(id, patientData) {
    const patient = this.patients.get(id);
    if (!patient) return void 0;
    const updatedPatient = { ...patient, ...patientData };
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }
  async searchPatients(query) {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.patients.values()).filter(
      (patient) => patient.fullName.toLowerCase().includes(lowerQuery) || patient.phoneNumber.includes(query)
    );
  }
  // Service operations
  async getService(id) {
    return this.services.get(id);
  }
  async getServices() {
    return Array.from(this.services.values());
  }
  async createService(insertService) {
    const id = this.serviceCurrentId++;
    const service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }
  async updateService(id, serviceData) {
    const service = this.services.get(id);
    if (!service) return void 0;
    const updatedService = { ...service, ...serviceData };
    this.services.set(id, updatedService);
    return updatedService;
  }
  // Inventory operations
  async getInventoryItem(id) {
    return this.inventoryItems.get(id);
  }
  async getInventoryItems() {
    return Array.from(this.inventoryItems.values());
  }
  async createInventoryItem(insertItem) {
    const id = this.inventoryItemCurrentId++;
    const item = { ...insertItem, id };
    this.inventoryItems.set(id, item);
    return item;
  }
  async updateInventoryItem(id, itemData) {
    const item = this.inventoryItems.get(id);
    if (!item) return void 0;
    const updatedItem = { ...item, ...itemData };
    this.inventoryItems.set(id, updatedItem);
    return updatedItem;
  }
  async getLowStockItems() {
    return Array.from(this.inventoryItems.values()).filter((item) => item.quantity <= item.minQuantity);
  }
  // Appointment operations
  async getAppointment(id) {
    return this.appointments.get(id);
  }
  async getAppointments() {
    return Array.from(this.appointments.values());
  }
  async getAppointmentsByDate(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.startTime >= startOfDay && appointment.startTime <= endOfDay
    );
  }
  async getAppointmentsByDoctor(doctorId) {
    return Array.from(this.appointments.values()).filter((appointment) => appointment.doctorId === doctorId);
  }
  async getAppointmentsByPatient(patientId) {
    return Array.from(this.appointments.values()).filter((appointment) => appointment.patientId === patientId);
  }
  async createAppointment(insertAppointment) {
    const id = this.appointmentCurrentId++;
    const createdAt = /* @__PURE__ */ new Date();
    const appointment = { ...insertAppointment, id, createdAt };
    this.appointments.set(id, appointment);
    return appointment;
  }
  async updateAppointment(id, appointmentData) {
    const appointment = this.appointments.get(id);
    if (!appointment) return void 0;
    const updatedAppointment = { ...appointment, ...appointmentData };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }
  // Treatment plans operations
  async getTreatmentPlan(id) {
    return this.treatmentPlans.get(id);
  }
  async getTreatmentPlansByPatient(patientId) {
    return Array.from(this.treatmentPlans.values()).filter((plan) => plan.patientId === patientId);
  }
  async createTreatmentPlan(insertPlan) {
    const id = this.treatmentPlanCurrentId++;
    const createdAt = /* @__PURE__ */ new Date();
    const plan = { ...insertPlan, id, createdAt };
    this.treatmentPlans.set(id, plan);
    return plan;
  }
  async updateTreatmentPlan(id, planData) {
    const plan = this.treatmentPlans.get(id);
    if (!plan) return void 0;
    const updatedPlan = { ...plan, ...planData };
    this.treatmentPlans.set(id, updatedPlan);
    return updatedPlan;
  }
  // Financial operations
  async getFinancialTransaction(id) {
    return this.financialTransactions.get(id);
  }
  async getFinancialTransactions() {
    return Array.from(this.financialTransactions.values());
  }
  async getFinancialTransactionsByPatient(patientId) {
    return Array.from(this.financialTransactions.values()).filter((transaction) => transaction.patientId === patientId);
  }
  async createFinancialTransaction(insertTransaction) {
    const id = this.financialTransactionCurrentId++;
    const transaction = { ...insertTransaction, id };
    this.financialTransactions.set(id, transaction);
    return transaction;
  }
  // Inventory consumption operations
  async createInventoryConsumption(insertConsumption) {
    const id = this.inventoryConsumptionCurrentId++;
    const usedAt = /* @__PURE__ */ new Date();
    const consumption = { ...insertConsumption, id, usedAt };
    this.inventoryConsumption.set(id, consumption);
    const item = this.inventoryItems.get(insertConsumption.itemId);
    if (item) {
      item.quantity -= Number(insertConsumption.quantity);
      this.inventoryItems.set(item.id, item);
    }
    return consumption;
  }
  async getInventoryConsumptionByPatient(patientId) {
    return Array.from(this.inventoryConsumption.values()).filter((consumption) => consumption.patientId === patientId);
  }
  // WhatsApp operations
  async createWhatsappMessage(insertMessage) {
    const id = this.whatsappMessageCurrentId++;
    const sentAt = /* @__PURE__ */ new Date();
    const message = { ...insertMessage, id, sentAt };
    this.whatsappMessages.set(id, message);
    return message;
  }
  async getWhatsappMessages() {
    return Array.from(this.whatsappMessages.values());
  }
  async getWhatsappMessagesByPatient(patientId) {
    return Array.from(this.whatsappMessages.values()).filter((message) => message.patientId === patientId);
  }
  // Analytics and KPIs
  async getMonthlyRevenue() {
    const today = /* @__PURE__ */ new Date();
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleDateString("ar-EG", { month: "short" });
      months.push({ month: monthName, revenue: 0 });
    }
    const transactions = Array.from(this.financialTransactions.values()).filter((transaction) => transaction.type === "income");
    for (const transaction of transactions) {
      const transactionMonth = transaction.date.getMonth();
      const transactionYear = transaction.date.getFullYear();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const monthDiff = (currentYear - transactionYear) * 12 + (currentMonth - transactionMonth);
      if (monthDiff >= 0 && monthDiff < 12) {
        const index = 11 - monthDiff;
        months[index].revenue += Number(transaction.amount);
      }
    }
    return months;
  }
  async getPatientGrowth() {
    const today = /* @__PURE__ */ new Date();
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleDateString("ar-EG", { month: "short" });
      months.push({ month: monthName, count: 0 });
    }
    const patients2 = Array.from(this.patients.values());
    for (const patient of patients2) {
      const patientMonth = patient.createdAt.getMonth();
      const patientYear = patient.createdAt.getFullYear();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const monthDiff = (currentYear - patientYear) * 12 + (currentMonth - patientMonth);
      if (monthDiff >= 0 && monthDiff < 12) {
        const index = 11 - monthDiff;
        months[index].count += 1;
      }
    }
    return months;
  }
  async getAppointmentStatusStats() {
    const stats = [
      { status: "confirmed", count: 0 },
      { status: "pending", count: 0 },
      { status: "cancelled", count: 0 }
    ];
    const appointments2 = Array.from(this.appointments.values());
    for (const appointment of appointments2) {
      const statusIndex = stats.findIndex((s) => s.status === appointment.status);
      if (statusIndex !== -1) {
        stats[statusIndex].count += 1;
      }
    }
    return stats;
  }
  async getInventoryConsumptionStats() {
    const itemStats = /* @__PURE__ */ new Map();
    const consumptions = Array.from(this.inventoryConsumption.values());
    for (const consumption of consumptions) {
      const item = this.inventoryItems.get(consumption.itemId);
      if (item) {
        const currentQuantity = itemStats.get(item.name) || 0;
        itemStats.set(item.name, currentQuantity + Number(consumption.quantity));
      }
    }
    return Array.from(itemStats.entries()).map(([item, quantity]) => ({ item, quantity }));
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp, numeric, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var userRoleEnum = pgEnum("user_role", ["manager", "doctor", "secretary", "nurse"]);
var appointmentStatusEnum = pgEnum("appointment_status", ["confirmed", "pending", "cancelled"]);
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: userRoleEnum("role").notNull(),
  phoneNumber: text("phone_number"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow()
});
var patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email"),
  address: text("address"),
  birthDate: timestamp("birth_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
var services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price").notNull(),
  duration: integer("duration").notNull(),
  // minutes
  category: text("category")
});
var inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  quantity: integer("quantity").notNull().default(0),
  minQuantity: integer("min_quantity").notNull().default(5),
  unit: text("unit").notNull(),
  price: numeric("price"),
  category: text("category")
});
var appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  doctorId: integer("doctor_id").notNull().references(() => users.id),
  serviceId: integer("service_id").references(() => services.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: appointmentStatusEnum("status").notNull().default("pending"),
  notes: text("notes"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow()
});
var treatmentPlans = pgTable("treatment_plans", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  doctorId: integer("doctor_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  totalCost: numeric("total_cost"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  progress: integer("progress").default(0),
  // 0-100%
  createdAt: timestamp("created_at").defaultNow()
});
var financialTransactions = pgTable("financial_transactions", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  amount: numeric("amount").notNull(),
  type: text("type").notNull(),
  // income, expense
  category: text("category"),
  // treatment fee, purchase, salary, etc.
  description: text("description"),
  date: timestamp("date").notNull(),
  createdBy: integer("created_by").references(() => users.id)
});
var inventoryConsumption = pgTable("inventory_consumption", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull().references(() => inventoryItems.id),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  patientId: integer("patient_id").references(() => patients.id),
  quantity: numeric("quantity").notNull(),
  usedBy: integer("used_by").references(() => users.id),
  usedAt: timestamp("used_at").defaultNow(),
  notes: text("notes")
});
var whatsappMessages = pgTable("whatsapp_messages", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  messageType: text("message_type").notNull(),
  // appointment_reminder, followup, payment_reminder
  message: text("message").notNull(),
  status: text("status").notNull(),
  // sent, delivered, read, failed
  sentAt: timestamp("sent_at").defaultNow(),
  sentBy: integer("sent_by").references(() => users.id)
});
var insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
var insertPatientSchema = createInsertSchema(patients).omit({ id: true, createdAt: true });
var insertServiceSchema = createInsertSchema(services).omit({ id: true });
var insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({ id: true });
var insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true, createdAt: true });
var insertTreatmentPlanSchema = createInsertSchema(treatmentPlans).omit({ id: true, createdAt: true });
var insertFinancialTransactionSchema = createInsertSchema(financialTransactions).omit({ id: true });
var insertInventoryConsumptionSchema = createInsertSchema(inventoryConsumption).omit({ id: true, usedAt: true });
var insertWhatsappMessageSchema = createInsertSchema(whatsappMessages).omit({ id: true, sentAt: true });
var loginSchema = z.object({
  username: z.string().min(1, { message: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0645\u0637\u0644\u0648\u0628" }),
  password: z.string().min(1, { message: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0645\u0637\u0644\u0648\u0628\u0629" })
});

// server/routes.ts
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import MemoryStore from "memorystore";
var SessionStore = MemoryStore(session);
async function registerRoutes(app2) {
  app2.use(
    session({
      cookie: {
        maxAge: 864e5,
        // 1 day
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
      },
      store: new SessionStore({
        checkPeriod: 864e5
        // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "shinenwhite-clinic-secret"
    })
  );
  const authenticate = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };
  const checkRole = (roles) => {
    return async (req, res, next) => {
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
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(data.username);
      if (!user || user.password !== data.password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      req.session.userId = user.id;
      req.session.userRole = user.role;
      res.json({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  app2.get("/api/auth/me", async (req, res) => {
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
      role: user.role
    });
  });
  app2.get("/api/users", authenticate, checkRole(["manager"]), async (req, res) => {
    const users2 = await storage.getUsers();
    res.json(users2.map((user) => ({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      phoneNumber: user.phoneNumber,
      email: user.email
    })));
  });
  app2.get("/api/users/doctors", authenticate, async (req, res) => {
    const doctors = await storage.getUsersByRole("doctor");
    res.json(doctors.map((doctor) => ({
      id: doctor.id,
      username: doctor.username,
      fullName: doctor.fullName,
      phoneNumber: doctor.phoneNumber,
      email: doctor.email
    })));
  });
  app2.post("/api/users", authenticate, checkRole(["manager"]), async (req, res) => {
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
  app2.get("/api/patients", authenticate, async (req, res) => {
    const patients2 = await storage.getPatients();
    res.json(patients2);
  });
  app2.get("/api/patients/search", authenticate, async (req, res) => {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const patients2 = await storage.searchPatients(query);
    res.json(patients2);
  });
  app2.get("/api/patients/:id", authenticate, async (req, res) => {
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
  app2.post("/api/patients", authenticate, async (req, res) => {
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
  app2.patch("/api/patients/:id", authenticate, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    try {
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
  app2.get("/api/appointments", authenticate, async (req, res) => {
    const appointments2 = await storage.getAppointments();
    res.json(appointments2);
  });
  app2.get("/api/appointments/today", authenticate, async (req, res) => {
    const today = /* @__PURE__ */ new Date();
    const appointments2 = await storage.getAppointmentsByDate(today);
    const patientsMap = /* @__PURE__ */ new Map();
    const doctorsMap = /* @__PURE__ */ new Map();
    const servicesMap = /* @__PURE__ */ new Map();
    for (const appt of appointments2) {
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
    const result = appointments2.map((appt) => ({
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
  app2.get("/api/appointments/doctor/:id", authenticate, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }
    const appointments2 = await storage.getAppointmentsByDoctor(id);
    res.json(appointments2);
  });
  app2.get("/api/appointments/patient/:id", authenticate, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }
    const appointments2 = await storage.getAppointmentsByPatient(id);
    res.json(appointments2);
  });
  app2.post("/api/appointments", authenticate, async (req, res) => {
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
  app2.patch("/api/appointments/:id", authenticate, async (req, res) => {
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
  app2.get("/api/services", authenticate, async (req, res) => {
    const services2 = await storage.getServices();
    res.json(services2);
  });
  app2.post("/api/services", authenticate, checkRole(["manager"]), async (req, res) => {
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
  app2.get("/api/inventory", authenticate, async (req, res) => {
    const items = await storage.getInventoryItems();
    res.json(items);
  });
  app2.get("/api/inventory/low-stock", authenticate, async (req, res) => {
    const items = await storage.getLowStockItems();
    res.json(items);
  });
  app2.post("/api/inventory", authenticate, checkRole(["manager", "secretary"]), async (req, res) => {
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
  app2.patch("/api/inventory/:id", authenticate, checkRole(["manager", "secretary"]), async (req, res) => {
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
  app2.post("/api/inventory/consumption", authenticate, checkRole(["doctor", "nurse"]), async (req, res) => {
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
  app2.get("/api/treatment-plans/patient/:id", authenticate, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }
    const plans = await storage.getTreatmentPlansByPatient(id);
    res.json(plans);
  });
  app2.post("/api/treatment-plans", authenticate, checkRole(["manager", "doctor"]), async (req, res) => {
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
  app2.patch("/api/treatment-plans/:id", authenticate, checkRole(["manager", "doctor"]), async (req, res) => {
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
  app2.get("/api/finances", authenticate, checkRole(["manager", "secretary"]), async (req, res) => {
    const transactions = await storage.getFinancialTransactions();
    res.json(transactions);
  });
  app2.get("/api/finances/patient/:id", authenticate, checkRole(["manager", "secretary"]), async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }
    const transactions = await storage.getFinancialTransactionsByPatient(id);
    res.json(transactions);
  });
  app2.post("/api/finances", authenticate, checkRole(["manager", "secretary"]), async (req, res) => {
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
  app2.get("/api/whatsapp/messages", authenticate, checkRole(["manager", "secretary"]), async (req, res) => {
    const messages = await storage.getWhatsappMessages();
    const patientsMap = /* @__PURE__ */ new Map();
    for (const msg of messages) {
      if (msg.patientId && !patientsMap.has(msg.patientId)) {
        const patient = await storage.getPatient(msg.patientId);
        if (patient) {
          patientsMap.set(msg.patientId, patient);
        }
      }
    }
    const result = messages.map((msg) => ({
      ...msg,
      patient: msg.patientId ? {
        id: patientsMap.get(msg.patientId)?.id,
        fullName: patientsMap.get(msg.patientId)?.fullName,
        phoneNumber: patientsMap.get(msg.patientId)?.phoneNumber
      } : null
    }));
    res.json(result);
  });
  app2.post("/api/whatsapp/send", authenticate, checkRole(["manager", "secretary"]), async (req, res) => {
    try {
      const data = insertWhatsappMessageSchema.parse({
        ...req.body,
        sentBy: req.session.userId
      });
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
  app2.get("/api/analytics/revenue", authenticate, checkRole(["manager"]), async (req, res) => {
    const data = await storage.getMonthlyRevenue();
    res.json(data);
  });
  app2.get("/api/analytics/patient-growth", authenticate, checkRole(["manager"]), async (req, res) => {
    const data = await storage.getPatientGrowth();
    res.json(data);
  });
  app2.get("/api/analytics/appointment-stats", authenticate, checkRole(["manager"]), async (req, res) => {
    const data = await storage.getAppointmentStatusStats();
    res.json(data);
  });
  app2.get("/api/analytics/inventory-consumption", authenticate, checkRole(["manager"]), async (req, res) => {
    const data = await storage.getInventoryConsumptionStats();
    res.json(data);
  });
  app2.get("/api/analytics/dashboard", authenticate, async (req, res) => {
    const today = /* @__PURE__ */ new Date();
    const appointments2 = await storage.getAppointmentsByDate(today);
    const patients2 = await storage.getPatients();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const newPatientsThisMonth = patients2.filter((p) => {
      const patientDate = new Date(p.createdAt);
      return patientDate.getMonth() === currentMonth && patientDate.getFullYear() === currentYear;
    }).length;
    const lowStockItems = await storage.getLowStockItems();
    const transactions = await storage.getFinancialTransactions();
    const currentMonthTransactions = transactions.filter((t) => {
      const txDate = new Date(t.date);
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear && t.type === "income";
    });
    const monthlyRevenue = currentMonthTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
    res.json({
      appointmentsToday: appointments2.length,
      newPatientsThisMonth,
      lowStockItems: lowStockItems.length,
      monthlyRevenue
    });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
console.log("Running on port:", process.env.PORT || 3e3);
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 3e3;
  server.listen(port, "127.0.0.1", () => {
    log(` Server running on http://127.0.0.1:${port}`);
  });
})();
