# Activity Diagram — Guide Journey

```mermaid
flowchart TD
    Start([Register / Login as Guide]) --> Verify{Verified by Admin?}
    Verify -- No --> Pending[Wait for Approval / Upload Certificate]
    Pending --> Verify
    Verify -- Yes --> Dash[Open Guide Dashboard]
    Dash --> Avail{Set availability}
    Avail --> On[availability=true]
    On --> Assign{Assigned to trip?}
    Assign -- No --> Poll[Poll for assignments]
    Poll --> Assign
    Assign -- Yes --> Trip[View Trip & Itinerary]
    Trip --> Active{Trip started?}
    Active -- No --> Wait[Wait for start]
    Wait --> Active
    Active -- Yes --> Serve[Guide Tourists]
    Serve --> Complete{Trip completed?}
    Complete -- No --> Serve
    Complete -- Yes --> Done[(Trip Done)]
    Done --> Review[Receive Review]
    Review --> Dash
```
