# Getting Started
First install dependencies
```bash
npm install
```
To run application in development mode
```bash
npm run dev
```
To run application build
```bash
npm run build
npm run start
```
To run test suites 
```bash
npm run test
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.


# Project Structure and Development Guide

## Project Structure

The project follows a modular structure, organized by features and functionality:

### **Directory Overview**
Routing convention is same as base framework NextJS.
```
src/
	├── app/
	│   ├── seasons/
	│   │   ├── _components/        # Reusable components specific to the 'seasons' feature
	│   │   ├── _services/          # Services (e.g., API calls) related to the 'seasons' feature
	│   │   │   ├── models/         # TypeScript models for the 'seasons' service
	│   │   ├── seasons.service.ts  # Core service logic for seasons
	│   |   ├── [year]/
	│   │   |   ├── _components/        # Reusable components specific to the dynamic year feature
	│   │   |   ├── races/[round]/      # Nested dynamic routes (e.g., year/races/round)
	|   |   |   |   ├── page.module.scss # Scoped styles for the dynamic 'round' page
	|   |   |   |   ├── page.spec.tsx    # Unit tests for the dynamic 'round' page
	|   |   |   |   ├── page.tsx         # NextJS page for the dynamic 'year' route
	│   │   │   ├── page.module.scss  # Scoped styles for the page
	│   │   │   ├── page.spec.tsx    # Unit tests for the page
	│   │   │   ├── page.tsx         # NextJS component for the route
	│   │   ├── page.module.scss     # Scoped styles for the dynamic 'year' page
	│   │   ├── page.spec.tsx        # Unit tests for the dynamic 'year' page
	│   │   ├── page.tsx             # NextJS page for the dynamic 'year' route
	│   ├── page.tsx                 # Main entry page of the app
	├── shared/
	│   ├── components/             # Shared components used across features
	│   ├── hooks/                  # Custom hooks for reusable logic
	│   ├── utils.ts                # Utility functions
	├── favicon.ico             # Application icon
	├── globals.css             # Global CSS styles
	├── layout.tsx              # Layout component for the app
``` 

----------

## Guide for Adding New Features or Pages

### **Adding a New Page**
Routing follows NextJS conventions.

1.  **Determine the Route:**
    
    -   Decide where the new page will fit within the `app/` directory structure.
    -   Use dynamic routing (e.g., `[param]`) if the page depends on dynamic data.
2.  **Create the Page Component:**
    
    -   Add a new folder in the appropriate location within `app/`.
    -   Inside the folder, create:
        -   `page.tsx`: The main React component for the page.
        -   `page.module.scss`: The scoped styles for the page.
        -   `page.spec.tsx`: Unit tests for the page.
    
    **Example:** To add a new "drivers" page under a specific year:
    
    
    ```
    app/[year]/drivers/
	    ├── page.module.scss
	    ├── page.spec.tsx
	    ├── page.tsx
    ``` 
    
3.  **Write the Component Logic:**
    
    -   Implement the necessary JSX and functionality in `page.tsx`.
    -   Import any shared components from `shared/components` as needed.
4.  **Style the Page:**
    
    -   Add scoped styles in `page.module.scss`.
5.  **Add Unit Tests:**
    
    -   Write tests in `page.spec.tsx` to ensure the page behaves as expected.

----------

### **Adding a New Feature**

1.  **Create a Feature Folder:**
    
    -   Add a new folder under `app/` named after the feature (e.g., `drivers`).
2.  **Add Subdirectories:**
    
    -   `_components/`: Store components specific to the feature.
    -   `_services/`: Add services for API calls or logic related to the feature.
    -   `models/`: Define TypeScript models for the service if applicable.
    
    **Example:**
    
   
    
    ```
    app/drivers/
	    ├── _components/
	    ├── _services/
	    │   ├── models/
	    │   ├── drivers.service.ts
	    ├── page.module.scss
	    ├── page.spec.tsx
	    ├── page.tsx
    ``` 
    
3.  **Implement Business Logic:**
    
    -   Write reusable logic in `_services` (e.g., API functions, helpers).
    -   Define data models in `models/` if necessary.
4.  **Test the Feature:**
    -   Add unit tests for pages and components in the `spec.tsx` files.

----------

### **Best Practices**

-   **Reusability:**
    
    -   Use `shared/components` for components that can be used across multiple features.
    -   Use `shared/hooks` for custom hooks.
-   **Scoped Styles:**
    
    -   Keep styles encapsulated within `.module.scss` files.
-   **Dynamic Routes:**
    
    -   Use square brackets (`[param]`) for dynamic segments in the route hierarchy.
-   **Global Styling:**
    
    -   Define global styles in `globals.css` for consistency across the app.
-   **Code Quality:**
    
    -   Maintain unit tests for all pages and services.
    -   Follow consistent naming conventions and adhere to TypeScript best practices.

----------

This structure ensures modularity, scalability, and maintainability of the project.