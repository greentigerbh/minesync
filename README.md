⛏️ CoalMine Safety Intelligence Platform

From raw mine-site signals to actionable safety intelligence.

Smart India Hackathon 2026 · Problem Statement PS 26025 — Coal Mine Safety

A centralized Mine Safety Intelligence Platform designed to combine IoT sensing, edge computing, computer vision, AI/ML-based risk analysis, geospatial monitoring, and cloud infrastructure into a unified safety-monitoring system.

🧭 Overview

Open-cast coal mines operate in dynamic environments where equipment movement, terrain conditions, restricted zones, visibility, and other operational factors can change continuously.

Safety information may originate from multiple independent sources such as sensors and cameras. Monitoring these sources separately can make it difficult to build a unified understanding of the current mine condition.

Field Sensors + Cameras
          ↓
ESP32 + Raspberry Pi Edge Layer
          ↓
Sensor Processing + Computer Vision
          ↓
Risk Intelligence Engine
          ↓
AWS / Cloud Infrastructure
          ↓
Backend / REST APIs
          ↓
Real-Time Safety Dashboard

🎯 Problem Statement
The Challenge

Coal-mine safety monitoring involves multiple information sources:

Equipment movement
Abnormal motion or vibration
Camera-based observations
Visibility-related conditions
Restricted-zone activity
Environmental observations
Potential safety incidents
Mine operational status

When these sources are isolated, operators may need to interpret multiple streams of information independently.

The engineering challenge is therefore to build a system that can:

Collect information from multiple sources.
Process selected data at the edge.
Analyze sensor and visual observations.
Identify abnormal or potentially hazardous conditions.
Convert observations into understandable risk states.
Store and manage relevant data.
Present the resulting information through a centralized interface.

💡 Our Solution

The proposed solution is a Mine Safety Intelligence Platform that combines physical sensing, edge computing, computer vision, AI/ML, cloud infrastructure, and a web-based dashboard.

The system follows a distributed architecture:


<img width="1173" height="276" alt="image" src="https://github.com/user-attachments/assets/701454e9-b58d-4c1e-a9dc-5c7635a12f86" />


✨ Key Features
📡 Real-Time Monitoring

Collects observations from connected sensors and monitoring devices and makes them available to the central safety pipeline.

🧠 Risk Intelligence

Processes incoming observations and classifies conditions into understandable safety states.

👁️ Computer Vision

Uses camera data as an additional information source for detecting configurable visual conditions.

📍 Geospatial Mine Monitoring

Provides a foundation for representing mine locations, operational zones, and safety events geographically.

☁️ Cloud Data Infrastructure

Uses AWS infrastructure, including Amazon S3, for storing project data and assets.

📊 Centralized Safety Dashboard

Provides a unified interface for monitoring mine status, safety events, sensor information, camera information, and analytics.

🚦 Safety State Model

The platform represents conditions using three primary states:

State	Interpretation
🟢 NORMAL	No configured condition currently requiring escalation
🟡 WARNING	A condition requires attention or further observation
🔴 CRITICAL	A configured high-risk condition requiring immediate attention

Important: These are prototype-level classifications. They are not official mining safety limits or certified operational thresholds.

🏗️ System Architecture

The platform consists of five logical layers.

1. Field Layer

The field layer contains the physical observation sources:

ESP32
MPU6050
Camera
Other supported sensing inputs

This layer interacts directly with the physical environment.

2. Edge Layer

The edge layer consists primarily of:

ESP32
Raspberry Pi 4

The ESP32 handles sensor-side operations, while the Raspberry Pi provides local computing capabilities for camera processing and other edge workloads.

Why Edge Computing?

Processing information closer to its source can:

Reduce unnecessary transmission of raw data.
Enable local preprocessing.
Support time-sensitive processing.
Reduce dependency on continuous cloud communication for selected workloads.
3. Intelligence Layer

The intelligence layer processes observations using:

Python
Sensor-processing logic
Computer vision
AI/ML models
Risk-analysis logic

The purpose of this layer is to transform raw observations into meaningful events and safety states.

4. Cloud Layer

The cloud layer provides centralized storage and application infrastructure.

The current project architecture uses:

AWS
Amazon S3

S3 can be used for project assets such as:

Images
JSON data
Dataset files
Mine-related application assets
5. Application Layer

The application layer provides the human-facing safety dashboard.

Technologies include:

HTML
JavaScript
Tailwind CSS

The dashboard brings processed information into a single operational view.

🔄 Data Flow
Sensor Data Pipeline

<img width="1171" height="586" alt="image" src="https://github.com/user-attachments/assets/419a3e1a-dbe1-4ef2-b6aa-9e5851bbc94c" />

Camera Data Pipeline

<img width="965" height="534" alt="image" src="https://github.com/user-attachments/assets/9d2f4f62-c0b0-4307-acd7-c5ce07bb8d29" />

Both pipelines converge at the Risk Intelligence Engine, allowing different information sources to contribute to the same safety-monitoring workflow.

🔌 Hardware Architecture
Component	Purpose
Raspberry Pi 4	Edge processing and camera-side computation
ESP32	Sensor controller and communication
MPU6050	Motion/orientation sensing
USB / Raspberry Pi Camera	Visual monitoring


<img width="1161" height="740" alt="image" src="https://github.com/user-attachments/assets/dce94bc4-0b7c-4a9e-befc-d4b0d6cbcf66" />

👁️ AI & Computer Vision
Computer vision provides a second information channel alongside physical sensors.

The conceptual pipeline is:
<img width="939" height="461" alt="image" src="https://github.com/user-attachments/assets/4605992a-ccc6-4b0a-aff4-3b316c3a9037" />

The architecture can support compatible approaches such as:

OpenCV-based processing
YOLO-family object detection
Custom CNN models
Other ML/CV inference pipelines

The final model depends on the specific hazards being detected, available training data, edge-computing constraints, and validation requirements.

No fabricated metrics

This project does not claim a specific AI accuracy, precision, recall, FPS, or benchmark unless it has been experimentally measured and documented.

🧠 Risk Intelligence Engine

The Risk Intelligence Engine acts as the bridge between raw observations and operator-facing safety information.

<img width="1175" height="389" alt="image" src="https://github.com/user-attachments/assets/3db149b2-1be0-410a-a19e-94cd2188dce3" />

A future multi-modal implementation can combine several observations:
<img width="429" height="389" alt="image" src="https://github.com/user-attachments/assets/2552b2f3-f9b9-4ae6-a0e8-f4543caf5074" />

☁️ AWS Cloud Architecture
The prototype incorporates AWS as its cloud infrastructure layer.

<img width="1128" height="326" alt="image" src="https://github.com/user-attachments/assets/8372317b-e7f0-48db-8c58-4aac90e75364" />

📊 Safety Dashboard

The dashboard is the centralized interface of the platform.

It is designed to provide visibility into:

🟢 Overall mine status
🚨 Active safety events
📡 Sensor status
📷 Camera status
📍 Mine zones
🗺️ Geospatial information
📈 Historical events
🖼️ Visual data
📊 Safety analytics

The overall philosophy is:
<img width="342" height="252" alt="image" src="https://github.com/user-attachments/assets/85fe1a14-4d92-4f1b-9dd5-f393ac2ce8a9" />

🗺️ Geospatial Monitoring

Mine safety information can be associated with geographical locations and operational zones.
The geospatial layer can represent:

<img width="381" height="441" alt="image" src="https://github.com/user-attachments/assets/efdb49bd-33bf-4ae0-acf6-ce6ce2fa1d12" />

🧩 Technology Stack| Category        | Technology                   |
| --------------- | ---------------------------- |
| Programming     | Python                       |
| Frontend        | HTML, JavaScript             |
| Styling         | Tailwind CSS                 |
| Edge Computing  | Raspberry Pi 4               |
| Microcontroller | ESP32                        |
| Motion Sensing  | MPU6050                      |
| Camera          | USB / Raspberry Pi Camera    |
| Computer Vision | OpenCV / compatible CV stack |
| AI/ML           | ML/CV inference              |
| Cloud           | AWS                          |
| Object Storage  | Amazon S3                    |
| Communication   | REST APIs                    |
| Data Format     | JSON                         |


🔐 Security

Security is particularly important for systems handling operational and safety-related information.

Prototype Security

The project should:

Keep credentials outside source control.
Use environment variables for configuration.
Validate incoming data.
Restrict cloud access.
Maintain appropriate application logs.
Production Security


A real deployment would additionally require consideration of:

IAM least privilege
Device authentication
API authentication
TLS/HTTPS
Secure device provisioning
Credential rotation
Audit logging
Network segmentation
Secure firmware updates
Monitoring and incident response

