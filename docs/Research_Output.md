# Software Design Patterns Research Output

## Creational Patterns
### 1. Factory Method
* **Category:** Creational
* **Problem it solves:** Providing an interface for creating objects in a superclass, but allowing subclasses (or specific factory classes) to alter the type of objects that will be created. It abstracts the instantiation process.
* **How it works:** Instead of calling `new`, a factory method is called to create objects. This decouples the client from the concrete classes it needs to instantiate.
* **Real-world example:** A UI framework that has a generic `Dialog` class, which uses a factory method `createButton()`. A `WindowsDialog` returns a `WindowsButton`, while a `WebDialog` returns an `HTMLButton`.
* **Possible use case:** Creating different types of `User` entities (e.g., standard login users vs OAuth users) with pre-filled default settings.

### 2. Singleton
* **Category:** Creational
* **Problem it solves:** Ensures that a class has only one single instance globally, and provides a global point of access to that instance.
* **How it works:** A class hides its constructor (making it private) and provides a static `getInstance()` method that returns the internally maintained single instance.
* **Real-world example:** A Database Connection Pool or a Logger service, where multiple originators must use the exact same connections or write to the same log file without clashing.
* **Possible use case:** Creating a unified `ApiService` or `AxiosClient` in a React application to ensure API configurations (like JWT interceptors) are applied uniformly and never duplicated.

---

## Structural Patterns
### 3. Facade
* **Category:** Structural
* **Problem it solves:** Providing a simplified, high-level interface to a complex subsystem of classes or APIs, making the system easier to use.
* **How it works:** A single Facade class wraps all the complex interdependencies and exposes simple methods to the client, delegating calls backward to the appropriate subsystems.
* **Real-world example:** Setting up a smart home context. Instead of commanding lights, thermostat, and locks separately, a `SmartHomeFacade` might provide a `movieMode()` method that dims lights, lowers blinds, and secures locks in one call.
* **Possible use case:** An `AuthFacade` in the backend that handles validating users, persisting to a database, and issuing JWT tokens, so the Controller only has to make one clean method call.

### 4. Adapter
* **Category:** Structural
* **Problem it solves:** Allows objects with incompatible interfaces to collaborate. It acts as a wrapper that translates one interface into another that a client expects.
* **How it works:** The adapter implements the interface that the client understands, and internally routes and formats those calls into a format that the wrapped legacy or external class expects.
* **Real-world example:** An application reading XML data needs to pass that data to an external analytics library that only understands JSON. An `XmlToJsonAdapter` bridges the gap without touching either source code base.
* **Possible use case:** Wrapping an external SDK (like Google Authentication or a Payment Gateway) into a generic interface so that the application is not tightly coupled to third-party specifics.

---

## Behavioral Patterns
### 5. Strategy
* **Category:** Behavioral
* **Problem it solves:** Defining a family of algorithms, encapsulating each one, and making them interchangeable. Strategy lets the algorithm vary independently from clients that use it.
* **How it works:** The context class maintains a reference to a Strategy interface. Whenever the behavior needs to execute, the context delegates to the chosen Strategy.
* **Real-world example:** A navigation app calculating routes. It uses different strategies to calculate the fastest path depending on whether the user is driving, walking, or biking.
* **Possible use case:** Executing distinct validation rules during user registration, or computing pricing dynamically (e.g., seasonal rental costs vs. standard pricing).

### 6. Observer
* **Category:** Behavioral
* **Problem it solves:** Establishing a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.
* **How it works:** The "Subject/Publisher" maintains a list of "Observers/Subscribers". Whenever the subject undergoes a state change, it loops through its observers and calls an `update()` method on them.
* **Real-world example:** Newsletter subscriptions, or UI data-binding (when the underlying model data changes, the UI components observing it automatically re-render).
* **Possible use case:** Publishing a `UserRegisteredEvent` after a successful signup so that various listeners (e.g., sending an introductory email or initializing an empty cart profile) can trigger without being hardcoded into the Auth mechanism.
