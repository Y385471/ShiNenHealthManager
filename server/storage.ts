import {
  User, InsertUser, 
  Patient, InsertPatient,
  Service, InsertService,
  InventoryItem, InsertInventoryItem,
  Appointment, InsertAppointment,
  TreatmentPlan, InsertTreatmentPlan,
  FinancialTransaction, InsertFinancialTransaction,
  InventoryConsumption, InsertInventoryConsumption,
  WhatsappMessage, InsertWhatsappMessage
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;
  
  // Patient operations
  getPatient(id: number): Promise<Patient | undefined>;
  getPatients(): Promise<Patient[]>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient | undefined>;
  searchPatients(query: string): Promise<Patient[]>;
  
  // Service operations
  getService(id: number): Promise<Service | undefined>;
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  
  // Inventory operations
  getInventoryItem(id: number): Promise<InventoryItem | undefined>;
  getInventoryItems(): Promise<InventoryItem[]>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  getLowStockItems(): Promise<InventoryItem[]>;
  
  // Appointment operations
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointments(): Promise<Appointment[]>;
  getAppointmentsByDate(date: Date): Promise<Appointment[]>;
  getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]>;
  getAppointmentsByPatient(patientId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  
  // Treatment plans operations
  getTreatmentPlan(id: number): Promise<TreatmentPlan | undefined>;
  getTreatmentPlansByPatient(patientId: number): Promise<TreatmentPlan[]>;
  createTreatmentPlan(plan: InsertTreatmentPlan): Promise<TreatmentPlan>;
  updateTreatmentPlan(id: number, plan: Partial<InsertTreatmentPlan>): Promise<TreatmentPlan | undefined>;
  
  // Financial operations
  getFinancialTransaction(id: number): Promise<FinancialTransaction | undefined>;
  getFinancialTransactions(): Promise<FinancialTransaction[]>;
  getFinancialTransactionsByPatient(patientId: number): Promise<FinancialTransaction[]>;
  createFinancialTransaction(transaction: InsertFinancialTransaction): Promise<FinancialTransaction>;
  
  // Inventory consumption operations
  createInventoryConsumption(consumption: InsertInventoryConsumption): Promise<InventoryConsumption>;
  getInventoryConsumptionByPatient(patientId: number): Promise<InventoryConsumption[]>;
  
  // WhatsApp operations
  createWhatsappMessage(message: InsertWhatsappMessage): Promise<WhatsappMessage>;
  getWhatsappMessages(): Promise<WhatsappMessage[]>;
  getWhatsappMessagesByPatient(patientId: number): Promise<WhatsappMessage[]>;
  
  // Analytics and KPIs
  getMonthlyRevenue(): Promise<{ month: string; revenue: number }[]>;
  getPatientGrowth(): Promise<{ month: string; count: number }[]>;
  getAppointmentStatusStats(): Promise<{ status: string; count: number }[]>;
  getInventoryConsumptionStats(): Promise<{ item: string; quantity: number }[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private patients: Map<number, Patient>;
  private services: Map<number, Service>;
  private inventoryItems: Map<number, InventoryItem>;
  private appointments: Map<number, Appointment>;
  private treatmentPlans: Map<number, TreatmentPlan>;
  private financialTransactions: Map<number, FinancialTransaction>;
  private inventoryConsumption: Map<number, InventoryConsumption>;
  private whatsappMessages: Map<number, WhatsappMessage>;
  
  private userCurrentId: number;
  private patientCurrentId: number;
  private serviceCurrentId: number;
  private inventoryItemCurrentId: number;
  private appointmentCurrentId: number;
  private treatmentPlanCurrentId: number;
  private financialTransactionCurrentId: number;
  private inventoryConsumptionCurrentId: number;
  private whatsappMessageCurrentId: number;

  constructor() {
    this.users = new Map();
    this.patients = new Map();
    this.services = new Map();
    this.inventoryItems = new Map();
    this.appointments = new Map();
    this.treatmentPlans = new Map();
    this.financialTransactions = new Map();
    this.inventoryConsumption = new Map();
    this.whatsappMessages = new Map();
    
    this.userCurrentId = 1;
    this.patientCurrentId = 1;
    this.serviceCurrentId = 1;
    this.inventoryItemCurrentId = 1;
    this.appointmentCurrentId = 1;
    this.treatmentPlanCurrentId = 1;
    this.financialTransactionCurrentId = 1;
    this.inventoryConsumptionCurrentId = 1;
    this.whatsappMessageCurrentId = 1;
    
    // Add default admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      fullName: "System Administrator",
      role: "manager",
      phoneNumber: "0123456789",
      email: "admin@example.com"
    });
    
    // Add test data
    this.initializeTestData();
  }

  private initializeTestData() {
    // Add some doctors
    const doctor1 = this.createUser({
      username: "doctor1",
      password: "doctor123",
      fullName: "د. أحمد محمد",
      role: "doctor",
      phoneNumber: "0123456789",
      email: "doctor1@example.com"
    });
    
    const doctor2 = this.createUser({
      username: "doctor2",
      password: "doctor123",
      fullName: "د. محمد علي",
      role: "doctor",
      phoneNumber: "0123456780",
      email: "doctor2@example.com"
    });
    
    const doctor3 = this.createUser({
      username: "doctor3",
      password: "doctor123",
      fullName: "د. عمرو خالد",
      role: "doctor",
      phoneNumber: "0123456781",
      email: "doctor3@example.com"
    });
    
    // Add secretary and nurse
    this.createUser({
      username: "secretary",
      password: "secretary123",
      fullName: "سمية عادل",
      role: "secretary",
      phoneNumber: "0123456782",
      email: "secretary@example.com"
    });
    
    this.createUser({
      username: "nurse",
      password: "nurse123",
      fullName: "هبة محمود",
      role: "nurse",
      phoneNumber: "0123456783",
      email: "nurse@example.com"
    });
    
    // Add services
    const service1 = this.createService({
      name: "تنظيف الأسنان",
      description: "تنظيف الأسنان بالتقنيات الحديثة",
      price: 500,
      duration: 60,
      category: "التنظيف"
    });
    
    const service2 = this.createService({
      name: "حشو عصب",
      description: "علاج عصب الأسنان",
      price: 1200,
      duration: 90,
      category: "علاج عصب"
    });
    
    const service3 = this.createService({
      name: "تركيب تقويم أسنان",
      description: "تركيب التقويم الشفاف",
      price: 8000,
      duration: 120,
      category: "تقويم"
    });
    
    const service4 = this.createService({
      name: "فحص دوري",
      description: "فحص دوري للأسنان",
      price: 300,
      duration: 30,
      category: "فحص"
    });
    
    // Add inventory items
    this.createInventoryItem({
      name: "حشو كومبوزيت",
      description: "مادة حشو سنية",
      quantity: 2,
      minQuantity: 10,
      unit: "عبوة",
      price: 350,
      category: "مواد حشو"
    });
    
    this.createInventoryItem({
      name: "إبر تخدير",
      description: "إبر تخدير موضعي",
      quantity: 15,
      minQuantity: 50,
      unit: "قطعة",
      price: 5,
      category: "تخدير"
    });
    
    this.createInventoryItem({
      name: "قفازات طبية",
      description: "قفازات لاتكس",
      quantity: 3,
      minQuantity: 10,
      unit: "علبة",
      price: 120,
      category: "مستلزمات"
    });
    
    this.createInventoryItem({
      name: "معجون تنظيف",
      description: "معجون خاص للتنظيف المهني",
      quantity: 8,
      minQuantity: 5,
      unit: "عبوة",
      price: 200,
      category: "تنظيف"
    });
    
    // Add patients
    const patient1 = this.createPatient({
      fullName: "سارة أحمد",
      phoneNumber: "0123456789",
      email: "sara@example.com",
      address: "القاهرة، المعادي",
      birthDate: new Date(1990, 5, 12),
      notes: "تعاني من حساسية في الأسنان"
    });
    
    const patient2 = this.createPatient({
      fullName: "محمود خالد",
      phoneNumber: "0123456790",
      email: "mahmoud@example.com",
      address: "القاهرة، مدينة نصر",
      birthDate: new Date(1985, 8, 25),
      notes: ""
    });
    
    const patient3 = this.createPatient({
      fullName: "ليلى سعيد",
      phoneNumber: "0123456791",
      email: "laila@example.com",
      address: "القاهرة، الزمالك",
      birthDate: new Date(1995, 2, 7),
      notes: "تحتاج إلى تقويم أسنان"
    });
    
    const patient4 = this.createPatient({
      fullName: "كريم عادل",
      phoneNumber: "0123456792",
      email: "karim@example.com",
      address: "القاهرة، المهندسين",
      birthDate: new Date(1980, 11, 10),
      notes: ""
    });
    
    const patient5 = this.createPatient({
      fullName: "نورا حسين",
      phoneNumber: "0123456793",
      email: "noura@example.com",
      address: "القاهرة، مصر الجديدة",
      birthDate: new Date(1992, 7, 18),
      notes: ""
    });
    
    const patient6 = this.createPatient({
      fullName: "أمير سامي",
      phoneNumber: "0123456794",
      email: "amir@example.com",
      address: "القاهرة، المعادي",
      birthDate: new Date(1988, 4, 22),
      notes: ""
    });
    
    const patient7 = this.createPatient({
      fullName: "سلمى عادل",
      phoneNumber: "0123456795",
      email: "salma@example.com",
      address: "القاهرة، الشروق",
      birthDate: new Date(1997, 9, 5),
      notes: ""
    });
    
    // Add appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    this.createAppointment({
      patientId: patient1.id,
      doctorId: doctor2.id,
      serviceId: service3.id,
      startTime: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10:00 AM
      endTime: new Date(today.getTime() + 12 * 60 * 60 * 1000), // 12:00 PM
      status: "confirmed",
      notes: "",
      createdBy: 1
    });
    
    this.createAppointment({
      patientId: patient2.id,
      doctorId: doctor1.id,
      serviceId: service1.id,
      startTime: new Date(today.getTime() + 11.5 * 60 * 60 * 1000), // 11:30 AM
      endTime: new Date(today.getTime() + 12.5 * 60 * 60 * 1000), // 12:30 PM
      status: "pending",
      notes: "",
      createdBy: 1
    });
    
    this.createAppointment({
      patientId: patient3.id,
      doctorId: doctor3.id,
      serviceId: service2.id,
      startTime: new Date(today.getTime() + 13 * 60 * 60 * 1000), // 1:00 PM
      endTime: new Date(today.getTime() + 14.5 * 60 * 60 * 1000), // 2:30 PM
      status: "confirmed",
      notes: "",
      createdBy: 1
    });
    
    this.createAppointment({
      patientId: patient4.id,
      doctorId: doctor1.id,
      serviceId: service4.id,
      startTime: new Date(today.getTime() + 15.5 * 60 * 60 * 1000), // 3:30 PM
      endTime: new Date(today.getTime() + 16 * 60 * 60 * 1000), // 4:00 PM
      status: "confirmed",
      notes: "",
      createdBy: 1
    });
    
    // Add treatment plans
    this.createTreatmentPlan({
      patientId: patient5.id,
      doctorId: doctor1.id,
      title: "علاج تسوس متعدد",
      description: "علاج 4 أسنان مصابة بالتسوس",
      totalCost: 4800,
      startDate: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      endDate: new Date(today.getTime() + 40 * 24 * 60 * 60 * 1000), // 40 days later
      progress: 75
    });
    
    this.createTreatmentPlan({
      patientId: patient6.id,
      doctorId: doctor3.id,
      title: "تركيب تقويم مع متابعة",
      description: "تركيب تقويم شفاف مع 12 جلسة متابعة",
      totalCost: 15000,
      startDate: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      endDate: new Date(today.getTime() + 305 * 24 * 60 * 60 * 1000), // 305 days later
      progress: 100
    });
    
    this.createTreatmentPlan({
      patientId: patient7.id,
      doctorId: doctor2.id,
      title: "زراعة أسنان",
      description: "زراعة سنين مع التركيبات",
      totalCost: 12000,
      startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      endDate: new Date(today.getTime() + 150 * 24 * 60 * 60 * 1000), // 150 days later
      progress: 30
    });
    
    // Add financial transactions
    this.createFinancialTransaction({
      patientId: patient1.id,
      appointmentId: 1,
      amount: 8000,
      type: "income",
      category: "treatment fee",
      description: "دفعة أولى - تقويم أسنان",
      date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      createdBy: 1
    });
    
    this.createFinancialTransaction({
      patientId: patient2.id,
      appointmentId: 2,
      amount: 500,
      type: "income",
      category: "treatment fee",
      description: "تنظيف أسنان",
      date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      createdBy: 1
    });
    
    this.createFinancialTransaction({
      amount: 2000,
      type: "expense",
      category: "purchase",
      description: "شراء مواد استهلاكية",
      date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      createdBy: 1
    });
    
    // Add inventory consumption
    this.createInventoryConsumption({
      itemId: 1,
      appointmentId: 3,
      patientId: patient3.id,
      quantity: 1,
      usedBy: doctor3.id,
      notes: "استخدام لعلاج عصب"
    });
    
    this.createInventoryConsumption({
      itemId: 2,
      appointmentId: 3,
      patientId: patient3.id,
      quantity: 2,
      usedBy: doctor3.id,
      notes: "استخدام لعلاج عصب"
    });
    
    // Add WhatsApp messages
    this.createWhatsappMessage({
      patientId: patient1.id,
      appointmentId: 1,
      messageType: "appointment_reminder",
      message: "تذكير بموعدك غداً الساعة 10:00 صباحاً مع د. محمد علي",
      status: "sent",
      sentBy: 4
    });
    
    this.createWhatsappMessage({
      patientId: patient5.id,
      messageType: "followup",
      message: "كيف حالتك بعد الجلسة السابقة؟ هل هناك أي ألم أو انزعاج؟",
      status: "read",
      sentBy: 4
    });
    
    this.createWhatsappMessage({
      patientId: patient6.id,
      messageType: "payment_reminder",
      message: "تذكير بموعد دفع القسط المستحق بتاريخ 20/6/2023 بقيمة 2000 جنيه",
      status: "delivered",
      sentBy: 4
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  // Patient operations
  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.patientCurrentId++;
    const createdAt = new Date();
    const patient: Patient = { ...insertPatient, id, createdAt };
    this.patients.set(id, patient);
    return patient;
  }

  async updatePatient(id: number, patientData: Partial<InsertPatient>): Promise<Patient | undefined> {
    const patient = this.patients.get(id);
    if (!patient) return undefined;
    
    const updatedPatient = { ...patient, ...patientData };
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }

  async searchPatients(query: string): Promise<Patient[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.patients.values()).filter(patient => 
      patient.fullName.toLowerCase().includes(lowerQuery) || 
      patient.phoneNumber.includes(query)
    );
  }

  // Service operations
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.serviceCurrentId++;
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;
    
    const updatedService = { ...service, ...serviceData };
    this.services.set(id, updatedService);
    return updatedService;
  }

  // Inventory operations
  async getInventoryItem(id: number): Promise<InventoryItem | undefined> {
    return this.inventoryItems.get(id);
  }

  async getInventoryItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values());
  }

  async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const id = this.inventoryItemCurrentId++;
    const item: InventoryItem = { ...insertItem, id };
    this.inventoryItems.set(id, item);
    return item;
  }

  async updateInventoryItem(id: number, itemData: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const item = this.inventoryItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...itemData };
    this.inventoryItems.set(id, updatedItem);
    return updatedItem;
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values())
      .filter(item => item.quantity <= item.minQuantity);
  }

  // Appointment operations
  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return Array.from(this.appointments.values())
      .filter(appointment => 
        appointment.startTime >= startOfDay && 
        appointment.startTime <= endOfDay
      );
  }

  async getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.doctorId === doctorId);
  }

  async getAppointmentsByPatient(patientId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.patientId === patientId);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentCurrentId++;
    const createdAt = new Date();
    const appointment: Appointment = { ...insertAppointment, id, createdAt };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: number, appointmentData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    
    const updatedAppointment = { ...appointment, ...appointmentData };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  // Treatment plans operations
  async getTreatmentPlan(id: number): Promise<TreatmentPlan | undefined> {
    return this.treatmentPlans.get(id);
  }

  async getTreatmentPlansByPatient(patientId: number): Promise<TreatmentPlan[]> {
    return Array.from(this.treatmentPlans.values())
      .filter(plan => plan.patientId === patientId);
  }

  async createTreatmentPlan(insertPlan: InsertTreatmentPlan): Promise<TreatmentPlan> {
    const id = this.treatmentPlanCurrentId++;
    const createdAt = new Date();
    const plan: TreatmentPlan = { ...insertPlan, id, createdAt };
    this.treatmentPlans.set(id, plan);
    return plan;
  }

  async updateTreatmentPlan(id: number, planData: Partial<InsertTreatmentPlan>): Promise<TreatmentPlan | undefined> {
    const plan = this.treatmentPlans.get(id);
    if (!plan) return undefined;
    
    const updatedPlan = { ...plan, ...planData };
    this.treatmentPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  // Financial operations
  async getFinancialTransaction(id: number): Promise<FinancialTransaction | undefined> {
    return this.financialTransactions.get(id);
  }

  async getFinancialTransactions(): Promise<FinancialTransaction[]> {
    return Array.from(this.financialTransactions.values());
  }

  async getFinancialTransactionsByPatient(patientId: number): Promise<FinancialTransaction[]> {
    return Array.from(this.financialTransactions.values())
      .filter(transaction => transaction.patientId === patientId);
  }

  async createFinancialTransaction(insertTransaction: InsertFinancialTransaction): Promise<FinancialTransaction> {
    const id = this.financialTransactionCurrentId++;
    const transaction: FinancialTransaction = { ...insertTransaction, id };
    this.financialTransactions.set(id, transaction);
    return transaction;
  }

  // Inventory consumption operations
  async createInventoryConsumption(insertConsumption: InsertInventoryConsumption): Promise<InventoryConsumption> {
    const id = this.inventoryConsumptionCurrentId++;
    const usedAt = new Date();
    const consumption: InventoryConsumption = { ...insertConsumption, id, usedAt };
    this.inventoryConsumption.set(id, consumption);
    
    // Update inventory quantity
    const item = this.inventoryItems.get(insertConsumption.itemId);
    if (item) {
      item.quantity -= Number(insertConsumption.quantity);
      this.inventoryItems.set(item.id, item);
    }
    
    return consumption;
  }

  async getInventoryConsumptionByPatient(patientId: number): Promise<InventoryConsumption[]> {
    return Array.from(this.inventoryConsumption.values())
      .filter(consumption => consumption.patientId === patientId);
  }

  // WhatsApp operations
  async createWhatsappMessage(insertMessage: InsertWhatsappMessage): Promise<WhatsappMessage> {
    const id = this.whatsappMessageCurrentId++;
    const sentAt = new Date();
    const message: WhatsappMessage = { ...insertMessage, id, sentAt };
    this.whatsappMessages.set(id, message);
    return message;
  }

  async getWhatsappMessages(): Promise<WhatsappMessage[]> {
    return Array.from(this.whatsappMessages.values());
  }

  async getWhatsappMessagesByPatient(patientId: number): Promise<WhatsappMessage[]> {
    return Array.from(this.whatsappMessages.values())
      .filter(message => message.patientId === patientId);
  }

  // Analytics and KPIs
  async getMonthlyRevenue(): Promise<{ month: string; revenue: number }[]> {
    const today = new Date();
    const months = [];
    
    for (let i = 11; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleDateString('ar-EG', { month: 'short' });
      months.push({ month: monthName, revenue: 0 });
    }
    
    const transactions = Array.from(this.financialTransactions.values())
      .filter(transaction => transaction.type === 'income');
    
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

  async getPatientGrowth(): Promise<{ month: string; count: number }[]> {
    const today = new Date();
    const months = [];
    
    for (let i = 11; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleDateString('ar-EG', { month: 'short' });
      months.push({ month: monthName, count: 0 });
    }
    
    const patients = Array.from(this.patients.values());
    
    for (const patient of patients) {
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

  async getAppointmentStatusStats(): Promise<{ status: string; count: number }[]> {
    const stats = [
      { status: 'confirmed', count: 0 },
      { status: 'pending', count: 0 },
      { status: 'cancelled', count: 0 }
    ];
    
    const appointments = Array.from(this.appointments.values());
    
    for (const appointment of appointments) {
      const statusIndex = stats.findIndex(s => s.status === appointment.status);
      if (statusIndex !== -1) {
        stats[statusIndex].count += 1;
      }
    }
    
    return stats;
  }

  async getInventoryConsumptionStats(): Promise<{ item: string; quantity: number }[]> {
    const itemStats = new Map<string, number>();
    
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
}

export const storage = new MemStorage();
