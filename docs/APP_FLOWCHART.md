# Financial Insights Application Flow

This document shows the flow of data and user interactions in our Financial Insights application.

## Application Architecture Flowchart

```mermaid
flowchart TD
    subgraph User
        A[User] --> B[Upload CSV Files]
        A --> C[View Dashboard]
        A --> D[Manage Properties]
        A --> E[Analyze Transactions]
        A --> F[Check Investments]
        A --> G[Get AI Insights]
    end

    subgraph FrontendRoutes
        H[LandingPage] --> I[Login/Signup]
        I --> J[Dashboard]
        J --> K[AI Insights]
        J --> L[Help/Support]
    end

    subgraph DashboardTabs
        M[Investments]
        N[Spending]
        O[Transactions]
        P[Properties]
    end

    subgraph DataFlow
        Q[(LocalStorage)] <--> R[Data Processing]
        R --> S[CSV Parsing]
        S --> T[Data Validation]
        T --> U[Store Parsed Data]
        U --> V[Update UI]
    end

    subgraph UIComponents
        W[Navigation]
        X[Charts & Visualizations]
        Y[Tables]
        Z[File Upload UI]
    end

    B --> Z
    Z --> S
    C --> J
    J --> DashboardTabs
    M <--> Q
    N <--> Q
    O <--> Q
    P <--> Q
    R <--> X
    R <--> Y
```

## Data Flow Diagram

```mermaid
flowchart LR
    subgraph User
        A[User] --> B[Upload CSV]
    end

    subgraph CSV_Processing
        B --> C[FileUploadSheet Component]
        C --> D[Validate CSV]
        D --> E{Valid?}
        E -->|Yes| F[parseCSVData]
        E -->|No| G[Show Error Toast]
        F --> H[Process & Transform Data]
    end

    subgraph LocalStorage
        H --> I[Update localStorage]
        I --> J[Dispatch Update Event]
    end

    subgraph UIComponents
        J --> K[Update Investments]
        J --> L[Update Spending]
        J --> M[Update Transactions]
        J --> N[Update Properties]
    end
```

## State Management Flow

```mermaid
flowchart TD
    subgraph UserActions
        A[Upload CSV] --> B[Process Data]
        C[Change Tab] --> D[Select Dashboard View]
    end

    subgraph StateManagement
        B --> E[Update LocalStorage]
        E --> F[Trigger Update Event]
        F --> G[Components Listen for Events]
        G --> H[Re-render Components]
    end

    subgraph ComponentStructure
        I[App] --> J[Layout]
        J --> K[Dashboard]
        K --> L[Tabs Navigation]
        L --> M[InvestmentsDesktop]
        L --> N[Spending]
        L --> O[MonthlyTransactions]
        L --> P[PropertyList]
    end

    D --> L
    H --> M
    H --> N
    H --> O
    H --> P
```

## Component Interaction Diagram

```mermaid
flowchart TD
    subgraph Layout
        A[App.tsx] --> B[Layout Component]
        B --> C[Dashboard Page]
    end

    subgraph DashboardPage
        C --> D[Tabs Navigation]
        C --> E[FileUploadSheet]
        D --> F[TabsContent]
    end

    subgraph TabComponents
        F --> G[InvestmentsDesktop]
        F --> H[Spending]
        F --> I[MonthlyTransactions]
        F --> J[PropertyList]
    end

    subgraph DataServices
        K[csv-storage.ts] --> L[parseCSVData]
        L --> M[getInvestmentsData]
        L --> N[getSpendingData]
        E -.-> L
        G -.-> M
        H -.-> N
        I -.-> N
    end
```

## File Upload Process

```mermaid
sequenceDiagram
    actor User
    participant UI as FileUploadSheet
    participant Validation as CSV Validation
    participant Parser as CSV Parser
    participant Storage as LocalStorage
    participant Components as UI Components

    User->>UI: Click "Upload Data"
    UI->>UI: Open Sheet Modal
    User->>UI: Select CSV File
    User->>UI: Click Upload Button
    UI->>Validation: validateCSV(text)

    alt Valid CSV
        Validation->>Parser: parseCSVData(text)
        Parser->>Storage: Update localStorage data
        Storage->>Storage: Dispatch update event
        Storage->>Components: Listen for event
        Components->>Components: Refresh UI with new data
        UI->>User: Show success toast
    else Invalid CSV
        Validation->>UI: Return false
        UI->>User: Show error toast
    end

    UI->>UI: Reset & Close Modal
```

## Technology Stack and Data Flow

```mermaid
flowchart TB
    subgraph Frontend
        A[React + TypeScript]
        B[React Router]
        C[Tailwind CSS]
        D[Shadcn UI Components]
        E[Tremor Visualizations]
    end

    subgraph DataManagement
        F[CSV Parser]
        G[LocalStorage]
        H[Event Listeners]
    end

    subgraph UserInterface
        I[Dashboard]
        J[Investments View]
        K[Spending View]
        L[Transactions View]
        M[Properties View]
    end

    A --> B
    A --> C
    A --> D
    A --> E

    D --> I
    E --> J
    E --> K
    E --> L
    E --> M

    F --> G
    G --> H
    H --> J
    H --> K
    H --> L
    H --> M
```

The diagrams above illustrate the architecture and flow of the Financial Insights application, showing how data moves from CSV uploads through processing to display in various dashboard components. The application uses local storage for data persistence and leverages React with UI component libraries to create an interactive financial dashboard.
