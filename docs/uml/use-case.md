# Use Case Diagram — TourMate

```mermaid
flowchart TD
    subgraph Actors
        T((Tourist))
        D((Driver))
        G((Guide))
        A((Admin))
    end

    subgraph AuthModule["Auth & User"]
        UC1[Register / Login / Logout]
        UC2[Refresh Token]
        UC3[Update Profile / Change Password]
        UC4[Upload Profile Image]
    end

    subgraph TripModule["Trip"]
        UC5[Create / Edit / Delete Trip]
        UC6[Assign Guide / Driver / Vehicle]
        UC7[Start / Complete / Cancel Trip]
        UC8[Calculate Price]
        UC9[Share / View Shared Trips]
    end

    subgraph TrackingModule["Tracking (Polling)"]
        UC10[Push Driver Location]
        UC11[Poll Driver / Active Trips]
    end

    subgraph ExternalModule["External Geo"]
        UC12[Search POIs (Overpass)]
        UC13[Get Route (OSRM)]
    end

    subgraph CollabModule["Collaboration"]
        UC14[Vote on Place]
        UC15[Write Review]
        UC16[Receive Notifications]
    end

    subgraph LostModule["Lost & Found"]
        UC17[Report Lost Item]
        UC18[Report Found / Close]
    end

    subgraph ResourceModule["Resources"]
        UC19[Browse Places / Guides / Drivers / Vehicles]
    end

    subgraph AdminModule["Admin"]
        UC20[Approve/Reject Guides & Drivers]
        UC21[Block/Unblock Users]
        UC22[View Stats & Reports]
        UC23[Manage Trips]
    end

    T --> UC1 & UC2 & UC3 & UC4
    T --> UC5 & UC6 & UC7 & UC8 & UC9
    T --> UC11 & UC12 & UC13
    T --> UC14 & UC15 & UC16
    T --> UC17 & UC18
    T --> UC19

    D --> UC1 & UC3
    D --> UC10 & UC11
    D --> UC7
    D --> UC19
    D --> UC15

    G --> UC1 & UC3
    G --> UC7
    G --> UC19
    G --> UC15

    A --> UC20 & UC21 & UC22 & UC23
    A --> UC11
    A --> UC19
```
