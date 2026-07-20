# Activity Diagram — Driver Journey

```mermaid
flowchart TD
    Start([Register / Login as Driver]) --> Verify{Verified by Admin?}
    Verify -- No --> Pending[Wait for Approval]
    Pending --> Verify
    Verify -- Yes --> Dash[Open Driver Dashboard]
    Dash --> Avail{Set availability}
    Avail --> On[availability=true]
    On --> Assign{Assigned to trip?}
    Assign -- No --> Poll[Poll for assignments]
    Poll --> Assign
    Assign -- Yes --> Trip[View Trip Details]
    Trip --> Track[Push Location Periodically (polling)]
    Track --> Active{Trip started?}
    Active -- No --> Wait[Wait for tourist to start]
    Wait --> Active
    Active -- Yes --> Drive[Drive / Service Trip]
    Drive --> Complete{Trip completed?}
    Complete -- No --> Track
    Complete -- Yes --> Done[(Trip Done)]
    Done --> Review[Receive Review]
    Review --> Dash
```
