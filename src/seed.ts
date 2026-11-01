import { DataSource } from 'typeorm';
import { Course, LearningMode, SkillLevel } from './courses/course.entity';
import { Category } from './courses/category.entity';
import { Program, ProgramType } from './programs/program.entity';
import { Event, EventMode, EventStatus, EventType } from './events/event.entity';
import { GalleryCategory, GalleryItem } from './gallery/gallery.entity';
import { Testimonial } from './testimonials/testimonial.entity';
import { Achievement } from './achievements/achievement.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'karpi_db',
  entities: [Course, Category, Program, Event, GalleryItem, Testimonial, Achievement],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('🌱 Connected to database for seeding...');

  const categoryRepo = AppDataSource.getRepository(Category);
  const courseRepo = AppDataSource.getRepository(Course);
  const programRepo = AppDataSource.getRepository(Program);
  const eventRepo = AppDataSource.getRepository(Event);
  const galleryRepo = AppDataSource.getRepository(GalleryItem);
  const testimonialRepo = AppDataSource.getRepository(Testimonial);
  const achievementRepo = AppDataSource.getRepository(Achievement);

  // 1. Seed Achievements (Key Stats)
  const achievementCount = await achievementRepo.count();
  if (achievementCount === 0) {
    console.log('Seeding achievements...');
    await achievementRepo.save([
      {
        metricValue: '1,500+',
        title: 'Students & Grads Mentored',
        description: 'Trained across web development, cloud computing, and core CS fundamentals.',
        icon: 'GraduationCap',
        displayOrder: 1,
      },
      {
        metricValue: '50+',
        title: 'Workshops & Seminars',
        description: 'Conducted in top engineering colleges and technical institutions.',
        icon: 'Presentation',
        displayOrder: 2,
      },
      {
        metricValue: '94%',
        title: 'Hands-on Lab Satisfaction',
        description: 'Students who built production-ready projects during their curriculum.',
        icon: 'CheckCircle',
        displayOrder: 3,
      },
      {
        metricValue: '18+',
        title: 'Specialized Learning Tracks',
        description: 'Covering emerging industry tech stacks and interview readiness.',
        icon: 'BookOpen',
        displayOrder: 4,
      },
    ]);
  }

  // 2. Seed Categories
  const categoryMap = new Map<string, Category>();
  const categoriesData = [
    {
      name: 'Full-Stack Web Development',
      slug: 'full-stack-web-development',
      description: 'Modern frontend, backend, database architectures and RESTful microservices.',
      icon: 'Code2',
    },
    {
      name: 'Cloud Computing & AWS',
      slug: 'cloud-computing-aws',
      description: 'Deploy, architect, and scale high-availability systems on AWS cloud.',
      icon: 'Cloud',
    },
    {
      name: 'DevOps & CI/CD',
      slug: 'devops-cicd',
      description: 'Automate build, test, and release pipelines with Docker, Kubernetes, and Git.',
      icon: 'GitBranch',
    },
    {
      name: 'Cybersecurity & Ethical Hacking',
      slug: 'cybersecurity',
      description: 'Network defense, vulnerability assessments, security best practices, and threat analysis.',
      icon: 'ShieldCheck',
    },
    {
      name: 'AI & Data Science',
      slug: 'ai-data-science',
      description: 'Machine learning fundamentals, Python data pipelines, and applied intelligence.',
      icon: 'BrainCircuit',
    },
    {
      name: 'Computer Science Fundamentals',
      slug: 'cs-fundamentals',
      description: 'Data structures, algorithms, operating systems, networking, and system design.',
      icon: 'Cpu',
    },
  ];

  for (const catData of categoriesData) {
    let cat = await categoryRepo.findOne({ where: { slug: catData.slug } });
    if (!cat) {
      cat = await categoryRepo.save(categoryRepo.create(catData));
    }
    categoryMap.set(cat.slug, cat);
  }

  // 3. Seed Courses
  const courseCount = await courseRepo.count();
  if (courseCount === 0) {
    console.log('Seeding courses...');
    const coursesToSeed = [
      {
        title: 'Modern Full-Stack Engineering (React, Node.js & TypeScript)',
        slug: 'modern-full-stack-engineering',
        shortDescription: 'Master end-to-end web engineering with React, Node.js, Express/NestJS, PostgreSQL, and Docker.',
        overview: 'A rigorous hands-on technical curriculum designed for college students and graduates. You will build and deploy 3 production-grade applications from scratch, master TypeScript, state management, REST APIs, authentication (JWT/OAuth), and automated testing.',
        level: SkillLevel.INTERMEDIATE,
        mode: LearningMode.HYBRID,
        duration: '12 Weeks (96 Hours)',
        schedule: 'Weekend Sessions + Weekday Lab Mentorship',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        categoryId: categoryMap.get('full-stack-web-development')?.id,
        isFeatured: true,
        learningObjectives: [
          'Master TypeScript across client and server architectures',
          'Architect modular React applications with state management and Tailwind CSS',
          'Build scalable RESTful microservices with Node.js and NestJS',
          'Design normalized relational databases and implement ORMs (TypeORM/Prisma)',
          'Containerize applications with Docker and deploy to cloud platforms'
        ],
        skillsCovered: ['React 18', 'TypeScript', 'Node.js', 'NestJS', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'Git'],
        curriculum: [
          { module: 'Module 1: Modern JavaScript & TypeScript Deep Dive', topics: ['ESNext syntax', 'Async/Await patterns', 'Generics & Utility Types'], handsOn: 'Build a Type-safe In-Memory Query Engine' },
          { module: 'Module 2: Frontend Architecture with React', topics: ['Component Lifecycle', 'Custom Hooks', 'State Management', 'Tailwind Design System'], handsOn: 'Develop an Interactive Collaboration Board' },
          { module: 'Module 3: Enterprise Backend with NestJS', topics: ['Controllers, Providers & Modules', 'TypeORM Data Mapping', 'JWT Auth & RBAC'], handsOn: 'Build a Robust E-Learning REST API' },
          { module: 'Module 4: Deployment & Cloud Foundations', topics: ['Docker multi-stage builds', 'CI/CD Pipelines', 'Cloud Hosting'], handsOn: 'Full Production Deployment on AWS EC2 & S3' }
        ],
        prerequisites: ['Basic understanding of programming logic (C/C++, Java or Python)', 'Familiarity with HTML and CSS'],
        whoShouldAttend: ['CS/IT Engineering students wanting real-world project portfolios', 'Graduates preparing for software engineer and full-stack developer roles'],
        practicalActivities: ['Live coding review sessions', '3 Capstone Projects', 'Mock technical interviews', 'Weekly code challenges']
      },
      {
        title: 'AWS Cloud Architecture & Solutions Architect Prep',
        slug: 'aws-cloud-architecture-mastery',
        shortDescription: 'Design resilient, scalable, cost-optimized cloud solutions with AWS compute, storage, and networking.',
        overview: 'Practical cloud training tailored to real industry scenarios. Gain deep confidence configuring VPCs, EC2 auto-scaling groups, S3 security policies, Lambda serverless functions, RDS databases, and IAM access controls.',
        level: SkillLevel.BEGINNER,
        mode: LearningMode.ONLINE,
        duration: '8 Weeks (64 Hours)',
        schedule: 'Saturday & Sunday Live Interactive Batches',
        thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        categoryId: categoryMap.get('cloud-computing-aws')?.id,
        isFeatured: true,
        learningObjectives: [
          'Design fault-tolerant and highly available multi-AZ cloud infrastructures',
          'Deploy secure virtual private clouds (VPC) with subnets, NAT gateways, and routing',
          'Implement serverless architectures utilizing AWS Lambda and API Gateway',
          'Prepare thoroughly for AWS Certified Solutions Architect - Associate'
        ],
        skillsCovered: ['AWS EC2', 'AWS S3', 'VPC & Route 53', 'IAM & CloudTrail', 'Lambda', 'RDS & DynamoDB', 'CloudWatch'],
        curriculum: [
          { module: 'Module 1: Cloud Principles & Identity Management', topics: ['AWS Global Infrastructure', 'IAM Policies & Roles', 'Security Best Practices'], handsOn: 'Multi-tiered IAM security enforcement lab' },
          { module: 'Module 2: Networking & Virtual Private Clouds', topics: ['Custom VPC setup', 'Public/Private subnets', 'Internet & NAT Gateways'], handsOn: 'Configure an enterprise isolated network topology' },
          { module: 'Module 3: Compute & High Availability', topics: ['EC2 instances', 'Application Load Balancers', 'Auto Scaling Groups'], handsOn: 'Deploy zero-downtime auto-scaling web clusters' },
          { module: 'Module 4: Storage, Databases & Serverless', topics: ['S3 lifecycle policies', 'RDS Multi-AZ Failover', 'Serverless Lambda execution'], handsOn: 'Build an automated image processing pipeline' }
        ],
        prerequisites: ['Basic operating system and networking concepts (IP addresses, DNS, ports)'],
        whoShouldAttend: ['College students looking to break into Cloud Engineering, System Ops, or DevOps'],
        practicalActivities: ['10+ hands-on AWS console and CLI labs', 'Cost-optimization workshop', 'Real disaster recovery simulation']
      },
      {
        title: 'Hands-on DevOps, Docker & Kubernetes Engineering',
        slug: 'devops-docker-kubernetes',
        shortDescription: 'Master containerization, infrastructure as code, and automated GitOps CI/CD delivery pipelines.',
        overview: 'Bridge the gap between development and operations. Learn how industry tech leaders deploy thousands of microservices securely and automatically every day.',
        level: SkillLevel.INTERMEDIATE,
        mode: LearningMode.OFFLINE,
        duration: '10 Weeks (80 Hours)',
        schedule: 'In-person Classroom Coaching with Dedicated High-Spec Lab',
        thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80',
        categoryId: categoryMap.get('devops-cicd')?.id,
        isFeatured: true,
        learningObjectives: [
          'Master Linux system internals and command-line automation',
          'Build optimized, secure multi-stage Docker container images',
          'Orchestrate microservices using Kubernetes pods, services, and ingresses',
          'Implement automated GitHub Actions CI/CD pipelines'
        ],
        skillsCovered: ['Docker', 'Kubernetes', 'Linux Bash', 'GitHub Actions', 'Terraform', 'Prometheus & Grafana'],
        curriculum: [
          { module: 'Module 1: Linux Internals & Bash Scripting', topics: ['Process management', 'File permissions', 'Network debugging tools'], handsOn: 'Write automated health-check bash scripts' },
          { module: 'Module 2: Containerization with Docker', topics: ['Dockerfile optimization', 'Docker Compose multi-container networks', 'Volume persistence'], handsOn: 'Containerize a complex 3-tier microservice' },
          { module: 'Module 3: Kubernetes Orchestration', topics: ['Architecture & Control Plane', 'Deployments, ReplicaSets & Services', 'ConfigMaps & Secrets'], handsOn: 'Deploy and scale microservices on Minikube / K3s' },
          { module: 'Module 4: CI/CD Pipelines & Monitoring', topics: ['GitHub Actions workflows', 'Automated testing and linting', 'Prometheus metrics monitoring'], handsOn: 'End-to-end Push-to-Deploy pipeline setup' }
        ],
        prerequisites: ['Basic familiarity with Git and any programming language'],
        whoShouldAttend: ['Final-year students, junior developers, and system admins transitioning to DevOps'],
        practicalActivities: ['Live troubleshooting broken clusters', 'Simulating production outages', 'Writing Infrastructure-as-Code with Terraform']
      },
      {
        title: 'Practical Cybersecurity & Ethical Hacking Essentials',
        slug: 'cybersecurity-ethical-hacking',
        shortDescription: 'Learn penetration testing, vulnerability assessment, web application security, and defensive hardening.',
        overview: 'Understand how attackers exploit vulnerabilities and learn how to proactively protect networks, servers, and applications. Features hands-on practice in dedicated sandbox labs.',
        level: SkillLevel.BEGINNER,
        mode: LearningMode.HYBRID,
        duration: '8 Weeks (60 Hours)',
        schedule: 'Weekday Evenings + Weekend Hands-on Labs',
        thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        categoryId: categoryMap.get('cybersecurity')?.id,
        isFeatured: false,
        learningObjectives: [
          'Understand the cyber kill chain and penetration testing methodologies',
          'Identify and remediate OWASP Top 10 vulnerabilities in web applications',
          'Analyze network traffic using Wireshark and conduct port scans with Nmap',
          'Implement defensive security controls and hardening practices'
        ],
        skillsCovered: ['Kali Linux', 'Wireshark', 'Burp Suite', 'Nmap', 'Metasploit', 'OWASP Top 10', 'Cryptography'],
        curriculum: [
          { module: 'Module 1: Information Gathering & Reconnaissance', topics: ['Passive & Active OSINT', 'Port Scanning with Nmap', 'Service Enumeration'], handsOn: 'Network reconnaissance simulation' },
          { module: 'Module 2: Web Application Security (OWASP Top 10)', topics: ['SQL Injection', 'Cross-Site Scripting (XSS)', 'Broken Authentication & CSRF'], handsOn: 'Penetration testing on vulnerable lab targets (DVWA)' },
          { module: 'Module 3: Network Security & Traffic Analysis', topics: ['Packet capturing with Wireshark', 'MITM attacks analysis', 'Firewalls & IDS/IPS setup'], handsOn: 'Sniffing & decrypting test network traffic' },
          { module: 'Module 4: Incident Response & Defensive Hardening', topics: ['System audit logs', 'Patch management', 'Basic malware analysis'], handsOn: 'Hardening an Ubuntu server according to CIS benchmarks' }
        ],
        prerequisites: ['Good understanding of Computer Networking (TCP/IP, OSI model, DNS)'],
        whoShouldAttend: ['Students passionate about information security, SOC analyst roles, and pen-testing careers'],
        practicalActivities: ['Capture the Flag (CTF) challenges', 'Vulnerability assessment reports writing', 'Lab exploitation workshops']
      },
      {
        title: 'Data Structures, Algorithms & System Design for Interviews',
        slug: 'dsa-system-design-interview-prep',
        shortDescription: 'Master algorithmic problem solving, time-space complexity, and scalable distributed system design.',
        overview: 'Designed to help students crack technical interviews at top software companies. We demystify patterns like two-pointers, sliding window, dynamic programming, and low-level / high-level system design.',
        level: SkillLevel.ALL_LEVELS,
        mode: LearningMode.HYBRID,
        duration: '10 Weeks (80 Hours)',
        schedule: 'Bi-weekly Problem Solving Classes + Live Code Reviews',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        categoryId: categoryMap.get('cs-fundamentals')?.id,
        isFeatured: true,
        learningObjectives: [
          'Recognize core patterns across 150+ standard DSA problems',
          'Master Recursion, Dynamic Programming, Graphs, and Trees',
          'Analyze and design high-scale systems (Rate limiters, URL shorteners, Chat systems)',
          'Excel in live coding rounds and technical whiteboard interviews'
        ],
        skillsCovered: ['Data Structures', 'Algorithms', 'System Design', 'C++/Java/Python', 'Time Complexity', 'Concurrency'],
        curriculum: [
          { module: 'Module 1: Foundations & Algorithmic Patterns', topics: ['Complexity Analysis', 'Two Pointers & Sliding Window', 'Binary Search Variants'], handsOn: 'Solve 25 fundamental pattern challenges' },
          { module: 'Module 2: Advanced Data Structures', topics: ['Trees, BST, Tries', 'Heaps & Priority Queues', 'Graph traversals (BFS, DFS, Dijkstra)'], handsOn: 'Implement an auto-complete search engine with Tries' },
          { module: 'Module 3: Dynamic Programming & Greedy Algorithms', topics: ['1D and 2D DP', 'Knapsack variants', 'State transition optimization'], handsOn: 'DP interview masterclass' },
          { module: 'Module 4: Practical System Design & Architecture', topics: ['Load balancers & Caching (Redis)', 'Database Sharding & Replication', 'Microservice communications'], handsOn: 'Design a distributed URL shortener (TinyURL)' }
        ],
        prerequisites: ['Proficiency in at least one language: Java, C++, Python, or JavaScript'],
        whoShouldAttend: ['College students targeting product-based companies and IT recruitment drives'],
        practicalActivities: ['Weekly timed mock contests', '1-on-1 resume reviews', 'Peer code walkthroughs']
      },
      {
        title: 'Applied AI & Python for Intelligent Software',
        slug: 'applied-ai-python-engineering',
        shortDescription: 'Build AI-powered web applications using Python, LangChain, embeddings, and modern ML pipelines.',
        overview: 'Move beyond theory into practical AI software engineering. Learn to leverage LLM APIs, vector databases, Retrieval-Augmented Generation (RAG), and data manipulation libraries to build intelligent tools.',
        level: SkillLevel.INTERMEDIATE,
        mode: LearningMode.ONLINE,
        duration: '8 Weeks (64 Hours)',
        schedule: 'Evenings & Weekend Interactive Labs',
        thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
        categoryId: categoryMap.get('ai-data-science')?.id,
        isFeatured: false,
        learningObjectives: [
          'Develop modular Python applications using NumPy, Pandas, and FastAPI',
          'Implement vector search and embeddings using modern Vector DBs',
          'Architect production-grade RAG systems for intelligent document querying',
          'Evaluate and deploy AI microservices reliably'
        ],
        skillsCovered: ['Python 3', 'FastAPI', 'LangChain', 'Vector DBs (Chroma/Pinecone)', 'Embeddings', 'Pandas'],
        curriculum: [
          { module: 'Module 1: Python for Modern Software Engineering', topics: ['Type hinting', 'Virtual environments', 'FastAPI asynchronous web endpoints'], handsOn: 'Build a high-performance REST API with FastAPI' },
          { module: 'Module 2: Data Wrangling & Feature Engineering', topics: ['Pandas dataframes', 'NumPy operations', 'Data cleaning pipelines'], handsOn: 'Exploratory data analysis on real datasets' },
          { module: 'Module 3: Retrieval-Augmented Generation (RAG) Architecture', topics: ['Text chunking strategies', 'Vector embeddings', 'Similarity search algorithms'], handsOn: 'Build a "Chat with your College Textbook" application' },
          { module: 'Module 4: Building Intelligent Agents & Deployment', topics: ['Tool calling & function execution', 'Prompt optimization', 'Containerized cloud deployment'], handsOn: 'Deploy an autonomous research assistant agent' }
        ],
        prerequisites: ['Basic Python programming syntax and fundamental CS logic'],
        whoShouldAttend: ['Students looking to build state-of-the-art AI applications and enhance their project portfolios'],
        practicalActivities: ['2 End-to-end AI Capstone projects', 'Code optimization labs', 'FastAPI production deployments']
      },
    ];

    for (const c of coursesToSeed) {
      await courseRepo.save(courseRepo.create(c));
    }
  }

  // 4. Seed Programs
  const programCount = await programRepo.count();
  if (programCount === 0) {
    console.log('Seeding programs...');
    await programRepo.save([
      {
        title: 'Online Live Classes',
        slug: 'online-live-classes',
        type: ProgramType.ONLINE_LIVE,
        shortDescription: 'Interactive, scheduled virtual sessions led by industry practitioners with real-time screen sharing and code alongs.',
        detailedDescription: 'KARPI Online Live Classes bring the energy and accountability of a physical classroom to your screen. Every session is live, conversational, and includes instant doubt-resolution, shared coding environments, and recorded archives for revision.',
        icon: 'Video',
        bannerUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=1000&q=80',
        deliveryFormat: 'Live Zoom/Meet Sessions + Code Collab + LMS Portal',
        sortOrder: 1,
        keyHighlights: [
          'Live two-way audio & video interactions',
          'Session recordings and downloadable code repositories provided daily',
          'Small cohort sizes ensuring individualized instructor attention',
          'Dedicated Discord/Slack doubt-clearing channels'
        ],
        targetAudience: ['College students managing semester schedules', 'Graduates located anywhere wanting top-tier technical mentoring'],
        learningOutcomes: ['Confidence in building applications remotely', 'Industry collaborative workflows with Git and cloud tools']
      },
      {
        title: 'Offline Technical Coaching',
        slug: 'offline-technical-coaching',
        type: ProgramType.OFFLINE_COACHING,
        shortDescription: 'In-person classroom batches with dedicated workstations, face-to-face mentorship, and collaborative group discussions.',
        detailedDescription: 'For learners who thrive in an in-person environment, our offline coaching centers provide structured study hours, direct one-on-one debugging assistance, and a focused peer community without distractions.',
        icon: 'Building2',
        bannerUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
        deliveryFormat: 'Dedicated Classroom & Computer Lab Facilities',
        sortOrder: 2,
        keyHighlights: [
          'High-speed development lab with all tools pre-configured',
          'Face-to-face problem solving and whiteboarding sessions',
          'Collaborative hackathon-style peer group projects',
          'Strict discipline and structured progress tracking'
        ],
        targetAudience: ['Students wanting high accountability and immersive classroom learning', 'Local college batches wanting intensive weekend coaching'],
        learningOutcomes: ['Rapid technical problem-solving mastery', 'Strong interpersonal and technical team collaboration skills']
      },
      {
        title: 'Technical Webinars',
        slug: 'technical-webinars',
        type: ProgramType.WEBINAR,
        shortDescription: 'Free and subsidized expert webinars covering emerging technologies, software architecture, and industry hiring trends.',
        detailedDescription: 'KARPI regularly invites practicing tech leads, architects, and hiring managers to deliver deep-dive webinars on current industry shifts, architectural case studies, and career strategies.',
        icon: 'MonitorPlay',
        bannerUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
        deliveryFormat: 'Online Streaming + Live Q&A',
        sortOrder: 3,
        keyHighlights: [
          'Industry speakers from leading software firms',
          'Interactive Q&A and real-world case study breakdowns',
          'Free digital participation certificates for eligible attendees',
          'Summarized cheat-sheets and resource kits provided'
        ],
        targetAudience: ['Students curious about modern software industry practices', 'Early career developers keeping their skills fresh'],
        learningOutcomes: ['Understanding current market demands and technology roadmaps', 'Direct networking with working tech professionals']
      },
      {
        title: 'College Seminars & Tech Talks',
        slug: 'college-seminars',
        type: ProgramType.COLLEGE_SEMINAR,
        shortDescription: 'On-campus technical seminars conducted in partnership with university CS/IT departments to inspire and guide students.',
        detailedDescription: 'We collaborate closely with engineering college faculties and placement cells to conduct impactful on-campus seminars. Our talks demystify the transition from academic theory to corporate software engineering expectations.',
        icon: 'GraduationCap',
        bannerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
        deliveryFormat: 'On-Campus College Auditoriums & Seminar Halls',
        sortOrder: 4,
        keyHighlights: [
          'Tailored to college curriculum gaps and placement requirements',
          'Inspiring technical demonstrations and live coding',
          'Direct Q&A on campus placements, off-campus jobs, and higher studies',
          'Certificate of institutional partnership'
        ],
        targetAudience: ['Pre-final and final-year engineering / BCA / MCA students', 'College technical clubs and departmental associations'],
        learningOutcomes: ['Clear placement roadmap and interview preparation strategy', 'Awareness of open-source contributions and portfolio building']
      },
      {
        title: 'Hands-on Technical Workshops',
        slug: 'hands-on-workshops',
        type: ProgramType.HANDS_ON_WORKSHOP,
        shortDescription: 'Intensive 1-day and 2-day bootcamp workshops where every participant builds a working project from scratch.',
        detailedDescription: 'No boring theory slides. In KARPI hands-on workshops, participants open their IDEs on minute 10 and spend the entire session coding, configuring, debugging, and deploying real working systems.',
        icon: 'Wrench',
        bannerUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80',
        deliveryFormat: 'Interactive Bootcamp (Online or On-Campus Labs)',
        sortOrder: 5,
        keyHighlights: [
          'Project-first pedagogy: learn concepts as you build',
          'Individual mentoring to unblock syntax and runtime errors',
          'Verified completion certificate showcasing completed project',
          'Step-by-step code repos and starter kits provided'
        ],
        targetAudience: ['Students wanting to add immediate portfolio projects to their GitHub', 'Coders who learn best through building'],
        learningOutcomes: ['A fully functional, deployable project on your GitHub profile', 'Mastery over terminal workflows, Git, and modern frameworks']
      },
      {
        title: 'Career Guidance & Placement Mentorship',
        slug: 'career-guidance',
        type: ProgramType.CAREER_GUIDANCE,
        shortDescription: 'One-on-one resume reviews, GitHub portfolio audits, mock technical interviews, and personalized career roadmaps.',
        detailedDescription: 'Technical skills alone are not enough if your resume does not get shortlisted or you struggle in communication during interviews. Our career guidance initiative equips you with the confidence and polish needed to stand out.',
        icon: 'Compass',
        bannerUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=80',
        deliveryFormat: '1-on-1 Virtual Sessions & Group Career Masterclasses',
        sortOrder: 6,
        keyHighlights: [
          'ATS-optimized tech resume restructuring',
          'GitHub profile makeover and README documentation review',
          'Simulated behavioral and technical mock interviews with detailed feedback',
          'Job application strategy and LinkedIn outreach coaching'
        ],
        targetAudience: ['Final-year college students', 'Recent graduates applying for junior/trainee engineer positions'],
        learningOutcomes: ['Professional, recruiter-ready resume and active GitHub portfolio', 'Elevated interview confidence and clear negotiation strategy']
      },
    ]);
  }

  // 5. Seed Events
  const eventCount = await eventRepo.count();
  if (eventCount === 0) {
    console.log('Seeding events...');
    await eventRepo.save([
      {
        title: 'Masterclass: Modern Cloud Native Microservices with Docker & AWS',
        slug: 'masterclass-cloud-native-microservices',
        type: EventType.WEBINAR,
        mode: EventMode.ONLINE,
        status: EventStatus.UPCOMING,
        eventDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
        duration: '2.5 Hours',
        locationOrPlatform: 'Live on Google Meet (Link upon registration)',
        description: 'Join KARPI instructors for a live deep-dive into containerizing Node.js applications, pushing images to Amazon ECR, and orchestrating deployments using AWS ECS.',
        speakerName: 'Karthik Subramanian',
        speakerRole: 'Principal Cloud Architect',
        speakerOrg: 'KARPI Cloud Practice',
        bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        registrationStatus: 'Open',
        registrationLink: '#enquire',
      },
      {
        title: 'Campus Seminar: Roadmap to Product Company Placements 2026',
        slug: 'campus-seminar-placement-roadmap-2026',
        type: EventType.SEMINAR,
        mode: EventMode.OFFLINE,
        status: EventStatus.UPCOMING,
        eventDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // in 12 days
        duration: '3 Hours',
        locationOrPlatform: 'Main Auditorium, Engineering Campus',
        description: 'Comprehensive seminar covering how engineering students should structure their 2nd, 3rd, and 4th years to crack technical interviews at top software companies.',
        speakerName: 'Ananya Deshmukh',
        speakerRole: 'Engineering Manager & Technical Mentor',
        speakerOrg: 'KARPI Tech Initiatives',
        bannerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
        registrationStatus: 'Open',
        registrationLink: '#enquire',
      },
      {
        title: '2-Day Hands-on Workshop: Building Full-Stack Apps with Next.js & Tailwind',
        slug: '2day-workshop-nextjs-tailwind',
        type: EventType.WORKSHOP,
        mode: EventMode.HYBRID,
        status: EventStatus.UPCOMING,
        eventDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // in 20 days
        duration: '2 Days (10 AM - 4 PM)',
        locationOrPlatform: 'KARPI Training Lab & Online Stream',
        description: 'Code alongside mentors to create a fully functional, responsive web application from design wireframe to live production deployment on Vercel.',
        speakerName: 'Vikramaditya Rao',
        speakerRole: 'Senior Full-Stack Engineer',
        speakerOrg: 'KARPI Education',
        bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        registrationStatus: 'Filling Fast',
        registrationLink: '#enquire',
      },
      {
        title: 'Webinar: Demystifying Git, GitHub & Open Source Contributions',
        slug: 'webinar-git-github-opensource',
        type: EventType.WEBINAR,
        mode: EventMode.ONLINE,
        status: EventStatus.COMPLETED,
        eventDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        duration: '2 Hours',
        locationOrPlatform: 'YouTube Live & Meet Recording',
        description: 'Learned branching strategies, pull requests, merge conflict resolution, and submitting your first meaningful open-source contribution.',
        speakerName: 'Siddharth Verma',
        speakerRole: 'DevOps & Tooling Specialist',
        speakerOrg: 'KARPI Tech Community',
        bannerUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80',
        registrationStatus: 'Completed',
        registrationLink: '#',
      },
    ]);
  }

  // 6. Seed Gallery Items (Verified Activities & Workshops)
  const galleryCount = await galleryRepo.count();
  if (galleryCount === 0) {
    console.log('Seeding gallery items...');
    await galleryRepo.save([
      {
        title: 'College Technical Seminar on Cloud Fundamentals',
        category: GalleryCategory.SEMINARS,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
        caption: 'Over 250 engineering undergraduates attending KARPI guest lecture on Cloud Computing and distributed systems.',
        location: 'College Seminar Hall, Bangalore',
        eventDate: new Date('2024-09-18'),
      },
      {
        title: 'Hands-on Web Dev Workshop & Code Lab',
        category: GalleryCategory.WORKSHOPS,
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
        caption: 'Students building interactive React interfaces during our weekend hands-on web development bootcamp.',
        location: 'KARPI Technical Lab',
        eventDate: new Date('2024-10-05'),
      },
      {
        title: 'Intensive Linux & DevOps Practical Lab',
        category: GalleryCategory.TRAINING,
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        caption: 'Working through containerization scenarios, Docker multi-stage builds, and reverse proxy setup.',
        location: 'Computer Science Department Lab',
        eventDate: new Date('2024-11-12'),
      },
      {
        title: 'Group Code Review & Problem Solving Session',
        category: GalleryCategory.STUDENTS,
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
        caption: 'Students collaborating on algorithmic challenges and discussing time-space trade-offs in small peer groups.',
        location: 'Classroom Hub',
        eventDate: new Date('2024-12-02'),
      },
      {
        title: 'Course Completion & Project Showcase Day',
        category: GalleryCategory.CERTIFICATIONS,
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
        caption: 'Graduates presenting their capstone full-stack and cloud projects to guest technical evaluators.',
        location: 'KARPI Training Center',
        eventDate: new Date('2025-01-20'),
      },
      {
        title: 'Campus Hackathon Mentoring Session',
        category: GalleryCategory.CAMPUS,
        imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
        caption: 'Mentoring student hackathon teams during a 24-hour campus innovation hackathon.',
        location: 'Campus Incubation Center',
        eventDate: new Date('2025-02-15'),
      },
    ]);
  }

  // 7. Seed Testimonials
  const testimonialCount = await testimonialRepo.count();
  if (testimonialCount === 0) {
    console.log('Seeding testimonials...');
    await testimonialRepo.save([
      {
        studentName: 'Harish R.',
        collegeOrRole: 'BE Computer Science (2024 Graduate)',
        currentCompany: 'Software Engineer @ FinTech Systems',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        quote: 'Before KARPI, college labs were mostly textbook rote learning. The full-stack program gave me true project confidence. Building an end-to-end API with TypeScript and deploying it on AWS was what got me through technical interviews!',
        courseTaken: 'Modern Full-Stack Engineering',
        rating: 5,
        isFeatured: true,
      },
      {
        studentName: 'Sneha Patel',
        collegeOrRole: 'Information Technology Graduate',
        currentCompany: 'Cloud Associate @ Enterprise Cloud Partner',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        quote: 'The AWS practical sessions were incredible. Instead of just memorizing slides, the mentors had us architect VPCs, handle failover scenarios, and manage IAM access. The hands-on discipline is unmatched.',
        courseTaken: 'AWS Cloud Architecture Mastery',
        rating: 5,
        isFeatured: true,
      },
      {
        studentName: 'Vignesh M.',
        collegeOrRole: 'BCA Final Year Student',
        currentCompany: 'Junior Backend Developer',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        quote: 'I attended KARPI’s 2-day technical seminar at our college and immediately enrolled in the offline coaching. The direct instructor interaction and personalized code feedback made all the difference in my confidence.',
        courseTaken: 'Offline Technical Coaching & DSA',
        rating: 5,
        isFeatured: true,
      },
    ]);
  }

  console.log('✅ Seeding completed successfully!');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});

