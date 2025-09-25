# Plant Parent Hub CRM

A Salesforce-based **Customer Relationship Management (CRM)** application designed for plant enthusiasts to manage their personal plant collections. The system digitizes and automates plant care tracking, providing a seamless, secure, and visually engaging experience.

---

## **Table of Contents**
- [Overview](#overview)
- [Objectives](#objectives)
- [Features](#features)
- [Data Model](#data-model)
- [Technology Stack](#technology-stack)
- [Setup & Installation](#setup--installation)
- [Lightning Web Components](#lightning-web-components)
- [Automation](#automation)
- [Security](#security)
- [Reports & Dashboards](#reports--dashboards)
- [Testing](#testing)
- [Future Enhancements](#future-enhancements)
- [Author](#author)

---

## **Overview**
The **Plant Parent Hub CRM** provides a centralized platform for hobbyists to:
- Log plant care activities like watering, fertilizing, and repotting.
- Automatically calculate next watering dates.
- Visualize their collection through a dynamic gallery.
- Securely access data through a public **Digital Experience site**.

This replaces spreadsheets or manual notes with a modern, secure Salesforce solution.

---

## **Objectives**
- Create a **single source of truth** for plant care data.
- Automate repetitive tasks like care reminders.
- Provide a **secure, multi-user platform**.
- Enhance user engagement with visually appealing, intuitive tools.
- Maintain data integrity and improve plant care decisions.

---

## **Features**
- **Plant Management:** Track plant species, location, watering schedules, and photos.
- **Care Logs:** Maintain detailed history of care activities.
- **Dynamic Gallery:** View plants in an interactive interface.
- **Automated Permissions:** Seamless onboarding for new users.
- **Validation Rules:** Prevent invalid data entries.
- **Reports & Dashboards:** Analyze collection health and upcoming tasks.
- **External Site Access:** Public-facing, secure experience for plant enthusiasts.

---

## **Data Model**
Two core custom objects:

### **Plant__c**
| Field Label         | Field Name              | Data Type            |
|--------------------|-------------------------|----------------------|
| Plant Name          | Name                    | Text(80)             |
| Species            | Species__c              | Text(255)            |
| Date Acquired      | Date_Acquired__c        | Date                 |
| Last Watered Date  | Last_Watered_Date__c    | Date                 |
| Next Watering Date | Next_Watering_Date__c    | Formula (Date)       |
| Location           | Location__c             | Picklist              |
| Sunlight Needs     | Sunlight_Needs__c       | Picklist              |
| Water Frequency    | Water_Frequency_Days__c | Number(2,0)           |
| Plant Picture URL  | Plant_Picture_URL__c     | URL(255)             |
| Description        | Description__c          | Long Text Area        |

### **Care_Log__c**
| Field Label    | Field Name          | Data Type                     |
|---------------|---------------------|--------------------------------|
| Care Log #     | Name                | Auto Number                    |
| Action Taken  | Action_Taken__c      | Picklist                        |
| Log Date      | Log_Date__c          | Date/Time                       |
| Notes         | Notes__c             | Long Text Area                   |
| Plant         | Plant__c             | Master-Detail Relationship       |

Relationship: **Plant__c (Master)** → **Care_Log__c (Detail)**

---

## **Technology Stack**
- **Salesforce Platform**
  - Custom Objects & Fields
  - Apex Classes & Triggers
  - Lightning Web Components (LWC)
  - Flows & Validation Rules
  - Reports & Dashboards
- **Tools:**
  - Visual Studio Code with Salesforce Extensions
  - Salesforce CLI (SFDX)

---

## **Setup & Installation**

### **Prerequisites:**
- Salesforce Developer Edition or Trailhead Playground
- VS Code with Salesforce Extensions installed
- Salesforce CLI configured

### **Steps:**
1. Clone the repository:
   ```bash
   git clone https://github.com/Vinamra1113/salesforce-academic-management-system.git
   cd salesforce-academic-management-system
   ```
2. Authorize your Salesforce org:
   ```bash
   sf org login web -a PlantParentHub
   ```
3. Deploy metadata:
   ```bash
   sf project deploy start
   ```
4. Assign the **Plant Hub User** permission set to new users.
5. Enable **Digital Experience** and configure login policies.
6. Import sample data using the **Data Import Wizard**.

---

## **Lightning Web Components**
| Component           | Purpose |
|--------------------|---------|
| `plantTile`         | Displays individual plant cards |
| `plantGallery`      | Gallery view with search & filter functionality |
| `careLogList`       | Displays plant care history |
| `plantDetailViewer` | Detailed modal with plant info & care logs |
| `plantEditor`       | Create/Edit plant records |
| `plantManager`      | Main container & controller component |

---

## **Automation**
### **Flows:**
- Auto-assign permission sets to new community users.

### **Validation Rules:**
- Ensure positive watering frequency.
- Prevent future acquisition or watering dates.

### **Apex Trigger:**
- Automatically assigns the "Plant Hub User" permission set post-registration.

---

## **Security**
- **OWD (Org-Wide Defaults):** Private for Plant__c.
- **Profiles:** Base access for community users.
- **Permission Sets:** `Plant Hub User` for object & field-level permissions.
- **CSP Trusted Sites:** Added to allow image display from Salesforce Files.

---

## **Reports & Dashboards**
- **Reports:**
  - *My Plants Overview*
  - *Plants That Need Water*
- **Dashboard:** Plant Parent Hub - quick insights into plant health.

---

## **Testing**
- Manual testing for new user registration, plant creation, and validation rules.
- Next steps:
  - Implement comprehensive Apex test classes for all controllers and triggers.
  - Achieve **75%+ code coverage** for production deployment.

---

## **Future Enhancements**
- Image upload using `lightning-file-upload` instead of URLs.
- Delete confirmation modals.
- Scheduled Flows for daily watering reminder emails.
- Record Types for "Indoor" and "Outdoor" plants.
- Comprehensive Apex test classes for code quality.

---

## **Author**
**Vinamra Jain**

---

## **License**
This project is intended for educational purposes and Salesforce development demonstrations.
