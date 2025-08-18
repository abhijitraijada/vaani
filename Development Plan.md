<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Event Management System - Development Plan

## UI Development Plan - User Wise \& Screen Wise

### **1. PARTICIPANT INTERFACE**

#### **1.1 Home Page**

**Components:**

- Header with event info
- Hero section with event details
- 'Participate' button (primary CTA)
- 'Check Status' section (phone number input)
- Footer with contact info

**Features:**

- Event information display
- Navigation to registration
- Status checking functionality


#### **1.2 Registration Type Selection**

**Components:**

- Individual/Group selection radio buttons
- Next button
- Back to home link

**Features:**

- Toggle between individual and group registration


#### **1.3 Personal Details Form**

**Components:**

- Individual fields: Name, email, phone, city, age, floor, language
- Group size dropdown (if group selected)
- Dynamic accordion for group members
- Transport type selection (Public/Private)
- Private vehicle details (if applicable)
- Available seats input (if private vehicle with space)
- Next button

**Features:**

- Form validation
- Dynamic form fields based on selections
- Group member management


#### **1.4 Daily Preferences Forms (4 screens - one per day)**

**Components:**

- Date header (Oct 31, Nov 1, Nov 2, Nov 3)
- Staying with yatra (Yes/No)
- Meal preferences (Dinner/Breakfast at host, Lunch with yatra)
- Physical limitations input
- Toilet preference (Indian/Western)
- Warning messages for non-staying participants
- Next/Previous buttons

**Features:**

- Progressive form filling
- Conditional field display
- Validation and warnings


#### **1.5 Review \& Confirmation**

**Components:**

- Summary of all selections
- Date-wise preference display
- Edit buttons for each section
- Submit button
- Terms and conditions

**Features:**

- Complete registration review
- Navigation to edit previous steps
- Final submission


#### **1.6 Status Check Page**

**Components:**

- Phone number input
- Search button
- Registration details display
- Host assignment status
- Date-wise accommodation details

**Features:**

- Registration lookup
- Status display
- Host contact information


### **2. MANAGER INTERFACE**

#### **2.1 Login Page**

**Components:**

- Phone number input
- Password input
- Login button
- Error messages

**Features:**

- Authentication
- Input validation
- Error handling


#### **2.2 Manager Dashboard**

**Components:**

- Dashboard header with user info
- Tab navigation (Participants, Hosts)
- Statistics overview
- Logout button

**Features:**

- Tab switching
- Overview metrics
- Session management


#### **2.3 Participants Tab**

**Components:**

- Participants list/table
- Search and filter options
- Status indicators
- Clickable participant names
- Pagination

**Features:**

- Participant management
- Search functionality
- Status tracking


#### **2.4 Participant Details Page**

**Components:**

- Participant information display
- Host assignment section
- Host selection dropdown/table with checkboxes
- Assignment history
- Save/Update buttons

**Features:**

- Detailed participant view
- Host assignment functionality
- Assignment tracking


#### **2.5 Hosts Tab**

**Components:**

- 'Add Host' button
- Hosts list/table
- Host capacity indicators
- Search and filter options
- Clickable host names

**Features:**

- Host management
- Capacity tracking
- Host creation


#### **2.6 Add Host Modal/Form**

**Components:**

- Host details form (Name, Place, Phone, Capacity)
- Facilities checkboxes (Toilet types)
- Gender preference selection
- Ground floor availability
- Save/Cancel buttons

**Features:**

- Host registration
- Facility specification
- Capacity management


#### **2.7 Host Details Page**

**Components:**

- Host information display
- Current assignments list
- Available participants for assignment
- Assignment/removal controls
- Capacity utilization display

**Features:**

- Host management
- Participant assignment
- Capacity monitoring


### **3. HOST INTERFACE**

#### **3.1 Host Home Page**

**Components:**

- Phone number input
- Search button
- Assigned participants display
- Contact information
- Event details

**Features:**

- Simple participant lookup
- Assignment viewing
- Contact display


### **4. ADMIN INTERFACE**

#### **4.1 Login Page**

Same as Manager login

#### **4.2 Admin Dashboard**

**Components:**

- Dashboard header
- Tab navigation (Participants, Hosts, Empty Seats, Events)
- Comprehensive statistics
- System overview metrics

**Features:**

- Complete system overview
- Multi-tab management
- Advanced analytics


#### **4.3 Enhanced Participants/Hosts Tabs**

All Manager features with modal-based interactions

#### **4.4 Empty Seats Tab**

**Components:**

- Vehicle owners list
- Available seats display
- Assignment controls
- Public transport participants list

**Features:**

- Vehicle management
- Seat assignment
- Transport coordination


#### **4.5 Events Tab**

**Components:**

- 'Create Event' button
- Current events list
- Event management controls

**Features:**

- Event creation
- Event management
- System configuration


#### **4.6 Create Event Modal**

**Components:**

- Event details form
- Date range selectors
- Meal configuration
- Location details
- Organizer information

**Features:**

- Event setup
- Configuration management
- System initialization

***

## API Responses with Mock Data

### **1. PARTICIPANT APIS**

#### **POST /api/participants/register**

**Description:** Register new participant(s)

**Request Body Example:**

```json
{
  "registration_type": "individual",
  "participants": [
    {
      "name": "John Doe",
      "email": "john@example.com", 
      "phone": "+91-9876543210",
      "city": "Mumbai",
      "age": 28,
      "floor_preference": "ground",
      "language": "English",
      "transport_type": "private",
      "vehicle_details": {
        "has_empty_seats": true,
        "available_seats": 2
      },
      "daily_preferences": {
        "2025-10-31": {
          "staying_with_yatra": true,
          "dinner_at_host": true,
          "breakfast_at_host": true,
          "lunch_with_yatra": true,
          "physical_limitations": "None",
          "toilet_preference": "western"
        },
        "2025-11-01": {
          "staying_with_yatra": true,
          "dinner_at_host": true,
          "breakfast_at_host": true,
          "lunch_with_yatra": true,
          "physical_limitations": "None",
          "toilet_preference": "western"
        },
        "2025-11-02": {
          "staying_with_yatra": true,
          "dinner_at_host": true,
          "breakfast_at_host": true,
          "lunch_with_yatra": true,
          "physical_limitations": "None",
          "toilet_preference": "western"
        },
        "2025-11-03": {
          "staying_with_yatra": false,
          "lunch_with_yatra": true
        }
      }
    }
  ]
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Registration successful",
  "participant_ids": ["PART_001"],
  "registration_number": "REG_2025_001"
}
```


#### **GET /api/participants/status/{phone}**

**Description:** Get participant status by phone number

**Response Example:**

```json
{
  "success": true,
  "participant": {
    "id": "PART_001",
    "name": "John Doe",
    "phone": "+91-9876543210",
    "registration_number": "REG_2025_001",
    "registration_date": "2025-08-08T11:52:00Z",
    "status": "registered",
    "host_assignments": {
      "2025-10-31": {
        "host_name": "Rajesh Kumar",
        "host_phone": "+91-9876543211",
        "address": "Village Kumta, Karnataka",
        "facilities": ["western_toilet", "ground_floor"]
      },
      "2025-11-01": {
        "host_name": "Priya Sharma", 
        "host_phone": "+91-9876543212",
        "address": "Village Kumta, Karnataka",
        "facilities": ["indian_toilet", "first_floor"]
      },
      "2025-11-02": null,
      "2025-11-03": null
    },
    "transport_assignment": {
      "type": "private_vehicle",
      "assigned_passengers": ["PART_045", "PART_067"]
    }
  }
}
```


### **2. AUTHENTICATION APIS**

#### **POST /api/auth/login**

**Description:** Login for Manager/Admin

**Request Body Example:**

```json
{
  "phone": "+91-9876543210",
  "password": "secure_password",
  "user_type": "manager"
}
```

**Response Example:**

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "MGR_001",
    "phone": "+91-9876543210",
    "user_type": "manager",
    "permissions": ["view_participants", "manage_hosts", "assign_participants"]
  }
}
```


### **3. DATA SYNC API**

#### **GET /api/data/sync**

**Description:** Get all data for frontend with timestamp for offline capability

**Response Example:**

```json
{
  "success": true,
  "last_updated": "2025-08-08T11:52:00Z",
  "data": {
    "participants": [
      {
        "id": "PART_001",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+91-9876543210",
        "city": "Mumbai",
        "age": 28,
        "registration_date": "2025-08-08T10:30:00Z",
        "status": "assigned",
        "transport_type": "private",
        "vehicle_capacity": 2,
        "group_size": 1,
        "daily_preferences": {
          "2025-10-31": {
            "staying_with_yatra": true,
            "meal_preferences": {
              "dinner_at_host": true,
              "breakfast_at_host": true,
              "lunch_with_yatra": true
            },
            "physical_limitations": "None",
            "toilet_preference": "western"
          }
        },
        "host_assignments": {
          "2025-10-31": "HOST_001",
          "2025-11-01": "HOST_002",
          "2025-11-02": null,
          "2025-11-03": null
        }
      }
    ],
    "hosts": [
      {
        "id": "HOST_001",
        "name": "Rajesh Kumar",
        "place": "Village Kumta",
        "phone": "+91-9876543211",
        "capacity": 4,
        "current_occupancy": {
          "2025-10-31": 2,
          "2025-11-01": 1,
          "2025-11-02": 0,
          "2025-11-03": 0
        },
        "facilities": {
          "toilets": ["western", "indian"],
          "gender_preference": "both",
          "ground_floor_available": true
        },
        "assigned_participants": {
          "2025-10-31": ["PART_001", "PART_023"],
          "2025-11-01": ["PART_045"],
          "2025-11-02": [],
          "2025-11-03": []
        }
      }
    ],
    "events": [
      {
        "id": "EVENT_001",
        "name": "Yatra 2025",
        "start_date": "2025-10-31",
        "end_date": "2025-11-03",
        "location": {
          "name": "Kumta Village",
          "maps_link": "https://maps.google.com/..."
        },
        "meal_configuration": {
          "2025-10-31": {
            "breakfast_provided": true,
            "lunch_provided": true,
            "dinner_provided": true
          }
        },
        "organizers": [
          {
            "name": "Organizer 1",
            "contact": "+91-9876543213",
            "email": "org1@example.com"
          }
        ]
      }
    ],
    "statistics": {
      "total_participants": 245,
      "total_hosts": 68,
      "participants_assigned": 180,
      "participants_pending": 65,
      "host_utilization": 75.5,
      "transport_summary": {
        "private_vehicles": 89,
        "public_transport": 156,
        "available_seats": 34
      }
    }
  }
}
```


### **4. MANAGEMENT APIS**

#### **POST /api/hosts**

**Description:** Add new host

**Request Body Example:**

```json
{
  "name": "New Host Name",
  "place": "Village Name",
  "phone": "+91-9876543214",
  "capacity": 6,
  "facilities": {
    "toilets": ["western", "indian"],
    "gender_preference": "both",
    "ground_floor_available": true
  }
}
```

**Response Example:**

```json
{
  "success": true,
  "host_id": "HOST_045",
  "message": "Host added successfully"
}
```


#### **PUT /api/participants/{participant_id}/assign-host**

**Description:** Assign host to participant

**Request Body Example:**

```json
{
  "host_id": "HOST_001",
  "date": "2025-10-31"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Host assigned successfully"
}
```


### **5. HOST LOOKUP API**

#### **GET /api/hosts/lookup/{phone}**

**Description:** Get host details and assigned participants

**Response Example:**

```json
{
  "success": true,
  "host": {
    "name": "Rajesh Kumar",
    "phone": "+91-9876543211",
    "place": "Village Kumta",
    "assigned_participants": {
      "2025-10-31": [
        {
          "name": "John Doe",
          "phone": "+91-9876543210",
          "age": 28,
          "city": "Mumbai",
          "meal_preferences": {
            "dinner_at_host": true,
            "breakfast_at_host": true
          },
          "special_requirements": "Western toilet preference"
        }
      ],
      "2025-11-01": [],
      "2025-11-02": [],
      "2025-11-03": []
    }
  }
}
```


***

## Development Plan \& Technical Recommendations

### **DEVELOPMENT PHASES**

#### **Phase 1 - Core Participant System (Week 1-2):**

- Home page with event information
- Participant registration flow (individual)
- Multi-step form implementation
- Basic validation and data storage
- Status checking functionality


#### **Phase 2 - Group Registration \& Transport (Week 2-3):**

- Group registration with dynamic forms
- Transport type selection and seat management
- Daily preferences forms for all 4 dates
- Registration review and submission
- Email/SMS confirmations


#### **Phase 3 - Management Interface (Week 3-4):**

- Manager authentication system
- Participants dashboard with search/filter
- Host management system
- Basic assignment functionality
- Host registration forms


#### **Phase 4 - Advanced Management (Week 4-5):**

- Admin interface with all features
- Vehicle/seat assignment system
- Event creation functionality
- Advanced analytics and reporting
- Bulk operations


#### **Phase 5 - Optimization \& Deployment (Week 5-6):**

- Offline capability implementation
- Data sync optimization
- Performance testing
- Mobile responsiveness
- Production deployment


### **TECHNICAL RECOMMENDATIONS**

#### **Frontend:**

- **Framework:** React.js with TypeScript
- **State Management:** Redux Toolkit or Zustand
- **UI:** Tailwind CSS (utility-first, no component library)
- **Form Management:** React Hook Form with Yup validation
- **Offline Storage:** IndexedDB with Dexie.js
- **PWA:** Service Worker for offline capability


#### **Backend:**

- **Framework:** FastAPI (Python)
- **Database:** MySQL with proper indexing
- **Authentication:** JWT with refresh tokens
- **API Documentation:** Swagger/OpenAPI
- **File Storage:** Local storage or AWS S3
- **Caching:** Redis for session management


#### **Deployment:**

- **Frontend:** Netlify or Vercel
- **Backend:** Railway, Heroku, or AWS EC2
- **Database:** Railway MySQL or AWS RDS (MySQL)
- **Monitoring:** Sentry for error tracking
- **Analytics:** Google Analytics or Mixpanel


### **KEY IMPLEMENTATION NOTES**

#### **Data Sync Strategy:**

- Single API endpoint (/api/data/sync) returns all data with timestamp
- Frontend checks timestamp on app load
- Only fetch new data if timestamp is newer
- Store all data in IndexedDB for offline access
- Implement optimistic updates for better UX


#### **Form Management:**

- Use step-based form with local state persistence
- Validate each step before allowing progression
- Save draft data to localStorage
- Implement form auto-save every 30 seconds
- Clear draft on successful submission


#### **Search \& Filter Implementation:**

- All search/filter operations on frontend
- Use fuzzy search for participant names
- Implement advanced filters (status, date, city, etc.)
- Save filter preferences in localStorage
- Export filtered data functionality


#### **Assignment Logic:**

- Match participants to hosts based on facilities
- Consider gender preferences and toilet requirements
- Prioritize ground floor for age-related needs
- Implement capacity management with warnings
- Track assignment history for auditing

***

## Complete API Endpoints Reference

| Method | Endpoint | Auth | Access | Description |
| :-- | :-- | :-- | :-- | :-- |
| POST | /api/participants/register | 🔓 Public | Public | Register new participant(s) |
| GET | /api/participants/status/{phone} | 🔓 Public | Public | Get participant status |
| POST | /api/auth/login | 🔓 Public | Manager/Admin | Authenticate users |
| GET | /api/data/sync | 🔒 Auth Required | Manager/Admin | Get all system data |
| GET | /api/participants | 🔒 Auth Required | Manager/Admin | Get all participants |
| GET | /api/participants/{id} | 🔒 Auth Required | Manager/Admin | Get specific participant |
| PUT | /api/participants/{id} | 🔒 Auth Required | Manager/Admin | Update participant |
| DELETE | /api/participants/{id} | 🔒 Auth Required | Admin only | Remove participant |
| PUT | /api/participants/{id}/assign-host | 🔒 Auth Required | Manager/Admin | Assign host |
| PUT | /api/participants/{id}/assign-transport | 🔒 Auth Required | Admin only | Assign transport |
| GET | /api/hosts | 🔒 Auth Required | Manager/Admin | Get all hosts |
| POST | /api/hosts | 🔒 Auth Required | Manager/Admin | Add new host |
| GET | /api/hosts/{id} | 🔒 Auth Required | Manager/Admin | Get specific host |
| PUT | /api/hosts/{id} | 🔒 Auth Required | Manager/Admin | Update host |
| DELETE | /api/hosts/{id} | 🔒 Auth Required | Admin only | Remove host |
| GET | /api/hosts/lookup/{phone} | 🔓 Public | Host/Public | Host lookup |
| GET | /api/events | 🔒 Auth Required | Manager/Admin | Get all events |
| POST | /api/events | 🔒 Auth Required | Admin only | Create new event |
| PUT | /api/events/{id} | 🔒 Auth Required | Admin only | Update event |
| GET | /api/statistics | 🔒 Auth Required | Manager/Admin | Get statistics |
| GET | /api/reports/participants | 🔒 Auth Required | Manager/Admin | Export participants |
| GET | /api/reports/hosts | 🔒 Auth Required | Manager/Admin | Export hosts |
| GET | /api/reports/assignments | 🔒 Auth Required | Manager/Admin | Export assignments |

### **Key Notes:**

- All authenticated endpoints require JWT token in Authorization header
- Public endpoints (registration, status check, host lookup) do not require auth
- Manager has access to participant and host management
- Admin has full system access including events and transport management
- The `/api/data/sync` endpoint is crucial for offline functionality
- All search/filter operations should be performed on frontend for better performance

This comprehensive development plan provides a complete roadmap for building the event management system with proper offline capabilities, user role management, and efficient data synchronization as specified in your requirements.

