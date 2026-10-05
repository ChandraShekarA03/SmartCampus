import { CampusGraphData } from '../types';

export const CHRIST_CAMPUS_GRAPH: CampusGraphData = {
  name: 'CHRIST University Central Campus',
  campusName: 'CHRIST (Deemed to be University)',
  description: 'SmartCampus Graph Network with academic blocks, labs, libraries, food courts, and sports facilities.',
  nodes: [
    {
      id: 'main-block',
      name: 'Main Block (Central)',
      shortName: 'Main Block',
      category: 'admin',
      x: 280,
      y: 350,
      floors: 5,
      description: 'Administrative Headquarters, Chancellor\'s Office, Council Hall, and Main Reception.',
      departments: ['Deanery', 'Controller of Examinations', 'Admissions', 'Finance'],
      facilities: ['Information Desk', 'Elevators', 'Bank ATM', 'Visitor Lounge'],
      icon: 'landmark'
    },
    {
      id: 'library',
      name: 'Knowledge Center & Central Library',
      shortName: 'Library',
      category: 'academic',
      x: 460,
      y: 180,
      floors: 4,
      description: '400,000+ volumes, digital archives, silent study zones, and reference halls.',
      departments: ['Library & Information Sciences', 'Digital Research Center'],
      facilities: ['Digital Commons', 'Print Stations', 'Discussion Rooms', 'Wi-Fi Hub'],
      icon: 'book'
    },
    {
      id: 'cs-block',
      name: 'Computer Science & AI Block',
      shortName: 'CS Block',
      category: 'academic',
      x: 720,
      y: 280,
      floors: 6,
      description: 'High Performance Computing Labs, AI Research Hub, Cyber Security Labs, and Classrooms.',
      departments: ['Computer Science', 'Data Science', 'AI & Machine Learning', 'Software Eng'],
      facilities: ['NVIDIA AI Lab', 'IoT Workspace', 'Server Room', 'Robotics Bay'],
      icon: 'cpu'
    },
    {
      id: 'cafeteria',
      name: 'Gourmet Central Cafeteria',
      shortName: 'Cafeteria',
      category: 'food',
      x: 500,
      y: 520,
      floors: 2,
      description: 'Multi-cuisine student dining hall, juice bars, bakeries, and coffee corners.',
      departments: ['Campus Hospitality'],
      facilities: ['Outdoor Seating', 'Quick Bites Counter', 'Water Filtration', 'Coffee Lounge'],
      icon: 'utensils'
    },
    {
      id: 'auditorium',
      name: 'Main Campus Auditorium (KE)',
      shortName: 'Auditorium',
      category: 'facility',
      x: 180,
      y: 190,
      floors: 3,
      description: '2,500-seat state-of-the-art acoustic auditorium for convocations and cultural fests.',
      departments: ['Cultural Affairs', 'Student Welfare'],
      facilities: ['Green Rooms', 'Stage Lighting Suite', 'VIP Foyer', 'Acoustic Panels'],
      icon: 'music'
    },
    {
      id: 'science-lab',
      name: 'Advanced Science & Physics Complex',
      shortName: 'Science Labs',
      category: 'academic',
      x: 880,
      y: 150,
      floors: 4,
      description: 'Physics, Chemistry, Biotechnology, and Material Science Research Laboratories.',
      departments: ['Physics', 'Chemistry', 'Biotechnology', 'Nanotechnology'],
      facilities: ['Clean Room', 'Spectroscopy Suite', 'Chemical Vault', 'Fume Hoods'],
      icon: 'flask-conical'
    },
    {
      id: 'sports-complex',
      name: 'Indoor Sports Arena & Gymnasium',
      shortName: 'Sports Arena',
      category: 'sports',
      x: 760,
      y: 540,
      floors: 2,
      description: 'Badminton courts, Olympic swimming pool, gym, table tennis, and basketball court.',
      departments: ['Physical Education', 'Athletic Club'],
      facilities: ['Cardio Gym', 'Showers & Lockers', 'First Aid Center', 'Equipment Rental'],
      icon: 'trophy'
    },
    {
      id: 'hostel-block',
      name: 'St. Thomas Student Residence',
      shortName: 'Hostel Block',
      category: 'residential',
      x: 940,
      y: 440,
      floors: 7,
      description: 'Resident student dormitories, study halls, laundry, and warden offices.',
      departments: ['Hostel Administration'],
      facilities: ['Common Room', 'Laundromat', 'Night Canteen', 'Study Rooms'],
      icon: 'home'
    },
    {
      id: 'admin-block',
      name: 'Syndicate & Examination Block',
      shortName: 'Exam Office',
      category: 'admin',
      x: 120,
      y: 490,
      floors: 3,
      description: 'Central Evaluation Cell, Transcripts Verification, and Student Records.',
      departments: ['Office of Examinations', 'Registrar Office'],
      facilities: ['Helpline Counters', 'Document Dispatch', 'Security Vault'],
      icon: 'file-text'
    },
    {
      id: 'amphitheatre',
      name: 'Open Air Amphitheatre & Gardens',
      shortName: 'Amphitheatre',
      category: 'facility',
      x: 320,
      y: 620,
      floors: 1,
      description: 'Lush green botanical seating for informal gatherings, open mic, and theatre.',
      departments: ['Student Council'],
      facilities: ['Stage', 'Garden Walkways', 'Solar Lighting', 'Benches'],
      icon: 'sun'
    },
    {
      id: 'research-park',
      name: 'Innovation & Incubation Hub',
      shortName: 'Research Hub',
      category: 'academic',
      x: 980,
      y: 290,
      floors: 5,
      description: 'Startup incubator, patent filing cell, and industrial collaboration centers.',
      departments: ['Centre for Research', 'IPR Cell', 'Industry Relations'],
      facilities: ['Conference Suites', '3D Prototyping Lab', 'Venture Lounge'],
      icon: 'lightbulb'
    },
    {
      id: 'health-center',
      name: 'Campus Medical & Wellness Center',
      shortName: 'Health Center',
      category: 'facility',
      x: 300,
      y: 110,
      floors: 2,
      description: '24/7 nursing staff, emergency pharmacy, doctor consultation, and ambulance bay.',
      departments: ['Campus Health Services'],
      facilities: ['Emergency Ward', 'Pharmacy', 'Ambulance', 'Rest Beds'],
      icon: 'cross'
    }
  ],
  edges: [
    // Core prompt triangle & quad
    { id: 'e-main-lib', source: 'main-block', target: 'library', distance: 120, bidirectional: true, type: 'covered', description: 'Central shaded avenue with lush trees' },
    { id: 'e-lib-cs', source: 'library', target: 'cs-block', distance: 180, bidirectional: true, type: 'walkway', description: 'Northern Academic Corridor' },
    { id: 'e-main-cs', source: 'main-block', target: 'cs-block', distance: 340, bidirectional: true, type: 'walkway', description: 'Central Spine Walkway' },
    { id: 'e-main-caf', source: 'main-block', target: 'cafeteria', distance: 200, bidirectional: true, type: 'covered', description: 'South Boulevard canopy' },
    { id: 'e-caf-cs', source: 'cafeteria', target: 'cs-block', distance: 100, bidirectional: true, type: 'walkway', description: 'Food Court connector path' },
    
    // Auditorium connections
    { id: 'e-aud-main', source: 'auditorium', target: 'main-block', distance: 160, bidirectional: true, type: 'covered', description: 'West Quadrangle connector' },
    { id: 'e-aud-lib', source: 'auditorium', target: 'library', distance: 210, bidirectional: true, type: 'scenic', description: 'Fountain garden walkway' },
    { id: 'e-aud-health', source: 'auditorium', target: 'health-center', distance: 140, bidirectional: true, type: 'ramp', description: 'North-West paved ramp' },
    
    // Health center connection
    { id: 'e-health-lib', source: 'health-center', target: 'library', distance: 150, bidirectional: true, type: 'covered', description: 'North quadrangle path' },
    
    // Admin / Amphitheatre connections
    { id: 'e-admin-main', source: 'admin-block', target: 'main-block', distance: 190, bidirectional: true, type: 'walkway', description: 'Registrar portico' },
    { id: 'e-admin-amphi', source: 'admin-block', target: 'amphitheatre', distance: 230, bidirectional: true, type: 'scenic', description: 'Botanical perimeter walkway' },
    { id: 'e-amphi-caf', source: 'amphitheatre', target: 'cafeteria', distance: 170, bidirectional: true, type: 'covered', description: 'Student plaza stairs & ramp' },
    
    // East campus (Science Lab, Sports, Research, Hostel)
    { id: 'e-cs-sci', source: 'cs-block', target: 'science-lab', distance: 160, bidirectional: true, type: 'covered', description: 'High-tech skybridge & corridor' },
    { id: 'e-lib-sci', source: 'library', target: 'science-lab', distance: 320, bidirectional: true, type: 'walkway', description: 'East Quad paved street' },
    { id: 'e-cs-research', source: 'cs-block', target: 'research-park', distance: 190, bidirectional: true, type: 'walkway', description: 'Silicon walkway' },
    { id: 'e-sci-research', source: 'science-lab', target: 'research-park', distance: 170, bidirectional: true, type: 'covered', description: 'Innovation gallery' },
    { id: 'e-caf-sports', source: 'cafeteria', target: 'sports-complex', distance: 180, bidirectional: true, type: 'walkway', description: 'Recreation avenue' },
    { id: 'e-cs-sports', source: 'cs-block', target: 'sports-complex', distance: 210, bidirectional: true, type: 'walkway', description: 'Athletic connector' },
    { id: 'e-sports-hostel', source: 'sports-complex', target: 'hostel-block', distance: 150, bidirectional: true, type: 'walkway', description: 'Residential promenade' },
    { id: 'e-research-hostel', source: 'research-park', target: 'hostel-block', distance: 130, bidirectional: true, type: 'covered', description: 'Dormitory East connector' }
  ]
};
