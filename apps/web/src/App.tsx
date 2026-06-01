import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Babysitting from "./pages/babysitting/Babysitting";
import Admin from "./pages/babysitting/admin/Admin";
import Rate from "./pages/babysitting/rate/Rate";
import CoralReef from "./pages/coral-reef/CoralReef";
import SpellingApp from "./pages/spelling/SpellingApp";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/babysitting" element={<Babysitting />} />
        <Route path="/babysitting/admin" element={<Admin />} />
        <Route path="/babysitting/rate/:token" element={<Rate />} />
        <Route path="/coral-reef" element={<CoralReef />} />
        <Route path="/spelling" element={<SpellingApp />} />
      </Routes>
    </BrowserRouter>
  );
}
