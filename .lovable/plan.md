# Restore CleanRoom workflows in the new interface

## Goal
Create a drop-in replacement for the existing `https://cleanroom-datacleaner.com/app` frontend. Keep the selected obsidian/orange aesthetic while preserving the old frontend’s complete service contract. The Pandas sandbox remains excluded.

## What will be restored
- Dataset upload by browse or drag-and-drop for CSV, TSV, Excel, JSON, Parquet, and ZIP files.
- Plan selection, limits, upgrade/checkout action, and account-aware billing controls provided by the existing service.
- Every cleaning toggle, threshold, encoding, imputation, outlier, scaling, ML task, model, and target-column setting.
- Clean-and-profile execution with progress, error states, and the existing request format.
- Results download, before/after data quality, raw and cleaned previews, run metrics, profile, EDA summary, and generated charts.
- Premium computer-vision ZIP preparation, readiness feedback, previews, manifest, and download.
- Gemini assistant, including per-account key handling, dataset-aware chat, edits, and generated charts.
- Theme preference and existing account/session behavior.

## Interface approach
- Preserve the compact left rail, dark command-center layout, orange accents, technical typography, and mobile bottom navigation.
- Organize the real workflow into focused Overview, Prepare, Results, Vision, and Assistant areas instead of restoring the old long marketing page.
- Use expandable advanced controls to keep the workspace usable without hiding functionality.
- Keep all compatibility IDs and field names required by the existing CleanRoom service.

## Drop-in compatibility
- Keep `/app` as the application location and use same-origin relative `/api/...` requests, matching the current deployment.
- Preserve every backend request shape, form field name, DOM compatibility hook, authentication token, download URL, and payment flow used by the uploaded frontend.
- Make no backend, database, or API changes; deployment is a frontend replacement only.

## Technical details
- Reuse the uploaded service contracts and result rendering behavior rather than inventing replacement endpoints.
- Load the compatibility bridge only in the browser after the required controls exist.
- Remove the Pandas state, endpoint call, editor, and related interface entirely.
- Keep this project on its existing TanStack routing structure.
- Verify file selection, settings, navigation, assistant opening, computer-vision validation, desktop/mobile layout, and build health. Live processing will be verified when the supplied CleanRoom server is reachable; it currently returns a gateway error.
