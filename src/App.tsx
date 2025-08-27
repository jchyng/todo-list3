import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "@/pages/Landing";
import { TodoPage } from "@/pages/TodoPage";
import { CalendarPage } from "@/pages/CalendarPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/todo" element={<TodoPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </Router>
  );
}

export default App;
