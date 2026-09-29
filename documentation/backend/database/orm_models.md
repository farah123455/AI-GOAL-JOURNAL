# orm_models.py (PostgreSQL Database Schema & Tables)

## 📌 What This File Does
This file contains the **structural blueprints for all tables stored in the PostgreSQL database**. 

Using SQLAlchemy's Object-Relational Mapping (ORM), it maps Python classes directly to database tables. This means backend developers can interact with users, goals, journals, and roadmaps as clean Python objects rather than having to write repetitive, raw SQL queries.

---

## 🗄️ Core Tables Defined in This File

1. **`User` Table (`users`)**:
   - Stores user accounts, emails, display names, and their Firebase UID.
   - Includes Google Calendar sync tokens and refresh credentials.

2. **`Journal` Table (`journals`)**:
   - Stores daily journal entries.
   - Holds encrypted text (`content_encrypted`), audio duration, source (voice vs. text), detected emotion/mood, confidence score, and extracted AI insights.

3. **`Goal` Table (`goals`)**:
   - Tracks user goals, categories (Career, Health, Study, Finance), target deadlines, status (`active`, `completed`, `stalled`), and completion percentages.
   - Includes Google Calendar event IDs for automatic scheduling.

4. **`Progress` Table (`progress`)**:
   - Logs daily progress updates, completed activities, blockers encountered, and consistency metrics linked to specific goals.

5. **`Habit` & `HabitLog` Tables (`habits`, `habit_logs`)**:
   - Tracks recurring daily/weekly habits, streak counts, best streaks, and daily completion timestamps.

6. **`Roadmap` Table (`roadmaps`)**:
   - Stores multi-stage AI-generated execution roadmaps broken down into phases, milestones, and actionable tasks.

7. **`WeeklySummary` Table (`weekly_summaries`)**:
   - Caches AI-generated weekly productivity summaries, strengths, patterns, and coaching reflections.

---

## 🔗 Relationships & Data Integrity
- Every user-owned table has a `user_id` Foreign Key.
- Cascade rules ensure that if a user deletes their account, their private journals, goals, and history are cleanly deleted as well.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"If asked 'What is your database schema?': We use SQLAlchemy ORM connected to PostgreSQL. The schema is organized around the User entity with one-to-many relationships to Journals, Goals, Habits, Progress Logs, and AI Roadmaps. Every user table enforces strict foreign-key isolation and cascade cleanup."*
