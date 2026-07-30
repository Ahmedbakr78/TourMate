# TourMate UML Diagrams

This directory contains PlantUML diagram files for the TourMate backend project.

## Files

| File | Description |
|---|---|
| `use-case.puml` | Use case diagram showing actors (Tourist, Admin, Driver, Guide) and system use cases |
| `class-diagram.puml` | Class diagram showing all entities and their relationships |
| `sequence-diagram.puml` | Sequence diagrams for Registration, Trip Creation, Location Polling, and Review flows |
| `activity-diagram.puml` | Activity diagrams for Trip Lifecycle and User Authentication |
| `erd.puml` | Entity Relationship Diagram showing all MongoDB collections with PKs, FKs, and attributes |

## How to Render

### Option 1: VS Code Plugin (Recommended)

1. Install the **PlantUML** extension by jebbs in VS Code
2. Open any `.puml` file
3. Press `Alt+D` to preview the diagram
4. Right-click the preview → "Export Current Diagram" to save as PNG/SVG

### Option 2: PlantUML Online Server

1. Go to [https://www.plantuml.com/plantuml/uml/](https://www.plantuml.com/plantuml/uml/)
2. Paste the content of any `.puml` file (everything between `@startuml` and `@enduml`)
3. Click "Submit" to generate the diagram
4. Download as PNG or SVG

### Option 3: CLI with Java

```bash
# Install PlantUML (requires Java)
# Download plantuml.jar from https://plantuml.com/download

# Render a single file
java -jar plantuml.jar use-case.puml

# Render all files in directory
java -jar plantuml.jar -tsvg docs/uml/*.puml
```

### Option 4: PlantUML Web Editor

1. Go to [https://www.planttext.com/](https://www.planttext.com/)
2. Paste the diagram source code
3. The diagram renders automatically

## Notes

- Sequence diagrams are separated by `@startuml`/`@enduml` blocks (one per flow)
- Activity diagrams use the same pattern for two separate flows
- All diagrams reflect the actual codebase entities, enums, and service logic
