## 🔐 Login Page Implementation

### What I Built
I developed a responsive, secure-looking login page for the Digital Gurkha learning platform. 
Key features include:
* **Form Validation:** Real-time email format checking and password requirement alerts.
* **State Management:** Handled loading states, error messaging, and password visibility toggling using React hooks.
* **API Integration:** Implemented a dual-mode API handler that supports both real endpoints and a mock delay-based system for development testing.
* **UI/UX:** Built with Tailwind CSS, featuring custom SVG icons and a clean, "Stone" themed aesthetic.

### Decisions & Trade-offs
* **Mock Toggle:** I included a `USE_MOCK` flag at the top of the file to allow for easy testing without needing a live backend connection.
* **Visual Feedback:** I chose to use a custom `Spinner` and "Sign in..." state on the button to prevent double-submissions and improve user experience on slow connections.
* **Validation Strategy:** I opted for `onBlur` validation combined with `onChange` clearing. This ensures users aren't shouted at while typing, but get immediate feedback once they move to the next field.