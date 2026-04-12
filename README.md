# DSA Tracking

A personal Data Structures & Algorithms tracker built with React and Vite. This app is designed to help learners follow the A2Z DSA sheet journey, log solved problems, maintain revision notes, and visualize progress across difficulty levels.

## Project motive

The primary goal of this project is to provide a simple but powerful study companion for DSA preparation:

- Track solved problems from an A2Z-style DSA sheet
- Mark questions as solved, add notes, and flag problems for revision
- Filter and search questions by difficulty, status, or topic
- Persist progress locally through `localStorage`
- Import and export progress as JSON for backup or sharing

## Features

- Progress dashboard with overall completion percentage
- Difficulty breakdown for Easy / Medium / Hard problems
- Search and filter by status, difficulty, and query text
- Question sections grouped by DSA topic and subtopic
- Import / export progress data in JSON format
- Reset progress with a confirmation flow

## Getting started

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in your terminal.

## Build

```bash
npm run build
```

## Notes

- Progress is stored in the browser using `localStorage`
- The app is inspired by the TakeUForward A2Z DSA sheet and built for tracking a DSA journey from zero to pro
- The current implementation is a React + Vite frontend only
