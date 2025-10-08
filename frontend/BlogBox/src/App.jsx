import "bootstrap/dist/css/bootstrap.min.css";
import { Login } from "./login/Login";
import { Signup } from "./login/signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Blog } from "./Homeblog/Blog";
import { Navbar } from "./Homeblog/Navber";
import { AddBlog } from "./userblog/AddBlog";

function App() {
  return (
    <div
      style={{
        margin: "0px",
        padding: "0px",
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Blog />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Add-Blog" element={<AddBlog />} />
          <Route path="/edit-blog/:id" element={<AddBlog />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
