// =============================================================================
// MNEXPharma — Mock Data (v2)
// Replace with real API responses when Laravel backend is ready
// =============================================================================

// ---------------------------------------------------------------------------
// 20 Suppliers
// ---------------------------------------------------------------------------
export const mockSuppliers = [
  { id: 1,  name: 'Square Pharmaceuticals Ltd',     contact: '+880-2-9884560', city: 'Dhaka',       email: 'sales@squarepharma.com.bd',    status: 'active',   rating: 5 },
  { id: 2,  name: 'Beximco Pharmaceuticals Ltd',    contact: '+880-2-9881966', city: 'Dhaka',       email: 'info@beximcopharma.com',        status: 'active',   rating: 5 },
  { id: 3,  name: 'Incepta Pharmaceuticals Ltd',    contact: '+880-2-7711444', city: 'Gazipur',     email: 'supply@inceptapharma.com',      status: 'active',   rating: 4 },
  { id: 4,  name: 'Opsonin Pharma Ltd',             contact: '+880-2-8836001', city: 'Chittagong',  email: 'orders@opsoninpharma.com',      status: 'inactive', rating: 3 },
  { id: 5,  name: 'ACI Pharmaceuticals Ltd',        contact: '+880-2-8835656', city: 'Dhaka',       email: 'trade@acipharma.com.bd',        status: 'active',   rating: 4 },
  { id: 6,  name: 'Renata Limited',                 contact: '+880-2-8836890', city: 'Dhaka',       email: 'sales@renata.com.bd',           status: 'active',   rating: 5 },
  { id: 7,  name: 'ACME Laboratories Ltd',          contact: '+880-2-9350050', city: 'Dhaka',       email: 'supply@acmelab.com.bd',         status: 'active',   rating: 4 },
  { id: 8,  name: 'Healthcare Pharmaceuticals Ltd', contact: '+880-2-9667543', city: 'Narayanganj', email: 'info@healthcarepharma.com.bd',  status: 'active',   rating: 3 },
  { id: 9,  name: 'General Pharmaceuticals Ltd',    contact: '+880-2-9552050', city: 'Dhaka',       email: 'orders@genpharma.com.bd',       status: 'active',   rating: 4 },
  { id: 10, name: 'Novo Nordisk Bangladesh',        contact: '+880-2-9887701', city: 'Dhaka',       email: 'bd.orders@novonordisk.com',     status: 'active',   rating: 5 },
  { id: 11, name: 'Aristopharma Ltd',               contact: '+880-2-8833010', city: 'Dhaka',       email: 'sales@aristopharma.com.bd',     status: 'active',   rating: 4 },
  { id: 12, name: 'Drug International Ltd',         contact: '+880-2-9344040', city: 'Dhaka',       email: 'info@druginternational.com.bd', status: 'active',   rating: 3 },
  { id: 13, name: 'Pacific Pharmaceuticals Ltd',    contact: '+880-2-9668440', city: 'Narayanganj', email: 'supply@pacificpharma.com.bd',   status: 'inactive', rating: 3 },
  { id: 14, name: 'Eskayef Bangladesh Ltd',         contact: '+880-2-8833540', city: 'Dhaka',       email: 'orders@eskayef.com.bd',         status: 'active',   rating: 4 },
  { id: 15, name: 'Nuvista Pharma Ltd',             contact: '+880-2-7793700', city: 'Dhaka',       email: 'sales@nuvistapharma.com.bd',    status: 'active',   rating: 4 },
  { id: 16, name: 'Radiant Pharmaceuticals Ltd',    contact: '+880-2-9550067', city: 'Dhaka',       email: 'info@radiantpharma.com.bd',     status: 'active',   rating: 3 },
  { id: 17, name: 'Orion Pharma Ltd',               contact: '+880-2-9861170', city: 'Dhaka',       email: 'supply@orionpharma.com.bd',     status: 'active',   rating: 4 },
  { id: 18, name: 'Ziska Pharmaceuticals Ltd',      contact: '+880-2-7789900', city: 'Dhaka',       email: 'orders@ziskapharma.com.bd',     status: 'inactive', rating: 2 },
  { id: 19, name: 'Ibn Sina Pharmaceutical',        contact: '+880-2-8833672', city: 'Dhaka',       email: 'sales@ibnsina.com.bd',          status: 'active',   rating: 4 },
  { id: 20, name: 'Popular Pharmaceuticals Ltd',    contact: '+880-2-7790330', city: 'Dhaka',       email: 'info@popularpharma.com.bd',     status: 'active',   rating: 3 },
]

// ---------------------------------------------------------------------------
// 50 Medicines  — enriched with batch, manufacturer, dosage_form, strength, description
// ---------------------------------------------------------------------------
export const mockMedicines = [
  // Analgesics
  { id: 1,  name: 'Paracetamol 500mg',        generic: 'Paracetamol',          category: 'Analgesic',      manufacturer: 'Square Pharmaceuticals',  batch: 'BT-SQ-24-001', dosage_form: 'Tablet',   strength: '500mg',   supplier_id: 1,  stock: 450,  reorder: 100, price: 5.00,   cost: 3.20,  expiry: '2026-12-01', status: 'active',   description: 'Used for mild to moderate pain and fever reduction.' },
  { id: 2,  name: 'Napa Extra 500mg',          generic: 'Paracetamol+Caffeine', category: 'Analgesic',      manufacturer: 'Beximco Pharmaceuticals', batch: 'BT-BX-24-002', dosage_form: 'Tablet',   strength: '500mg',   supplier_id: 2,  stock: 320,  reorder: 80,  price: 7.50,   cost: 4.80,  expiry: '2027-03-15', status: 'active',   description: 'Combination analgesic with caffeine for enhanced efficacy.' },
  { id: 3,  name: 'Ibuprofen 400mg',           generic: 'Ibuprofen',            category: 'Analgesic',      manufacturer: 'Incepta Pharmaceuticals', batch: 'BT-IN-24-003', dosage_form: 'Tablet',   strength: '400mg',   supplier_id: 3,  stock: 210,  reorder: 60,  price: 8.00,   cost: 5.10,  expiry: '2026-08-20', status: 'active',   description: 'NSAID used for pain, fever and inflammation.' },
  { id: 4,  name: 'Diclofenac 50mg',           generic: 'Diclofenac Sodium',    category: 'Analgesic',      manufacturer: 'ACI Pharmaceuticals',     batch: 'BT-AC-24-004', dosage_form: 'Tablet',   strength: '50mg',    supplier_id: 5,  stock: 38,   reorder: 50,  price: 6.00,   cost: 3.80,  expiry: '2026-11-30', status: 'active',   description: 'Anti-inflammatory used for arthritis and musculoskeletal pain.' },
  { id: 5,  name: 'Tramadol 50mg',             generic: 'Tramadol HCl',         category: 'Analgesic',      manufacturer: 'Renata Limited',          batch: 'BT-RE-23-005', dosage_form: 'Capsule',  strength: '50mg',    supplier_id: 6,  stock: 90,   reorder: 40,  price: 15.00,  cost: 9.50,  expiry: '2025-06-10', status: 'expired',  description: 'Opioid analgesic for moderate to severe pain.' },

  // Antibiotics
  { id: 6,  name: 'Amoxicillin 500mg',         generic: 'Amoxicillin',          category: 'Antibiotic',     manufacturer: 'Square Pharmaceuticals',  batch: 'BT-SQ-24-006', dosage_form: 'Capsule',  strength: '500mg',   supplier_id: 1,  stock: 185,  reorder: 60,  price: 18.50,  cost: 11.00, expiry: '2026-09-15', status: 'active',   description: 'Broad-spectrum penicillin antibiotic for bacterial infections.' },
  { id: 7,  name: 'Azithromycin 500mg',        generic: 'Azithromycin',         category: 'Antibiotic',     manufacturer: 'Beximco Pharmaceuticals', batch: 'BT-BX-24-007', dosage_form: 'Tablet',   strength: '500mg',   supplier_id: 2,  stock: 142,  reorder: 50,  price: 35.00,  cost: 22.00, expiry: '2027-01-20', status: 'active',   description: 'Macrolide antibiotic for respiratory tract infections.' },
  { id: 8,  name: 'Ciprofloxacin 500mg',       generic: 'Ciprofloxacin',        category: 'Antibiotic',     manufacturer: 'ACME Laboratories',       batch: 'BT-AM-24-008', dosage_form: 'Tablet',   strength: '500mg',   supplier_id: 7,  stock: 29,   reorder: 50,  price: 22.00,  cost: 14.00, expiry: '2026-07-31', status: 'active',   description: 'Fluoroquinolone antibiotic for urinary and respiratory infections.' },
  { id: 9,  name: 'Metronidazole 400mg',       generic: 'Metronidazole',        category: 'Antibiotic',     manufacturer: 'Incepta Pharmaceuticals', batch: 'BT-IN-23-009', dosage_form: 'Tablet',   strength: '400mg',   supplier_id: 3,  stock: 260,  reorder: 70,  price: 9.00,   cost: 5.50,  expiry: '2025-04-15', status: 'expired',  description: 'Antibiotic and antiprotozoal medication.' },
  { id: 10, name: 'Doxycycline 100mg',         generic: 'Doxycycline HCl',      category: 'Antibiotic',     manufacturer: 'Healthcare Pharma',       batch: 'BT-HC-24-010', dosage_form: 'Capsule',  strength: '100mg',   supplier_id: 8,  stock: 76,   reorder: 40,  price: 28.00,  cost: 17.50, expiry: '2026-10-05', status: 'active',   description: 'Tetracycline antibiotic for various bacterial infections.' },
  { id: 11, name: 'Cephalexin 500mg',          generic: 'Cephalexin',           category: 'Antibiotic',     manufacturer: 'Opsonin Pharma',          batch: 'BT-OP-24-011', dosage_form: 'Capsule',  strength: '500mg',   supplier_id: 4,  stock: 112,  reorder: 50,  price: 24.00,  cost: 15.00, expiry: '2027-02-28', status: 'active',   description: 'First-generation cephalosporin antibiotic.' },
  { id: 12, name: 'Clarithromycin 250mg',      generic: 'Clarithromycin',       category: 'Antibiotic',     manufacturer: 'Renata Limited',          batch: 'BT-RE-24-012', dosage_form: 'Tablet',   strength: '250mg',   supplier_id: 6,  stock: 18,   reorder: 40,  price: 45.00,  cost: 28.00, expiry: '2026-06-30', status: 'active',   description: 'Macrolide antibiotic for H. pylori and respiratory infections.' },

  // Antidiabetics
  { id: 13, name: 'Metformin 500mg',           generic: 'Metformin HCl',        category: 'Antidiabetic',   manufacturer: 'Novo Nordisk Bangladesh', batch: 'BT-NN-24-013', dosage_form: 'Tablet',   strength: '500mg',   supplier_id: 10, stock: 280,  reorder: 80,  price: 12.00,  cost: 7.50,  expiry: '2027-04-10', status: 'active',   description: 'First-line medication for type 2 diabetes.' },
  { id: 14, name: 'Metformin 1000mg',          generic: 'Metformin HCl',        category: 'Antidiabetic',   manufacturer: 'Novo Nordisk Bangladesh', batch: 'BT-NN-24-014', dosage_form: 'Tablet',   strength: '1000mg',  supplier_id: 10, stock: 190,  reorder: 60,  price: 20.00,  cost: 13.00, expiry: '2027-04-10', status: 'active',   description: 'Extended release Metformin for better glycemic control.' },
  { id: 15, name: 'Glibenclamide 5mg',         generic: 'Glibenclamide',        category: 'Antidiabetic',   manufacturer: 'Beximco Pharmaceuticals', batch: 'BT-BX-23-015', dosage_form: 'Tablet',   strength: '5mg',     supplier_id: 2,  stock: 95,   reorder: 40,  price: 8.50,   cost: 5.20,  expiry: '2026-03-20', status: 'expired',  description: 'Sulfonylurea for blood sugar control in type 2 diabetes.' },
  { id: 16, name: 'Sitagliptin 100mg',         generic: 'Sitagliptin',          category: 'Antidiabetic',   manufacturer: 'Novo Nordisk Bangladesh', batch: 'BT-NN-24-016', dosage_form: 'Tablet',   strength: '100mg',   supplier_id: 10, stock: 44,   reorder: 30,  price: 120.00, cost: 78.00, expiry: '2026-11-15', status: 'active',   description: 'DPP-4 inhibitor that improves glycemic control.' },
  { id: 17, name: 'Empagliflozin 10mg',        generic: 'Empagliflozin',        category: 'Antidiabetic',   manufacturer: 'Novo Nordisk Bangladesh', batch: 'BT-NN-24-017', dosage_form: 'Tablet',   strength: '10mg',    supplier_id: 10, stock: 31,   reorder: 25,  price: 180.00, cost: 115.00,expiry: '2027-06-01', status: 'active',   description: 'SGLT-2 inhibitor with cardiovascular protective benefits.' },

  // Cardiac
  { id: 18, name: 'Atorvastatin 10mg',         generic: 'Atorvastatin',         category: 'Cardiac',        manufacturer: 'Renata Limited',          batch: 'BT-RE-24-018', dosage_form: 'Tablet',   strength: '10mg',    supplier_id: 6,  stock: 0,    reorder: 50,  price: 22.00,  cost: 14.00, expiry: '2027-03-10', status: 'active',   description: 'Statin for lowering LDL cholesterol.' },
  { id: 19, name: 'Atorvastatin 40mg',         generic: 'Atorvastatin',         category: 'Cardiac',        manufacturer: 'Renata Limited',          batch: 'BT-RE-24-019', dosage_form: 'Tablet',   strength: '40mg',    supplier_id: 6,  stock: 88,   reorder: 40,  price: 38.00,  cost: 24.00, expiry: '2027-03-10', status: 'active',   description: 'High-dose statin therapy for high cardiovascular risk.' },
  { id: 20, name: 'Amlodipine 5mg',            generic: 'Amlodipine',           category: 'Cardiac',        manufacturer: 'Square Pharmaceuticals',  batch: 'BT-SQ-24-020', dosage_form: 'Tablet',   strength: '5mg',     supplier_id: 1,  stock: 175,  reorder: 60,  price: 10.00,  cost: 6.20,  expiry: '2027-05-25', status: 'active',   description: 'Calcium channel blocker for hypertension and angina.' },
  { id: 21, name: 'Losartan 50mg',             generic: 'Losartan Potassium',   category: 'Cardiac',        manufacturer: 'ACI Pharmaceuticals',     batch: 'BT-AC-24-021', dosage_form: 'Tablet',   strength: '50mg',    supplier_id: 5,  stock: 140,  reorder: 50,  price: 16.00,  cost: 10.00, expiry: '2026-12-15', status: 'active',   description: 'Angiotensin receptor blocker for hypertension.' },
  { id: 22, name: 'Bisoprolol 5mg',            generic: 'Bisoprolol',           category: 'Cardiac',        manufacturer: 'Incepta Pharmaceuticals', batch: 'BT-IN-24-022', dosage_form: 'Tablet',   strength: '5mg',     supplier_id: 3,  stock: 22,   reorder: 40,  price: 18.00,  cost: 11.50, expiry: '2026-09-01', status: 'active',   description: 'Beta-blocker for heart failure and hypertension.' },
  { id: 23, name: 'Clopidogrel 75mg',          generic: 'Clopidogrel',          category: 'Cardiac',        manufacturer: 'ACME Laboratories',       batch: 'BT-AM-23-023', dosage_form: 'Tablet',   strength: '75mg',    supplier_id: 7,  stock: 67,   reorder: 35,  price: 25.00,  cost: 16.00, expiry: '2025-08-10', status: 'expired',  description: 'Antiplatelet medication to prevent blood clots.' },

  // Antacids / GI
  { id: 24, name: 'Omeprazole 20mg',           generic: 'Omeprazole',           category: 'Antacid',        manufacturer: 'Square Pharmaceuticals',  batch: 'BT-SQ-24-024', dosage_form: 'Capsule',  strength: '20mg',    supplier_id: 1,  stock: 310,  reorder: 80,  price: 8.75,   cost: 5.50,  expiry: '2026-09-20', status: 'active',   description: 'Proton pump inhibitor for GERD and peptic ulcers.' },
  { id: 25, name: 'Esomeprazole 40mg',         generic: 'Esomeprazole',         category: 'Antacid',        manufacturer: 'Beximco Pharmaceuticals', batch: 'BT-BX-24-025', dosage_form: 'Capsule',  strength: '40mg',    supplier_id: 2,  stock: 220,  reorder: 60,  price: 15.00,  cost: 9.50,  expiry: '2027-01-10', status: 'active',   description: 'Next-generation PPI for acid-related disorders.' },
  { id: 26, name: 'Pantoprazole 40mg',         generic: 'Pantoprazole',         category: 'Antacid',        manufacturer: 'ACI Pharmaceuticals',     batch: 'BT-AC-24-026', dosage_form: 'Tablet',   strength: '40mg',    supplier_id: 5,  stock: 155,  reorder: 50,  price: 12.00,  cost: 7.80,  expiry: '2026-10-30', status: 'active',   description: 'Proton pump inhibitor for acid reflux treatment.' },
  { id: 27, name: 'Ranitidine 150mg',          generic: 'Ranitidine',           category: 'Antacid',        manufacturer: 'Healthcare Pharma',       batch: 'BT-HC-23-027', dosage_form: 'Tablet',   strength: '150mg',   supplier_id: 8,  stock: 14,   reorder: 50,  price: 5.50,   cost: 3.40,  expiry: '2025-05-01', status: 'expired',  description: 'H2 blocker for stomach acid reduction.' },
  { id: 28, name: 'Domperidone 10mg',          generic: 'Domperidone',          category: 'Antacid',        manufacturer: 'General Pharmaceuticals', batch: 'BT-GP-24-028', dosage_form: 'Tablet',   strength: '10mg',    supplier_id: 9,  stock: 188,  reorder: 60,  price: 7.00,   cost: 4.30,  expiry: '2026-08-15', status: 'active',   description: 'Dopamine antagonist for nausea and gastric motility.' },

  // Antihistamines / Allergy
  { id: 29, name: 'Cetirizine 10mg',           generic: 'Cetirizine HCl',       category: 'Antihistamine',  manufacturer: 'Square Pharmaceuticals',  batch: 'BT-SQ-24-029', dosage_form: 'Tablet',   strength: '10mg',    supplier_id: 1,  stock: 380,  reorder: 80,  price: 5.00,   cost: 3.10,  expiry: '2027-02-14', status: 'active',   description: 'Second-generation antihistamine for allergic rhinitis.' },
  { id: 30, name: 'Loratadine 10mg',           generic: 'Loratadine',           category: 'Antihistamine',  manufacturer: 'Incepta Pharmaceuticals', batch: 'BT-IN-24-030', dosage_form: 'Tablet',   strength: '10mg',    supplier_id: 3,  stock: 260,  reorder: 60,  price: 6.00,   cost: 3.70,  expiry: '2027-03-01', status: 'active',   description: 'Non-sedating antihistamine for allergy relief.' },
  { id: 31, name: 'Fexofenadine 120mg',        generic: 'Fexofenadine HCl',     category: 'Antihistamine',  manufacturer: 'Renata Limited',          batch: 'BT-RE-24-031', dosage_form: 'Tablet',   strength: '120mg',   supplier_id: 6,  stock: 42,   reorder: 40,  price: 18.00,  cost: 11.00, expiry: '2026-11-20', status: 'active',   description: 'Long-acting antihistamine for seasonal allergies.' },

  // Vitamins
  { id: 32, name: 'Vitamin C 500mg',           generic: 'Ascorbic Acid',        category: 'Vitamin',        manufacturer: 'Aristopharma Ltd',        batch: 'BT-AR-24-032', dosage_form: 'Tablet',   strength: '500mg',   supplier_id: 11, stock: 520,  reorder: 100, price: 4.00,   cost: 2.50,  expiry: '2027-06-30', status: 'active',   description: 'Essential vitamin for immune support and antioxidant protection.' },
  { id: 33, name: 'Vitamin D3 1000IU',         generic: 'Cholecalciferol',      category: 'Vitamin',        manufacturer: 'Drug International',      batch: 'BT-DI-24-033', dosage_form: 'Capsule',  strength: '1000IU',  supplier_id: 12, stock: 340,  reorder: 80,  price: 10.00,  cost: 6.20,  expiry: '2027-04-15', status: 'active',   description: 'Vitamin D3 for bone health and immune function.' },
  { id: 34, name: 'B-Complex Forte',           generic: 'Vitamin B Complex',    category: 'Vitamin',        manufacturer: 'General Pharmaceuticals', batch: 'BT-GP-24-034', dosage_form: 'Tablet',   strength: 'Multi',   supplier_id: 9,  stock: 285,  reorder: 70,  price: 12.00,  cost: 7.50,  expiry: '2026-07-20', status: 'active',   description: 'Complete B-vitamin complex for neurological health.' },
  { id: 35, name: 'Calcium + D3 500mg',        generic: 'Calcium Carbonate',    category: 'Vitamin',        manufacturer: 'Aristopharma Ltd',        batch: 'BT-AR-24-035', dosage_form: 'Tablet',   strength: '500mg',   supplier_id: 11, stock: 19,   reorder: 50,  price: 14.00,  cost: 8.80,  expiry: '2026-10-10', status: 'active',   description: 'Calcium supplement with Vitamin D3 for bone density.' },
  { id: 36, name: 'Zinc 20mg',                 generic: 'Zinc Sulphate',        category: 'Vitamin',        manufacturer: 'Pacific Pharmaceuticals', batch: 'BT-PC-24-036', dosage_form: 'Tablet',   strength: '20mg',    supplier_id: 13, stock: 165,  reorder: 50,  price: 6.00,   cost: 3.70,  expiry: '2027-01-05', status: 'active',   description: 'Zinc supplement for immune function and wound healing.' },

  // Respiratory
  { id: 37, name: 'Salbutamol 2mg',            generic: 'Salbutamol',           category: 'Respiratory',    manufacturer: 'ACI Pharmaceuticals',     batch: 'BT-AC-24-037', dosage_form: 'Tablet',   strength: '2mg',     supplier_id: 5,  stock: 130,  reorder: 50,  price: 5.50,   cost: 3.40,  expiry: '2026-12-20', status: 'active',   description: 'Short-acting bronchodilator for asthma relief.' },
  { id: 38, name: 'Montelukast 10mg',          generic: 'Montelukast Sodium',   category: 'Respiratory',    manufacturer: 'ACME Laboratories',       batch: 'BT-AM-24-038', dosage_form: 'Tablet',   strength: '10mg',    supplier_id: 7,  stock: 75,   reorder: 40,  price: 30.00,  cost: 19.00, expiry: '2027-02-01', status: 'active',   description: 'Leukotriene receptor antagonist for asthma prevention.' },
  { id: 39, name: 'Fluticasone Inhaler 50mcg', generic: 'Fluticasone',          category: 'Respiratory',    manufacturer: 'Eskayef Bangladesh',      batch: 'BT-ES-23-039', dosage_form: 'Inhaler',  strength: '50mcg',   supplier_id: 14, stock: 8,    reorder: 20,  price: 280.00, cost: 185.00,expiry: '2026-05-15', status: 'expired',  description: 'Inhaled corticosteroid for persistent asthma.' },
  { id: 40, name: 'Bromhexine 8mg',            generic: 'Bromhexine HCl',       category: 'Respiratory',    manufacturer: 'General Pharmaceuticals', batch: 'BT-GP-24-040', dosage_form: 'Tablet',   strength: '8mg',     supplier_id: 9,  stock: 200,  reorder: 60,  price: 6.00,   cost: 3.80,  expiry: '2026-10-30', status: 'active',   description: 'Mucolytic agent for productive cough.' },

  // Neurological
  { id: 41, name: 'Amlodipine 10mg',           generic: 'Amlodipine',           category: 'Neurological',   manufacturer: 'Square Pharmaceuticals',  batch: 'BT-SQ-24-041', dosage_form: 'Tablet',   strength: '10mg',    supplier_id: 1,  stock: 95,   reorder: 40,  price: 14.00,  cost: 8.80,  expiry: '2027-05-25', status: 'active',   description: 'Higher dose calcium channel blocker.' },
  { id: 42, name: 'Pregabalin 75mg',           generic: 'Pregabalin',           category: 'Neurological',   manufacturer: 'Nuvista Pharma',          batch: 'BT-NV-24-042', dosage_form: 'Capsule',  strength: '75mg',    supplier_id: 15, stock: 55,   reorder: 30,  price: 55.00,  cost: 35.00, expiry: '2026-11-10', status: 'active',   description: 'Anticonvulsant for neuropathic pain and epilepsy.' },
  { id: 43, name: 'Gabapentin 300mg',          generic: 'Gabapentin',           category: 'Neurological',   manufacturer: 'Nuvista Pharma',          batch: 'BT-NV-24-043', dosage_form: 'Capsule',  strength: '300mg',   supplier_id: 15, stock: 40,   reorder: 30,  price: 42.00,  cost: 26.50, expiry: '2026-09-30', status: 'active',   description: 'Anticonvulsant for postherpetic neuralgia.' },

  // Ophthalmic
  { id: 44, name: 'Ciprofloxacin Eye Drop',    generic: 'Ciprofloxacin',        category: 'Ophthalmic',     manufacturer: 'Radiant Pharmaceuticals', batch: 'BT-RA-24-044', dosage_form: 'Eye Drop', strength: '0.3%',    supplier_id: 16, stock: 65,   reorder: 25,  price: 45.00,  cost: 28.00, expiry: '2026-08-01', status: 'active',   description: 'Antibiotic eye drops for bacterial conjunctivitis.' },
  { id: 45, name: 'Timolol Eye Drop 0.5%',    generic: 'Timolol Maleate',      category: 'Ophthalmic',     manufacturer: 'Radiant Pharmaceuticals', batch: 'BT-RA-23-045', dosage_form: 'Eye Drop', strength: '0.5%',    supplier_id: 16, stock: 30,   reorder: 20,  price: 60.00,  cost: 38.00, expiry: '2025-10-20', status: 'expired',  description: 'Beta-blocker eye drops for intraocular pressure.' },

  // Dermatology
  { id: 46, name: 'Clotrimazole Cream 1%',    generic: 'Clotrimazole',         category: 'Dermatology',    manufacturer: 'Orion Pharma',            batch: 'BT-OR-24-046', dosage_form: 'Cream',    strength: '1%',      supplier_id: 17, stock: 110,  reorder: 40,  price: 35.00,  cost: 22.00, expiry: '2027-01-15', status: 'active',   description: 'Antifungal cream for tinea and candidal infections.' },
  { id: 47, name: 'Betamethasone Cream 0.1%', generic: 'Betamethasone',        category: 'Dermatology',    manufacturer: 'Orion Pharma',            batch: 'BT-OR-24-047', dosage_form: 'Cream',    strength: '0.1%',    supplier_id: 17, stock: 78,   reorder: 30,  price: 28.00,  cost: 17.50, expiry: '2026-10-05', status: 'active',   description: 'Corticosteroid cream for inflammatory skin conditions.' },

  // Hormonal
  { id: 48, name: 'Levothyroxine 50mcg',      generic: 'Levothyroxine',        category: 'Hormonal',       manufacturer: 'Ziska Pharmaceuticals',   batch: 'BT-ZS-24-048', dosage_form: 'Tablet',   strength: '50mcg',   supplier_id: 18, stock: 120,  reorder: 50,  price: 20.00,  cost: 12.50, expiry: '2026-12-31', status: 'active',   description: 'Thyroid hormone replacement therapy.' },
  { id: 49, name: 'Prednisolone 5mg',         generic: 'Prednisolone',         category: 'Corticosteroid', manufacturer: 'Ibn Sina Pharmaceutical', batch: 'BT-IS-24-049', dosage_form: 'Tablet',   strength: '5mg',     supplier_id: 19, stock: 165,  reorder: 50,  price: 8.00,   cost: 5.00,  expiry: '2027-03-20', status: 'active',   description: 'Corticosteroid for inflammation and immune suppression.' },
  { id: 50, name: 'Hydrocortisone 10mg',      generic: 'Hydrocortisone',       category: 'Corticosteroid', manufacturer: 'Popular Pharmaceuticals', batch: 'BT-PP-23-050', dosage_form: 'Tablet',   strength: '10mg',    supplier_id: 20, stock: 0,    reorder: 30,  price: 12.00,  cost: 7.50,  expiry: '2025-02-28', status: 'expired',  description: 'Corticosteroid for adrenal insufficiency.' },
]

// ---------------------------------------------------------------------------
// Categories derived from medicines
// ---------------------------------------------------------------------------
export const medicineCategories = [...new Set(mockMedicines.map(m => m.category))].sort()

// ---------------------------------------------------------------------------
// Inventory activity timeline
// ---------------------------------------------------------------------------
export const inventoryTimeline = [
  { id: 1,  type: 'received',    medicine: 'Paracetamol 500mg',    qty: +200, user: 'Roni Ahmed',    date: '2026-06-23 09:15', note: 'PO-2026-045 received'              },
  { id: 2,  type: 'dispensed',   medicine: 'Azithromycin 500mg',   qty: -12,  user: 'Sadia Rahman',  date: '2026-06-23 08:50', note: 'Sold via INV-2026-0100'            },
  { id: 3,  type: 'adjustment',  medicine: 'Metformin 500mg',      qty: +50,  user: 'Roni Ahmed',    date: '2026-06-22 17:30', note: 'Stock count correction'            },
  { id: 4,  type: 'disposed',    medicine: 'Ranitidine 150mg',     qty: -14,  user: 'Jahidul Islam', date: '2026-06-22 15:00', note: 'Expired batch disposal'           },
  { id: 5,  type: 'received',    medicine: 'Cetirizine 10mg',      qty: +150, user: 'Roni Ahmed',    date: '2026-06-22 11:20', note: 'PO-2026-044 received'              },
  { id: 6,  type: 'dispensed',   medicine: 'Omeprazole 20mg',      qty: -24,  user: 'Sadia Rahman',  date: '2026-06-22 10:05', note: 'Multiple sales'                    },
  { id: 7,  type: 'low_stock',   medicine: 'Bisoprolol 5mg',       qty: 0,    user: 'System',        date: '2026-06-21 23:59', note: 'Auto alert: below reorder level'   },
  { id: 8,  type: 'received',    medicine: 'Vitamin C 500mg',      qty: +100, user: 'Jahidul Islam', date: '2026-06-21 14:45', note: 'PO-2026-043 partial delivery'      },
  { id: 9,  type: 'adjustment',  medicine: 'Ibuprofen 400mg',      qty: -5,   user: 'Roni Ahmed',    date: '2026-06-20 16:30', note: 'Damaged units removed'             },
  { id: 10, type: 'disposed',    medicine: 'Tramadol 50mg',        qty: -90,  user: 'Jahidul Islam', date: '2026-06-20 10:00', note: 'Expired stock disposed per DGDA'   },
]

// ---------------------------------------------------------------------------
// Customer names pool
// ---------------------------------------------------------------------------
const customers = [
  'Rahim Uddin','Fatema Begum','Karim Hossain','Nasrin Akter','Jamal Ahmed',
  'Sumaiya Islam','Rafiqul Islam','Taslima Khatun','Shahidul Haque','Roksana Parvin',
  'Mizanur Rahman','Sharmin Sultana','Anwar Hossain','Bilkis Begum','Mamun Hossain',
  'Nipa Akter','Sohel Rana','Arifa Khatun','Delwar Hossain','Kohinoor Begum',
  'Walk-in Patient','Walk-in Patient','Walk-in Patient','Walk-in Patient',
]

function rand(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(2)
}

// ---------------------------------------------------------------------------
// 100 Sales Records
// ---------------------------------------------------------------------------
function generateSales() {
  const statuses = ['paid', 'paid', 'paid', 'paid', 'pending', 'refunded']
  const now = new Date('2026-06-23')
  const sales = []

  for (let i = 1; i <= 100; i++) {
    const daysAgo = Math.floor(Math.random() * 180)
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)
    const items   = Math.floor(Math.random() * 5) + 1
    const amount  = rand(150, 4500)
    const discount = rand(0, amount * 0.1)
    const total   = +(amount - discount).toFixed(2)
    sales.push({
      id: `INV-2026-${String(i).padStart(4, '0')}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      items, amount, discount, total,
      date: date.toISOString().slice(0, 10),
      time: date.toISOString().slice(11, 16),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      payment: ['Cash', 'Card', 'Mobile Banking'][Math.floor(Math.random() * 3)],
    })
  }
  return sales.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export const mockSales = generateSales()

// ---------------------------------------------------------------------------
// Dashboard stat cards
// ---------------------------------------------------------------------------
export const mockStats = [
  { id: 1, label: 'Registered Medicines', value: '50',  icon: 'BeakerIcon',             color: 'brand',  sub: 'In active formulary' },
  { id: 2, label: 'Recorded Sales',       value: '100', icon: 'ShoppingCartIcon',       color: 'blue',   sub: 'Total billing records' },
  {
    id: 3,
    label: 'Total Revenue',
    value: '৳ ' + mockSales.reduce((s, r) => s + r.total, 0).toLocaleString('en-US', { maximumFractionDigits: 0 }),
    icon: 'CurrencyDollarIcon', color: 'green', sub: 'Cumulative sales value'
  },
  { id: 4, label: 'Reorder Required',   value: String(mockMedicines.filter(m => m.stock > 0 && m.stock < m.reorder).length), icon: 'ExclamationTriangleIcon', color: 'amber', sub: 'Below reorder level' },
  { id: 5, label: 'Expired Inventory',  value: String(mockMedicines.filter(m => m.status === 'expired').length),              icon: 'XCircleIcon',            color: 'red',   sub: 'Requires disposal' },
  { id: 6, label: 'Active Suppliers',   value: String(mockSuppliers.filter(s => s.status === 'active').length),               icon: 'TruckIcon',              color: 'purple', sub: `${mockSuppliers.length} registered` },
]

// ---------------------------------------------------------------------------
// Chart data
// ---------------------------------------------------------------------------
export const monthlySalesData = (() => {
  const months = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun']
  const salesByMonth = Array(12).fill(0)
  const revenueByMonth = Array(12).fill(0)
  const baseMonth = 6
  mockSales.forEach(sale => {
    const d = new Date(sale.date)
    const monthIdx = ((d.getMonth() - baseMonth + 12) % 12)
    salesByMonth[monthIdx]++
    revenueByMonth[monthIdx] += sale.total
  })
  return { labels: months, sales: salesByMonth, revenue: revenueByMonth.map(v => +v.toFixed(0)) }
})()

export const salesByCategoryData = (() => {
  const categories = [...new Set(mockMedicines.map(m => m.category))]
  const counts = categories.map(() => Math.floor(Math.random() * 30) + 5)
  return { labels: categories, data: counts }
})()

// ---------------------------------------------------------------------------
// Derived views
// ---------------------------------------------------------------------------
export const mockRecentSales       = mockSales.slice(0, 10)
export const mockLowStock          = mockMedicines.filter(m => m.stock > 0 && m.stock < m.reorder).sort((a,b) => a.stock - b.stock)
export const mockExpiredMedicines  = mockMedicines.filter(m => m.status === 'expired')

export const mockNotifications = [
  { id: 1, type: 'danger',  title: 'Expired Medicines Alert', body: `${mockMedicines.filter(m=>m.status==='expired').length} medicines have expired and need immediate removal.`, time: '5 min ago',  read: false },
  { id: 2, type: 'warning', title: 'Low Stock Warning',       body: `${mockMedicines.filter(m=>m.stock>0&&m.stock<m.reorder).length} medicines are below reorder levels.`,        time: '20 min ago', read: false },
  { id: 3, type: 'info',    title: 'New Purchase Order',      body: 'PO #PO-2026-045 from Square Pharmaceuticals has been received.',                                               time: '2 hrs ago',  read: true  },
  { id: 4, type: 'success', title: 'Inventory Reconciled',    body: 'Monthly stock reconciliation completed with 0 discrepancies.',                                                  time: 'Yesterday',  read: true  },
  { id: 5, type: 'warning', title: 'Payment Overdue',         body: 'Invoice INV-2026-0042 from Opsonin Pharma is 7 days overdue.',                                                  time: '2 days ago', read: true  },
]

// ---------------------------------------------------------------------------
// Mock Customers (30 records)
// ---------------------------------------------------------------------------
export const mockCustomers = [
  { id: 1,  name: 'Rahim Uddin',       phone: '01711-100001', email: 'rahim@gmail.com',      address: 'Mirpur-10, Dhaka',          total_purchases: 12400, loyalty_points: 620, visits: 18, last_visit: '2026-06-22', status: 'active',   type: 'returning' },
  { id: 2,  name: 'Fatema Begum',      phone: '01711-100002', email: 'fatema@yahoo.com',      address: 'Uttara, Dhaka',             total_purchases: 8750,  loyalty_points: 437, visits: 12, last_visit: '2026-06-20', status: 'active',   type: 'returning' },
  { id: 3,  name: 'Karim Hossain',     phone: '01711-100003', email: 'karim@gmail.com',       address: 'Gulshan-2, Dhaka',          total_purchases: 31200, loyalty_points: 1560,visits: 34, last_visit: '2026-06-23', status: 'active',   type: 'returning' },
  { id: 4,  name: 'Nasrin Akter',      phone: '01711-100004', email: 'nasrin@hotmail.com',    address: 'Mohammadpur, Dhaka',        total_purchases: 5400,  loyalty_points: 270, visits: 7,  last_visit: '2026-06-15', status: 'active',   type: 'returning' },
  { id: 5,  name: 'Jamal Ahmed',       phone: '01711-100005', email: 'jamal@gmail.com',       address: 'Banani, Dhaka',             total_purchases: 19800, loyalty_points: 990, visits: 22, last_visit: '2026-06-21', status: 'active',   type: 'returning' },
  { id: 6,  name: 'Sumaiya Islam',     phone: '01711-100006', email: 'sumaiya@gmail.com',     address: 'Dhanmondi, Dhaka',          total_purchases: 3200,  loyalty_points: 160, visits: 4,  last_visit: '2026-06-10', status: 'active',   type: 'new'       },
  { id: 7,  name: 'Rafiqul Islam',     phone: '01711-100007', email: 'rafiq@yahoo.com',       address: 'Motijheel, Dhaka',          total_purchases: 14500, loyalty_points: 725, visits: 16, last_visit: '2026-06-18', status: 'active',   type: 'returning' },
  { id: 8,  name: 'Taslima Khatun',    phone: '01711-100008', email: 'taslima@gmail.com',     address: 'Rayer Bazar, Dhaka',        total_purchases: 6700,  loyalty_points: 335, visits: 9,  last_visit: '2026-06-12', status: 'active',   type: 'returning' },
  { id: 9,  name: 'Shahidul Haque',    phone: '01711-100009', email: 'shahidul@gmail.com',    address: 'Wari, Dhaka',               total_purchases: 42300, loyalty_points: 2115,visits: 51, last_visit: '2026-06-22', status: 'active',   type: 'returning' },
  { id: 10, name: 'Roksana Parvin',    phone: '01711-100010', email: 'roksana@hotmail.com',   address: 'Lalbagh, Dhaka',            total_purchases: 2100,  loyalty_points: 105, visits: 3,  last_visit: '2026-06-05', status: 'active',   type: 'new'       },
  { id: 11, name: 'Mizanur Rahman',    phone: '01711-100011', email: 'mizan@gmail.com',       address: 'Savar, Dhaka',              total_purchases: 9800,  loyalty_points: 490, visits: 14, last_visit: '2026-06-19', status: 'active',   type: 'returning' },
  { id: 12, name: 'Sharmin Sultana',   phone: '01711-100012', email: 'sharmin@yahoo.com',     address: 'Narayanganj',               total_purchases: 16200, loyalty_points: 810, visits: 19, last_visit: '2026-06-17', status: 'active',   type: 'returning' },
  { id: 13, name: 'Anwar Hossain',     phone: '01711-100013', email: 'anwar@gmail.com',       address: 'Gazipur',                   total_purchases: 7300,  loyalty_points: 365, visits: 10, last_visit: '2026-06-14', status: 'active',   type: 'returning' },
  { id: 14, name: 'Bilkis Begum',      phone: '01711-100014', email: 'bilkis@gmail.com',      address: 'Sylhet',                    total_purchases: 4600,  loyalty_points: 230, visits: 6,  last_visit: '2026-06-08', status: 'active',   type: 'new'       },
  { id: 15, name: 'Mamun Hossain',     phone: '01711-100015', email: 'mamun@hotmail.com',     address: 'Chittagong',                total_purchases: 28700, loyalty_points: 1435,visits: 30, last_visit: '2026-06-20', status: 'active',   type: 'returning' },
  { id: 16, name: 'Nipa Akter',        phone: '01711-100016', email: 'nipa@gmail.com',        address: 'Comilla',                   total_purchases: 1800,  loyalty_points: 90,  visits: 2,  last_visit: '2026-06-01', status: 'active',   type: 'new'       },
  { id: 17, name: 'Sohel Rana',        phone: '01711-100017', email: 'sohel@yahoo.com',       address: 'Rajshahi',                  total_purchases: 11200, loyalty_points: 560, visits: 13, last_visit: '2026-06-16', status: 'active',   type: 'returning' },
  { id: 18, name: 'Arifa Khatun',      phone: '01711-100018', email: 'arifa@gmail.com',       address: 'Khulna',                    total_purchases: 5900,  loyalty_points: 295, visits: 8,  last_visit: '2026-06-11', status: 'active',   type: 'returning' },
  { id: 19, name: 'Delwar Hossain',    phone: '01711-100019', email: 'delwar@gmail.com',      address: 'Barisal',                   total_purchases: 3700,  loyalty_points: 185, visits: 5,  last_visit: '2026-06-07', status: 'inactive', type: 'new'       },
  { id: 20, name: 'Kohinoor Begum',    phone: '01711-100020', email: 'kohinoor@hotmail.com',  address: 'Mymensingh',                total_purchases: 22100, loyalty_points: 1105,visits: 26, last_visit: '2026-06-21', status: 'active',   type: 'returning' },
  { id: 21, name: 'Tariqul Islam',     phone: '01711-100021', email: 'tariq@gmail.com',       address: 'Bogura',                    total_purchases: 8400,  loyalty_points: 420, visits: 11, last_visit: '2026-06-13', status: 'active',   type: 'returning' },
  { id: 22, name: 'Hasina Akter',      phone: '01711-100022', email: 'hasina@yahoo.com',      address: 'Rangpur',                   total_purchases: 6100,  loyalty_points: 305, visits: 8,  last_visit: '2026-06-09', status: 'active',   type: 'returning' },
  { id: 23, name: 'Monjur Hossain',    phone: '01711-100023', email: 'monjur@gmail.com',      address: 'Tangail',                   total_purchases: 1200,  loyalty_points: 60,  visits: 2,  last_visit: '2026-05-28', status: 'active',   type: 'new'       },
  { id: 24, name: 'Salma Begum',       phone: '01711-100024', email: 'salma@gmail.com',       address: 'Faridpur',                  total_purchases: 15600, loyalty_points: 780, visits: 18, last_visit: '2026-06-18', status: 'active',   type: 'returning' },
  { id: 25, name: 'Jahangir Alam',     phone: '01711-100025', email: 'jahangir@hotmail.com',  address: 'Jessore',                   total_purchases: 9300,  loyalty_points: 465, visits: 12, last_visit: '2026-06-15', status: 'active',   type: 'returning' },
  { id: 26, name: 'Lovely Akter',      phone: '01711-100026', email: 'lovely@gmail.com',      address: 'Noakhali',                  total_purchases: 4400,  loyalty_points: 220, visits: 6,  last_visit: '2026-06-06', status: 'active',   type: 'new'       },
  { id: 27, name: 'Masud Rana',        phone: '01711-100027', email: 'masud@yahoo.com',       address: 'Brahmanbaria',              total_purchases: 18900, loyalty_points: 945, visits: 21, last_visit: '2026-06-20', status: 'active',   type: 'returning' },
  { id: 28, name: 'Ruma Khatun',       phone: '01711-100028', email: 'ruma@gmail.com',        address: 'Feni',                      total_purchases: 7800,  loyalty_points: 390, visits: 10, last_visit: '2026-06-13', status: 'active',   type: 'returning' },
  { id: 29, name: 'Ariful Islam',      phone: '01711-100029', email: 'ariful@gmail.com',      address: 'Cox\'s Bazar',              total_purchases: 2900,  loyalty_points: 145, visits: 4,  last_visit: '2026-06-03', status: 'inactive', type: 'new'       },
  { id: 30, name: 'Munira Sultana',    phone: '01711-100030', email: 'munira@hotmail.com',    address: 'Dinajpur',                  total_purchases: 11700, loyalty_points: 585, visits: 14, last_visit: '2026-06-17', status: 'active',   type: 'returning' },
]

// ---------------------------------------------------------------------------
// Mock Prescriptions (20 records)
// ---------------------------------------------------------------------------
const rxMedicines = [
  ['Paracetamol 500mg', 'Omeprazole 20mg', 'Vitamin C 500mg'],
  ['Amoxicillin 500mg', 'Domperidone 10mg'],
  ['Metformin 500mg', 'Atorvastatin 10mg', 'Amlodipine 5mg', 'Losartan 50mg'],
  ['Azithromycin 500mg', 'Cetirizine 10mg', 'Bromhexine 8mg'],
  ['Ciprofloxacin 500mg', 'Metronidazole 400mg'],
  ['Prednisolone 5mg', 'Calcium + D3 500mg', 'Vitamin D3 1000IU'],
  ['Montelukast 10mg', 'Salbutamol 2mg'],
  ['Ibuprofen 400mg', 'Esomeprazole 40mg'],
  ['Levothyroxine 50mcg'],
  ['Pregabalin 75mg', 'Vitamin B Complex'],
]

export const mockPrescriptions = [
  { id: 'RX-2026-001', patient: 'Rahim Uddin',    patient_phone: '01711-100001', doctor: 'Dr. Sumaiya Islam',   doctor_specialty: 'General Physician',  date: '2026-06-23', status: 'dispensed', medicines: rxMedicines[0], notes: 'Take after meals. Complete full course.',          pharmacist: 'Roni Ahmed'   },
  { id: 'RX-2026-002', patient: 'Fatema Begum',   patient_phone: '01711-100002', doctor: 'Dr. Arif Hasan',      doctor_specialty: 'Cardiologist',        date: '2026-06-23', status: 'pending',   medicines: rxMedicines[2], notes: 'Monitor blood pressure daily.',                    pharmacist: null           },
  { id: 'RX-2026-003', patient: 'Karim Hossain',  patient_phone: '01711-100003', doctor: 'Dr. Nasrin Akter',    doctor_specialty: 'Endocrinologist',     date: '2026-06-22', status: 'verified',  medicines: rxMedicines[3], notes: 'Check HbA1c after 3 months.',                      pharmacist: 'Sadia Rahman' },
  { id: 'RX-2026-004', patient: 'Nasrin Akter',   patient_phone: '01711-100004', doctor: 'Dr. Sumaiya Islam',   doctor_specialty: 'General Physician',  date: '2026-06-22', status: 'dispensed', medicines: rxMedicines[1], notes: 'Complete 5-day antibiotic course.',                pharmacist: 'Roni Ahmed'   },
  { id: 'RX-2026-005', patient: 'Jamal Ahmed',    patient_phone: '01711-100005', doctor: 'Dr. Tanvir Hossain',  doctor_specialty: 'Pulmonologist',       date: '2026-06-21', status: 'verified',  medicines: rxMedicines[6], notes: 'Use inhaler as needed. Avoid triggers.',           pharmacist: 'Sadia Rahman' },
  { id: 'RX-2026-006', patient: 'Sumaiya Islam',  patient_phone: '01711-100006', doctor: 'Dr. Rania Chowdhury', doctor_specialty: 'Dermatologist',       date: '2026-06-21', status: 'pending',   medicines: rxMedicines[5], notes: 'Apply cream twice daily on affected area.',        pharmacist: null           },
  { id: 'RX-2026-007', patient: 'Rafiqul Islam',  patient_phone: '01711-100007', doctor: 'Dr. Arif Hasan',      doctor_specialty: 'Cardiologist',        date: '2026-06-20', status: 'dispensed', medicines: rxMedicines[2], notes: 'Low sodium diet recommended.',                     pharmacist: 'Puja Sarkar'  },
  { id: 'RX-2026-008', patient: 'Taslima Khatun', patient_phone: '01711-100008', doctor: 'Dr. Sumaiya Islam',   doctor_specialty: 'General Physician',  date: '2026-06-20', status: 'dispensed', medicines: rxMedicines[7], notes: 'Take with food. Avoid alcohol.',                   pharmacist: 'Roni Ahmed'   },
  { id: 'RX-2026-009', patient: 'Shahidul Haque', patient_phone: '01711-100009', doctor: 'Dr. Nasrin Akter',    doctor_specialty: 'Endocrinologist',     date: '2026-06-19', status: 'verified',  medicines: rxMedicines[2], notes: 'Fasting glucose check weekly.',                    pharmacist: 'Sadia Rahman' },
  { id: 'RX-2026-010', patient: 'Mizanur Rahman', patient_phone: '01711-100011', doctor: 'Dr. Tanvir Hossain',  doctor_specialty: 'Pulmonologist',       date: '2026-06-19', status: 'pending',   medicines: rxMedicines[6], notes: 'Spirometry test scheduled for next visit.',        pharmacist: null           },
  { id: 'RX-2026-011', patient: 'Sharmin Sultana',patient_phone: '01711-100012', doctor: 'Dr. Sumaiya Islam',   doctor_specialty: 'General Physician',  date: '2026-06-18', status: 'dispensed', medicines: rxMedicines[4], notes: 'Rest and fluid intake. Follow up in 7 days.',     pharmacist: 'Puja Sarkar'  },
  { id: 'RX-2026-012', patient: 'Anwar Hossain',  patient_phone: '01711-100013', doctor: 'Dr. Arif Hasan',      doctor_specialty: 'Cardiologist',        date: '2026-06-18', status: 'dispensed', medicines: rxMedicines[2], notes: 'ECG next visit.',                                  pharmacist: 'Roni Ahmed'   },
  { id: 'RX-2026-013', patient: 'Mamun Hossain',  patient_phone: '01711-100015', doctor: 'Dr. Rania Chowdhury', doctor_specialty: 'Dermatologist',       date: '2026-06-17', status: 'verified',  medicines: rxMedicines[5], notes: 'Avoid sun exposure. Use SPF 50.',                  pharmacist: 'Sadia Rahman' },
  { id: 'RX-2026-014', patient: 'Sohel Rana',     patient_phone: '01711-100017', doctor: 'Dr. Nasrin Akter',    doctor_specialty: 'Endocrinologist',     date: '2026-06-17', status: 'pending',   medicines: rxMedicines[3], notes: 'Diet counselling provided.',                       pharmacist: null           },
  { id: 'RX-2026-015', patient: 'Sharmin Sultana',patient_phone: '01711-100012', doctor: 'Dr. Sumaiya Islam',   doctor_specialty: 'General Physician',  date: '2026-06-16', status: 'dispensed', medicines: rxMedicines[0], notes: 'Paracetamol PRN for fever > 38.5°C.',             pharmacist: 'Puja Sarkar'  },
  { id: 'RX-2026-016', patient: 'Kohinoor Begum', patient_phone: '01711-100020', doctor: 'Dr. Arif Hasan',      doctor_specialty: 'Cardiologist',        date: '2026-06-15', status: 'dispensed', medicines: rxMedicines[2], notes: 'Lipid profile recheck in 3 months.',               pharmacist: 'Roni Ahmed'   },
  { id: 'RX-2026-017', patient: 'Masud Rana',     patient_phone: '01711-100027', doctor: 'Dr. Tanvir Hossain',  doctor_specialty: 'Pulmonologist',       date: '2026-06-14', status: 'dispensed', medicines: rxMedicines[6], notes: 'Peak flow monitoring daily.',                      pharmacist: 'Sadia Rahman' },
  { id: 'RX-2026-018', patient: 'Salma Begum',    patient_phone: '01711-100024', doctor: 'Dr. Sumaiya Islam',   doctor_specialty: 'General Physician',  date: '2026-06-13', status: 'verified',  medicines: rxMedicines[1], notes: 'Probiotic recommended alongside antibiotic.',     pharmacist: 'Puja Sarkar'  },
  { id: 'RX-2026-019', patient: 'Karim Hossain',  patient_phone: '01711-100003', doctor: 'Dr. Nasrin Akter',    doctor_specialty: 'Endocrinologist',     date: '2026-06-12', status: 'dispensed', medicines: rxMedicines[9], notes: 'Neuropathy follow-up in 4 weeks.',                 pharmacist: 'Roni Ahmed'   },
  { id: 'RX-2026-020', patient: 'Jahangir Alam',  patient_phone: '01711-100025', doctor: 'Dr. Arif Hasan',      doctor_specialty: 'Cardiologist',        date: '2026-06-11', status: 'dispensed', medicines: rxMedicines[2], notes: 'Strict sodium restriction < 2g/day.',              pharmacist: 'Sadia Rahman' },
]

export const mockDoctors = [
  { id: 1, name: 'Dr. Sumaiya Islam',   specialty: 'General Physician',  hospital: 'Dhaka Medical College',    phone: '01700-111111', prescriptions: 28 },
  { id: 2, name: 'Dr. Arif Hasan',      specialty: 'Cardiologist',       hospital: 'National Heart Institute', phone: '01700-222222', prescriptions: 15 },
  { id: 3, name: 'Dr. Nasrin Akter',    specialty: 'Endocrinologist',    hospital: 'BIRDEM Hospital',          phone: '01700-333333', prescriptions: 22 },
  { id: 4, name: 'Dr. Tanvir Hossain',  specialty: 'Pulmonologist',      hospital: 'Dhaka Medical College',    phone: '01700-444444', prescriptions: 10 },
  { id: 5, name: 'Dr. Rania Chowdhury', specialty: 'Dermatologist',      hospital: 'Skin & Allergy Hospital',  phone: '01700-555555', prescriptions: 18 },
]

export const mockEmployees = [
  { id: 1, name: 'Roni Ahmed',    role: 'Pharmacist',   shift: 'Morning', phone: '01612-000001', status: 'active'   },
  { id: 2, name: 'Sadia Rahman',  role: 'Cashier',      shift: 'Morning', phone: '01612-000002', status: 'active'   },
  { id: 3, name: 'Jahidul Islam', role: 'Store Keeper', shift: 'Evening', phone: '01612-000003', status: 'active'   },
  { id: 4, name: 'Puja Sarkar',   role: 'Pharmacist',   shift: 'Evening', phone: '01612-000004', status: 'active'   },
  { id: 5, name: 'Kamrul Hasan',  role: 'Cashier',      shift: 'Night',   phone: '01612-000005', status: 'inactive' },
]
