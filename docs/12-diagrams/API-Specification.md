# 🔌 API Specification - AI-Powered LMS

**Version**: 3.0  
**Date**: 2026-08-25  
**Base URL**: `https://api.yourdomain.com/v1`

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Common Patterns](#common-patterns)
4. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication-endpoints)
   - [Users](#users-endpoints)
   - [Organizations](#organizations-endpoints)
   - [Classes](#classes-endpoints)
   - [Content](#content-endpoints)
   - [Assignments](#assignments-endpoints)
   - [Communication](#communication-endpoints)
   - [Finance](#finance-endpoints)
   - [Analytics](#analytics-endpoints)
5. [WebSocket Events](#websocket-events)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)

---

## Overview

### API Design Principles
- **RESTful**: Standard REST architecture
- **JSON**: All requests/responses in JSON
- **Versioned**: `/v1`, `/v2` for backward compatibility
- **Paginated**: Large lists use cursor pagination
- **Filtered**: Support for filtering, sorting, searching
- **Documented**: OpenAPI/Swagger spec available

### Base Response Format
```json
{
  "success": true,
  "data": { /* response data */ },
  "meta": {
    "timestamp": "2027-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "meta": {
    "timestamp": "2027-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

---

## Authentication

### JWT-Based Authentication

#### Request Headers
```http
Authorization: Bearer {access_token}
Content-Type: application/json
Accept: application/json
X-Organization-ID: {organization_id}  // Optional, for multi-org users
```

#### Token Lifecycle
```
Access Token:  15 minutes (short-lived)
Refresh Token: 7 days (HTTP-only cookie)
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "organizationId": "org_abc123",
  "role": "student"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_xyz789",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "role": "student",
      "status": "active",
      "createdAt": "2027-01-15T10:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

---

### POST /auth/login
Authenticate and receive access token.

**Request:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_xyz789",
      "email": "john.doe@example.com",
      "fullName": "John Doe",
      "role": "student",
      "permissions": ["dashboard:view", "classes:view", "content:view"],
      "organizationId": "org_abc123",
      "branchId": "branch_def456"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

---

### POST /auth/refresh
Refresh access token using refresh token.

**Request:** (Refresh token in HTTP-only cookie)
```json
{}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

---

### POST /auth/logout
Invalidate current session.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

### POST /auth/forgot-password
Request password reset.

**Request:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent"
  }
}
```

---

### POST /auth/reset-password
Reset password with token.

**Request:**
```json
{
  "token": "reset_token_abc123",
  "newPassword": "NewSecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  }
}
```

---

## Users Endpoints

### GET /users
List users (paginated).

**Query Parameters:**
```
?page=1
&limit=20
&role=student
&status=active
&search=john
&sortBy=createdAt
&sortOrder=desc
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_xyz789",
        "email": "john.doe@example.com",
        "fullName": "John Doe",
        "role": "student",
        "status": "active",
        "createdAt": "2027-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### GET /users/:id
Get user by ID.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_xyz789",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "avatarUrl": "https://cdn.example.com/avatars/user_xyz789.jpg",
      "phone": "+84901234567",
      "dateOfBirth": "2000-05-15",
      "gender": "male",
      "address": "123 Main St, District 1",
      "city": "Ho Chi Minh",
      "province": "Ho Chi Minh",
      "country": "VN",
      "role": "student",
      "permissions": ["dashboard:view", "classes:view"],
      "status": "active",
      "preferences": {
        "theme": "light",
        "language": "vi",
        "notifications": {
          "email": true,
          "push": true,
          "sms": false
        }
      },
      "organizationId": "org_abc123",
      "branchId": "branch_def456",
      "createdAt": "2027-01-15T10:30:00Z",
      "updatedAt": "2027-01-15T10:30:00Z"
    }
  }
}
```

---

### POST /users
Create new user.

**Request:**
```json
{
  "email": "jane.smith@example.com",
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "teacher",
  "branchId": "branch_def456",
  "phone": "+84901234568",
  "dateOfBirth": "1990-03-20",
  "gender": "female"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_abc456",
      "email": "jane.smith@example.com",
      "fullName": "Jane Smith",
      "role": "teacher",
      "status": "active",
      "createdAt": "2027-01-15T11:00:00Z"
    }
  }
}
```

---

### PATCH /users/:id
Update user.

**Request:**
```json
{
  "firstName": "Jane",
  "phone": "+84901234569",
  "preferences": {
    "theme": "dark"
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_abc456",
      "firstName": "Jane",
      "phone": "+84901234569",
      "updatedAt": "2027-01-15T11:30:00Z"
    }
  }
}
```

---

### DELETE /users/:id
Soft delete user.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "User deleted successfully"
  }
}
```

---

### GET /users/me
Get current user profile.

**Response:** `200 OK` (Same structure as GET /users/:id)

---

### PATCH /users/me
Update current user profile.

**Request:**
```json
{
  "firstName": "John",
  "avatarUrl": "https://cdn.example.com/avatars/new.jpg"
}
```

**Response:** `200 OK`

---

### POST /users/me/change-password
Change current user password.

**Request:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

**Response:** `200 OK`

---

## Classes Endpoints

### GET /classes
List classes.

**Query Parameters:**
```
?page=1
&limit=20
&status=ongoing
&branchId=branch_def456
&programId=prog_ghi789
&teacherId=user_abc456
&search=English
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "classes": [
      {
        "id": "class_xyz123",
        "code": "ENG-B1-001",
        "name": "English Basic Level 1",
        "programId": "prog_ghi789",
        "programName": "English for Beginners",
        "branchId": "branch_def456",
        "branchName": "Main Branch",
        "startDate": "2027-02-01",
        "endDate": "2027-05-01",
        "schedule": [
          {
            "day": "monday",
            "time": "18:00",
            "duration": 90
          },
          {
            "day": "wednesday",
            "time": "18:00",
            "duration": 90
          }
        ],
        "deliveryMode": "hybrid",
        "maxStudents": 20,
        "enrolledStudents": 15,
        "primaryTeacher": {
          "id": "user_abc456",
          "fullName": "Jane Smith"
        },
        "status": "ongoing",
        "createdAt": "2027-01-10T09:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

---

### GET /classes/:id
Get class details.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "class": {
      "id": "class_xyz123",
      "code": "ENG-B1-001",
      "name": "English Basic Level 1",
      "description": "Foundation English course for beginners",
      "programId": "prog_ghi789",
      "program": {
        "id": "prog_ghi789",
        "name": "English for Beginners",
        "level": "beginner"
      },
      "branchId": "branch_def456",
      "branch": {
        "id": "branch_def456",
        "name": "Main Branch"
      },
      "startDate": "2027-02-01",
      "endDate": "2027-05-01",
      "schedule": [
        {
          "day": "monday",
          "time": "18:00",
          "duration": 90
        }
      ],
      "deliveryMode": "hybrid",
      "meetingUrl": "https://zoom.us/j/123456789",
      "meetingId": "123 456 789",
      "roomId": "room_abc123",
      "room": {
        "id": "room_abc123",
        "name": "Room 301",
        "capacity": 25
      },
      "maxStudents": 20,
      "minStudents": 5,
      "enrolledStudents": 15,
      "primaryTeacher": {
        "id": "user_abc456",
        "fullName": "Jane Smith",
        "email": "jane.smith@example.com",
        "avatarUrl": "https://cdn.example.com/avatars/user_abc456.jpg"
      },
      "assistantTeacher": null,
      "status": "ongoing",
      "createdAt": "2027-01-10T09:00:00Z",
      "updatedAt": "2027-01-15T10:00:00Z"
    }
  }
}
```

---

### POST /classes
Create new class.

**Request:**
```json
{
  "code": "ENG-B1-002",
  "name": "English Basic Level 1 - Evening",
  "programId": "prog_ghi789",
  "branchId": "branch_def456",
  "startDate": "2027-03-01",
  "endDate": "2027-06-01",
  "schedule": [
    {"day": "tuesday", "time": "19:00", "duration": 90},
    {"day": "thursday", "time": "19:00", "duration": 90}
  ],
  "deliveryMode": "online",
  "maxStudents": 25,
  "primaryTeacherId": "user_abc456"
}
```

**Response:** `201 Created`

---

### PATCH /classes/:id
Update class.

**Request:**
```json
{
  "maxStudents": 30,
  "deliveryMode": "flexible"
}
```

**Response:** `200 OK`

---

### DELETE /classes/:id
Delete class (soft delete).

**Response:** `200 OK`

---

### GET /classes/:id/enrollments
Get class enrollments.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "id": "enroll_xyz789",
        "student": {
          "id": "user_student123",
          "fullName": "John Doe",
          "email": "john.doe@example.com",
          "avatarUrl": "..."
        },
        "enrolledAt": "2027-01-20T10:00:00Z",
        "status": "active",
        "paymentStatus": "paid",
        "attendanceRate": 95.5,
        "averageGrade": 85.2
      }
    ]
  }
}
```

---

### POST /classes/:id/enroll
Enroll student in class.

**Request:**
```json
{
  "studentId": "user_student123",
  "originalPrice": 5000000,
  "discountAmount": 500000,
  "finalPrice": 4500000
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "enrollment": {
      "id": "enroll_xyz789",
      "studentId": "user_student123",
      "classId": "class_xyz123",
      "enrolledAt": "2027-01-20T10:00:00Z",
      "finalPrice": 4500000,
      "status": "active"
    }
  }
}
```

---

### GET /classes/:id/sessions
Get class sessions.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "session_abc123",
        "sessionNumber": 1,
        "title": "Introduction to English Alphabet",
        "scheduledAt": "2027-02-01T18:00:00Z",
        "duration": 90,
        "deliveryMode": "offline",
        "room": {
          "id": "room_abc123",
          "name": "Room 301"
        },
        "status": "completed",
        "attendanceTaken": true,
        "recordingUrl": null
      }
    ]
  }
}
```

---

### POST /classes/:id/sessions
Create session.

**Request:**
```json
{
  "sessionNumber": 10,
  "title": "Past Tense Review",
  "scheduledAt": "2027-03-15T18:00:00Z",
  "duration": 90,
  "deliveryMode": "online",
  "lessonPlan": "Review all past tense forms..."
}
```

**Response:** `201 Created`

---

## Content Endpoints

### GET /content
List content (Digital Library).

**Query Parameters:**
```
?page=1
&limit=20
&type=video
&category=grammar
&level=beginner
&language=vi
&search=tense
&sortBy=createdAt
&sortOrder=desc
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "content_xyz789",
        "title": "Present Simple Tense Explained",
        "description": "Complete guide to present simple tense",
        "contentType": "video",
        "thumbnailUrl": "https://cdn.example.com/thumbnails/content_xyz789.jpg",
        "duration": 900,
        "category": "grammar",
        "tags": ["grammar", "tenses", "present-simple"],
        "level": "beginner",
        "language": "vi",
        "viewCount": 1250,
        "likeCount": 85,
        "averageRating": 4.5,
        "createdBy": {
          "id": "user_teacher123",
          "fullName": "Teacher Name"
        },
        "status": "published",
        "publishedAt": "2027-01-10T10:00:00Z",
        "createdAt": "2027-01-09T15:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 350,
      "totalPages": 18
    }
  }
}
```

---

### GET /content/:id
Get content details.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "content": {
      "id": "content_xyz789",
      "title": "Present Simple Tense Explained",
      "description": "Complete guide to present simple tense with examples",
      "contentType": "video",
      "originalUrl": "https://storage.example.com/content/original/xyz789.mp4",
      "processedUrls": {
        "1080p": "https://cdn.example.com/content/xyz789_1080p.mp4",
        "720p": "https://cdn.example.com/content/xyz789_720p.mp4",
        "480p": "https://cdn.example.com/content/xyz789_480p.mp4",
        "360p": "https://cdn.example.com/content/xyz789_360p.mp4"
      },
      "thumbnailUrl": "https://cdn.example.com/thumbnails/content_xyz789.jpg",
      "fileSize": 150000000,
      "duration": 900,
      "mimeType": "video/mp4",
      "transcript": "Hello everyone, today we'll learn about...",
      "category": "grammar",
      "tags": ["grammar", "tenses", "present-simple", "beginner"],
      "industry": "language",
      "level": "beginner",
      "language": "vi",
      "aiTags": ["verb-forms", "sentence-structure"],
      "aiSummary": "This video covers the basics of present simple tense...",
      "difficultyScore": 2.5,
      "accessLevel": "enrolled",
      "viewCount": 1250,
      "likeCount": 85,
      "averageRating": 4.5,
      "completionRate": 72.3,
      "createdBy": {
        "id": "user_teacher123",
        "fullName": "Teacher Name",
        "avatarUrl": "..."
      },
      "processingStatus": "completed",
      "status": "published",
      "publishedAt": "2027-01-10T10:00:00Z",
      "createdAt": "2027-01-09T15:00:00Z",
      "updatedAt": "2027-01-10T10:00:00Z"
    }
  }
}
```

---

### POST /content
Upload new content.

**Request:** (multipart/form-data)
```
file: [binary]
title: "Past Tense Exercises"
description: "Practice exercises for past tense"
contentType: "document"
category: "grammar"
tags: ["grammar", "past-tense", "exercises"]
level: "intermediate"
language: "vi"
accessLevel: "enrolled"
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "content": {
      "id": "content_new123",
      "title": "Past Tense Exercises",
      "processingStatus": "pending",
      "status": "draft"
    },
    "uploadUrl": "https://storage.example.com/upload/content_new123"
  }
}
```

---

### PATCH /content/:id
Update content metadata.

**Request:**
```json
{
  "title": "Present Simple Tense - Updated",
  "tags": ["grammar", "tenses", "present-simple", "beginner", "updated"],
  "status": "published"
}
```

**Response:** `200 OK`

---

### DELETE /content/:id
Delete content.

**Response:** `200 OK`

---

### GET /content/:id/progress
Get user's progress on content.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "progress": {
      "contentId": "content_xyz789",
      "userId": "user_student123",
      "progressPercent": 75.5,
      "currentPosition": 675,
      "completed": false,
      "totalTimeSpent": 800,
      "viewCount": 2,
      "bookmarks": [
        {
          "time": 120,
          "note": "Important: Verb forms"
        },
        {
          "time": 450,
          "note": "Practice section"
        }
      ],
      "rating": 5,
      "lastViewedAt": "2027-01-15T14:30:00Z"
    }
  }
}
```

---

### POST /content/:id/progress
Update content progress.

**Request:**
```json
{
  "progressPercent": 80.0,
  "currentPosition": 720,
  "totalTimeSpent": 850
}
```

**Response:** `200 OK`

---

### POST /content/:id/complete
Mark content as completed.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "progress": {
      "contentId": "content_xyz789",
      "completed": true,
      "completedAt": "2027-01-15T15:00:00Z"
    }
  }
}
```

---

### POST /content/:id/rate
Rate content.

**Request:**
```json
{
  "rating": 5
}
```

**Response:** `200 OK`

---

### GET /content/recommendations
Get AI-powered recommendations for current user.

**Query Parameters:**
```
?limit=10
&context=current-learning
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "content": {
          "id": "content_rec123",
          "title": "Past Simple Tense",
          "thumbnailUrl": "...",
          "duration": 600
        },
        "reason": "Next in learning path",
        "score": 0.95
      }
    ]
  }
}
```

---

## Assignments Endpoints

### GET /assignments
List assignments.

**Query Parameters:**
```
?classId=class_xyz123
&type=essay
&status=published
&dueAfter=2027-01-15
&dueBefore=2027-02-15
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "id": "assign_abc123",
        "classId": "class_xyz123",
        "className": "English Basic Level 1",
        "title": "Essay: My Hometown",
        "description": "Write a 300-word essay about your hometown",
        "assignmentType": "essay",
        "totalPoints": 40,
        "passingScore": 24,
        "aiGradingEnabled": true,
        "dueDate": "2027-01-25T23:59:59Z",
        "maxAttempts": 1,
        "published": true,
        "publishedAt": "2027-01-10T10:00:00Z",
        "createdBy": {
          "id": "user_teacher123",
          "fullName": "Teacher Name"
        },
        "submissionStats": {
          "total": 15,
          "submitted": 12,
          "graded": 8,
          "pending": 4
        },
        "createdAt": "2027-01-09T15:00:00Z"
      }
    ]
  }
}
```

---

### GET /assignments/:id
Get assignment details.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "assignment": {
      "id": "assign_abc123",
      "classId": "class_xyz123",
      "title": "Essay: My Hometown",
      "description": "Write a 300-word essay describing your hometown",
      "instructions": "Include: location, population, famous places, personal memories",
      "assignmentType": "essay",
      "content": {
        "wordLimit": 300,
        "format": "paragraph"
      },
      "rubric": {
        "criteria": [
          {
            "name": "Content",
            "maxPoints": 10,
            "description": "Relevance and completeness"
          },
          {
            "name": "Grammar",
            "maxPoints": 10,
            "description": "Accuracy of grammar"
          },
          {
            "name": "Vocabulary",
            "maxPoints": 10,
            "description": "Range and appropriateness"
          },
          {
            "name": "Structure",
            "maxPoints": 10,
            "description": "Organization and flow"
          }
        ]
      },
      "totalPoints": 40,
      "passingScore": 24,
      "aiGradingEnabled": true,
      "aiGradingModel": "gpt-4",
      "requireTeacherReview": true,
      "availableFrom": "2027-01-10T00:00:00Z",
      "dueDate": "2027-01-25T23:59:59Z",
      "lateSubmissionAllowed": true,
      "latePenaltyPercent": 10,
      "maxAttempts": 1,
      "published": true,
      "createdBy": {
        "id": "user_teacher123",
        "fullName": "Teacher Name"
      },
      "createdAt": "2027-01-09T15:00:00Z"
    }
  }
}
```

---

### POST /assignments
Create assignment.

**Request:**
```json
{
  "classId": "class_xyz123",
  "title": "Speaking: Introduce Yourself",
  "description": "Record a 2-minute self-introduction",
  "assignmentType": "speaking",
  "content": {
    "duration": 120,
    "topics": ["name", "age", "hobbies", "goals"]
  },
  "rubric": {
    "criteria": [
      {"name": "Pronunciation", "maxPoints": 25},
      {"name": "Fluency", "maxPoints": 25},
      {"name": "Grammar", "maxPoints": 25},
      {"name": "Vocabulary", "maxPoints": 25}
    ]
  },
  "totalPoints": 100,
  "passingScore": 60,
  "aiGradingEnabled": true,
  "dueDate": "2027-02-01T23:59:59Z",
  "maxAttempts": 2
}
```

**Response:** `201 Created`

---

### POST /assignments/ai-generate
AI-generate assignment.

**Request:**
```json
{
  "classId": "class_xyz123",
  "topic": "Present Simple Tense",
  "assignmentType": "multiple-choice",
  "level": "beginner",
  "questionCount": 20,
  "duration": 30,
  "focusAreas": ["affirmative", "negative", "questions"]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "assignment": {
      "id": "assign_generated123",
      "title": "Present Simple Tense Quiz",
      "assignmentType": "multiple-choice",
      "content": {
        "questions": [
          {
            "question": "She _____ to school every day.",
            "options": ["go", "goes", "going", "went"],
            "correctAnswer": 1,
            "explanation": "'Goes' is the correct form..."
          }
        ]
      },
      "status": "draft"
    }
  }
}
```

---

### GET /assignments/:id/submissions
Get assignment submissions.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "sub_xyz123",
        "student": {
          "id": "user_student123",
          "fullName": "John Doe",
          "avatarUrl": "..."
        },
        "attemptNumber": 1,
        "submittedAt": "2027-01-20T15:30:00Z",
        "status": "graded",
        "isLate": false,
        "grade": {
          "score": 35,
          "maxScore": 40,
          "percentage": 87.5,
          "letterGrade": "B+",
          "status": "published"
        }
      }
    ]
  }
}
```

---

### POST /assignments/:id/submit
Submit assignment.

**Request:**
```json
{
  "answers": {
    "essay": "My hometown is a small city in central Vietnam..."
  },
  "attachments": []
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "sub_new123",
      "assignmentId": "assign_abc123",
      "studentId": "user_student123",
      "attemptNumber": 1,
      "submittedAt": "2027-01-20T15:30:00Z",
      "status": "submitted",
      "message": "Your submission is being graded by AI. You'll receive results soon."
    }
  }
}
```

---

### GET /submissions/:id
Get submission details.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "sub_xyz123",
      "assignment": {
        "id": "assign_abc123",
        "title": "Essay: My Hometown",
        "totalPoints": 40
      },
      "student": {
        "id": "user_student123",
        "fullName": "John Doe"
      },
      "attemptNumber": 1,
      "answers": {
        "essay": "My hometown is Hue, a beautiful city..."
      },
      "submittedAt": "2027-01-20T15:30:00Z",
      "timeSpent": 1800,
      "status": "graded",
      "isLate": false,
      "grade": {
        "id": "grade_abc123",
        "score": 35,
        "maxScore": 40,
        "percentage": 87.5,
        "letterGrade": "B+",
        "rubricScores": {
          "Content": 9,
          "Grammar": 8,
          "Vocabulary": 9,
          "Structure": 9
        },
        "feedback": "Excellent essay! Clear structure and good vocabulary...",
        "aiFeedback": "Strengths: Good use of descriptive language...",
        "teacherFeedback": "Well done! Pay attention to past tense consistency.",
        "isAiGraded": true,
        "aiConfidence": 0.92,
        "teacherReviewed": true,
        "teacherAdjusted": true,
        "originalAiScore": 34,
        "status": "published",
        "publishedAt": "2027-01-21T10:00:00Z"
      }
    }
  }
}
```

---

### POST /submissions/:id/grade
Grade submission (Teacher).

**Request:**
```json
{
  "score": 35,
  "maxScore": 40,
  "rubricScores": {
    "Content": 9,
    "Grammar": 8,
    "Vocabulary": 9,
    "Structure": 9
  },
  "teacherFeedback": "Well done! Pay attention to tense consistency.",
  "publish": true
}
```

**Response:** `200 OK`

---

## Communication Endpoints

### GET /messages
Get messages (inbox).

**Query Parameters:**
```
?page=1
&limit=20
&type=received
&channelId=channel_abc123
&unreadOnly=true
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_xyz789",
        "sender": {
          "id": "user_teacher123",
          "fullName": "Teacher Name",
          "avatarUrl": "..."
        },
        "recipient": {
          "id": "user_student123",
          "fullName": "John Doe"
        },
        "content": "Hello, how are you doing with the assignment?",
        "messageType": "text",
        "isRead": false,
        "createdAt": "2027-01-20T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45
    }
  }
}
```

---

### POST /messages
Send message.

**Request:**
```json
{
  "recipientId": "user_teacher123",
  "content": "I have a question about assignment #5",
  "messageType": "text"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "msg_new123",
      "senderId": "user_student123",
      "recipientId": "user_teacher123",
      "content": "I have a question about assignment #5",
      "createdAt": "2027-01-20T15:00:00Z"
    }
  }
}
```

---

### PATCH /messages/:id/read
Mark message as read.

**Response:** `200 OK`

---

### GET /notifications
Get notifications.

**Query Parameters:**
```
?page=1
&limit=20
&unreadOnly=true
&type=assignment_due
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_xyz789",
        "type": "assignment_due",
        "title": "Assignment due soon",
        "body": "Essay: My Hometown is due in 2 days",
        "actionUrl": "/assignments/assign_abc123",
        "relatedEntityType": "assignment",
        "relatedEntityId": "assign_abc123",
        "priority": "high",
        "isRead": false,
        "createdAt": "2027-01-23T09:00:00Z"
      }
    ],
    "unreadCount": 5
  }
}
```

---

### PATCH /notifications/:id/read
Mark notification as read.

**Response:** `200 OK`

---

### POST /notifications/read-all
Mark all notifications as read.

**Response:** `200 OK`

---

## Finance Endpoints

### GET /invoices
List invoices.

**Query Parameters:**
```
?page=1
&limit=20
&studentId=user_student123
&paymentStatus=unpaid
&dueBefore=2027-02-01
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "inv_xyz789",
        "invoiceNumber": "INV-2027-0001",
        "student": {
          "id": "user_student123",
          "fullName": "John Doe"
        },
        "subtotal": 5000000,
        "discountAmount": 500000,
        "taxAmount": 0,
        "totalAmount": 4500000,
        "currency": "VND",
        "issueDate": "2027-01-15",
        "dueDate": "2027-01-30",
        "paymentStatus": "unpaid",
        "paidAmount": 0,
        "createdAt": "2027-01-15T10:00:00Z"
      }
    ]
  }
}
```

---

### GET /invoices/:id
Get invoice details.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "invoice": {
      "id": "inv_xyz789",
      "invoiceNumber": "INV-2027-0001",
      "student": {
        "id": "user_student123",
        "fullName": "John Doe",
        "email": "john.doe@example.com"
      },
      "enrollment": {
        "id": "enroll_abc123",
        "class": {
          "id": "class_xyz123",
          "name": "English Basic Level 1"
        }
      },
      "billingName": "John Doe",
      "billingEmail": "john.doe@example.com",
      "billingPhone": "+84901234567",
      "billingAddress": "123 Main St, District 1, Ho Chi Minh",
      "items": [
        {
          "description": "English Basic Level 1 - Tuition Fee",
          "quantity": 1,
          "unitPrice": 5000000,
          "amount": 5000000
        }
      ],
      "subtotal": 5000000,
      "discountAmount": 500000,
      "taxAmount": 0,
      "totalAmount": 4500000,
      "currency": "VND",
      "issueDate": "2027-01-15",
      "dueDate": "2027-01-30",
      "paymentStatus": "unpaid",
      "paidAmount": 0,
      "notes": "Early bird discount applied",
      "createdAt": "2027-01-15T10:00:00Z"
    }
  }
}
```

---

### POST /invoices
Create invoice.

**Request:**
```json
{
  "studentId": "user_student123",
  "enrollmentId": "enroll_abc123",
  "items": [
    {
      "description": "English Basic Level 1 - Tuition",
      "quantity": 1,
      "unitPrice": 5000000,
      "amount": 5000000
    }
  ],
  "subtotal": 5000000,
  "discountAmount": 500000,
  "totalAmount": 4500000,
  "issueDate": "2027-01-15",
  "dueDate": "2027-01-30"
}
```

**Response:** `201 Created`

---

### POST /invoices/:id/pay
Record payment.

**Request:**
```json
{
  "amount": 4500000,
  "paymentMethod": "bank-transfer",
  "paymentDate": "2027-01-20",
  "transferReference": "REF123456",
  "notes": "Transferred via Vietcombank"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "pay_abc123",
      "invoiceId": "inv_xyz789",
      "amount": 4500000,
      "paymentMethod": "bank-transfer",
      "status": "completed",
      "receiptNumber": "REC-2027-0001"
    },
    "invoice": {
      "paymentStatus": "paid",
      "paidAmount": 4500000,
      "paidAt": "2027-01-20T14:00:00Z"
    }
  }
}
```

---

## Analytics Endpoints

### GET /analytics/dashboard
Get dashboard metrics.

**Query Parameters:**
```
?period=month
&startDate=2027-01-01
&endDate=2027-01-31
&branchId=branch_def456
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "metrics": {
      "students": {
        "total": 150,
        "new": 25,
        "active": 140,
        "growth": 20
      },
      "classes": {
        "total": 15,
        "ongoing": 12,
        "completed": 2,
        "avgEnrollment": 14.5
      },
      "revenue": {
        "total": 225000000,
        "paid": 200000000,
        "pending": 25000000,
        "growth": 15.5
      },
      "engagement": {
        "avgAttendanceRate": 92.5,
        "avgAssignmentCompletion": 85.3,
        "avgContentViews": 450
      }
    }
  }
}
```

---

### GET /analytics/reports/student-performance
Get student performance report.

**Query Parameters:**
```
?studentId=user_student123
&period=semester
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "student": {
      "id": "user_student123",
      "fullName": "John Doe"
    },
    "period": {
      "type": "semester",
      "start": "2027-01-01",
      "end": "2027-05-31"
    },
    "attendance": {
      "totalSessions": 40,
      "attended": 38,
      "rate": 95.0
    },
    "grades": {
      "assignments": 12,
      "averageScore": 85.5,
      "trend": "improving"
    },
    "engagement": {
      "contentViewed": 45,
      "totalLearningTime": 18000,
      "completionRate": 88.9
    },
    "competencies": [
      {
        "name": "Grammar",
        "level": "proficient",
        "progress": 85
      }
    ]
  }
}
```

---

## WebSocket Events

### Connection
```javascript
// Connect to WebSocket
const socket = io('wss://api.yourdomain.com', {
  auth: {
    token: 'your_access_token'
  }
});

// Connection successful
socket.on('connected', (data) => {
  console.log('Connected:', data.userId);
});
```

---

### Events

#### new_message
Receive new message.
```json
{
  "event": "new_message",
  "data": {
    "id": "msg_new123",
    "sender": {
      "id": "user_teacher123",
      "fullName": "Teacher Name"
    },
    "content": "Hello!",
    "createdAt": "2027-01-20T15:00:00Z"
  }
}
```

---

#### notification
Receive notification.
```json
{
  "event": "notification",
  "data": {
    "id": "notif_new123",
    "type": "grade_published",
    "title": "Your assignment has been graded",
    "body": "Essay: My Hometown - Score: 87.5%",
    "actionUrl": "/submissions/sub_xyz123"
  }
}
```

---

#### grade_ready
Grade published.
```json
{
  "event": "grade_ready",
  "data": {
    "submissionId": "sub_xyz123",
    "assignmentTitle": "Essay: My Hometown",
    "score": 35,
    "maxScore": 40,
    "percentage": 87.5
  }
}
```

---

#### user_online / user_offline
User presence change.
```json
{
  "event": "user_online",
  "data": {
    "userId": "user_abc123",
    "timestamp": "2027-01-20T15:00:00Z"
  }
}
```

---

## Error Handling

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | No permission |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (duplicate) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service down |

### Error Response Examples

#### Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

#### Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

#### Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to access this resource"
  }
}
```

---

## Rate Limiting

### Limits
- **Global**: 100 requests per minute per IP
- **Authenticated**: 1000 requests per minute per user
- **AI Endpoints**: 10 requests per minute per user
- **Auth Endpoints**: 5 requests per minute per IP

### Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1705747200
```

### Rate Limit Exceeded Response
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 60
  }
}
```

---

## Pagination

### Query Parameters
```
?page=1          # Page number (1-indexed)
&limit=20        # Items per page (max 100)
&sortBy=createdAt
&sortOrder=desc  # asc or desc
```

### Response Meta
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Versioning

API versioning via URL path:
```
/v1/users       # Version 1 (current)
/v2/users       # Version 2 (future)
```

Backward compatibility maintained for at least 6 months after new version release.

---

## OpenAPI/Swagger

Full OpenAPI 3.0 specification available at:
```
GET /api-docs
GET /api-docs/swagger.json
```

Interactive API documentation (Swagger UI):
```
https://api.yourdomain.com/api-docs
```

---

**Last Updated**: 2026-08-25  
**API Version**: 1.0  
**Contact**: api-support@yourdomain.com
