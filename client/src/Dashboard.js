import React, { useState, useEffect } from "react";
import { Leaf, Apple, Clipboard, Plus, Trash2, Home, User } from "lucide-react"; // Add relevant icons
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminDashboard.css"; // Import the CSS file

const AdminDashboard = () => {
  const [name, setName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [foodList, setFoodList] = useState([]);
  const [communityPost, setCommunityPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    avatar: "",
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("food"); // Set default to "food"

  const [editableProfile, setEditableProfile] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    fetchProfile();
    fetchFoodList();
    fetchPosts();
    fetchRecipes(); // Fetch recipes on component mount
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the token in the header
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      const data = await response.json();
      setProfile(data.name); // Set user name from response
    } catch (error) {
      setError("Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchFoodList = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Unable to fetch food list.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/food", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching food list.");
      }

      const data = await response.json();
      setFoodList(data);
    } catch (error) {
      console.error("Food list fetch error:", error);
    }
  };

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Unable to fetch posts.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching posts.");
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Posts fetch error:", error);
    }
  };

  const fetchRecipes = async () => {
    const apiKey = "e726b0f02a3946919bff42c09c48dd34"; // Replace with your Spoonacular API key
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}`
      );
      if (!response.ok) {
        throw new Error("Error fetching recipes.");
      }
      const data = await response.json();
      setRecipes(data.results);
    } catch (error) {
      console.error("Recipes fetch error:", error);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();

    const newFood = {
      name,
      expiryDate,
      quantity: parseInt(quantity, 10),
    };

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/food/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(newFood),
      });
      if (!response.ok) throw new Error("Error adding food item.");

      const addedFood = await response.json();
      setFoodList([...foodList, addedFood]);
      toast.success("Food added successfully!");
      setName("");
      setExpiryDate("");
      setQuantity("");
    } catch (err) {
      console.error(err);
      toast.error("Error adding food item.");
    }
  };

  const handleDeleteFood = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/food/${id}`, {
        method: "DELETE",
        headers: { "x-auth-token": token },
      });

      if (!response.ok) throw new Error("Error deleting food item.");

      setFoodList(foodList.filter((food) => food._id !== id));
      toast.info("Food item removed");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting food item.");
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();

    const newPost = {
      content: communityPost,
    };

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) throw new Error("Error creating post.");

      const addedPost = await response.json();
      setPosts([...posts, addedPost]);
      setCommunityPost("");
      toast.success("Post added!");
    } catch (err) {
      console.error(err);
      toast.error("Error adding post.");
    }
  };

  const handleDeletePost = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "DELETE",
        headers: { "x-auth-token": token },
      });

      if (!response.ok) throw new Error("Error deleting post.");

      setPosts(posts.filter((post) => post._id !== id));
      toast.info("Post deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting post.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(editableProfile),
      });

      if (!response.ok) throw new Error("Error updating profile.");

      const updatedProfile = await response.json();
      setProfile({
        name: updatedProfile.username,
        email: updatedProfile.email,
        role: updatedProfile.role,
        avatar: updatedProfile.avatar || "",
      });
      setIsProfileOpen(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile.");
    }
  };

  return (
    <div className="admin-dashboard-container">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h1 className="admin-dashboard-title">Dashboard</h1>
          <button
            className="profile-button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <User className="profile-icon" />
          </button>
        </div>
        <nav className="admin-sidebar-nav">
          <button
            className={`admin-sidebar-link ${
              activeSection === "food" ? "active" : ""
            }`}
            onClick={() => setActiveSection("food")}
          >
            <Apple className="admin-icon" />
            Food Items
          </button>
          <button
            className={`admin-sidebar-link ${
              activeSection === "community" ? "active" : ""
            }`}
            onClick={() => setActiveSection("community")}
          >
            <Clipboard className="admin-icon" />
            Community Posts
          </button>
          {/* <button
            className={`admin-sidebar-link ${
              activeSection === "recipes" ? "active" : ""
            }`}
            onClick={() => setActiveSection("recipes")}
          >
            <Leaf className="admin-icon" />
            Recipes
          </button> */}
        </nav>
      </aside>

      <main className="admin-main-content"> 
        {activeSection === "food" && (
          <div className="food-section">
            <h2>Food Items</h2>
            <form onSubmit={handleAddFood}>
              <input
                type="text"
                value={name}
                placeholder="Food Name"
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
              <input
                type="number"
                value={quantity}
                placeholder="Quantity"
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
              <button type="submit">
                <Plus className="admin-icon" /> Add Food
              </button>
            </form>
            <ul>
              {foodList.map((food) => (
                <li key={food._id}>
                  {food.name} - {food.expiryDate} - {food.quantity}{" "}
                  <button onClick={() => handleDeleteFood(food._id)}>
                    <Trash2 className="admin-icon" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === "community" && (
          <div className="community-section">
            <h2>Community Posts</h2>
            <form onSubmit={handleAddPost}>
              <textarea
                value={communityPost}
                onChange={(e) => setCommunityPost(e.target.value)}
                placeholder="Write your post..."
                required
              />
              <button type="submit">Post</button>
            </form>
            <ul>
              {posts.map((post) => (
                <li key={post._id}>
                  {post.content}{" "}
                  <button onClick={() => handleDeletePost(post._id)}>
                    <Trash2 className="admin-icon" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* {activeSection === "recipes" && (
          <div className="recipes-section">
            <h2>Recipes</h2>
            <ul>
              {recipes.map((recipe) => (
                <li key={recipe.id}>
                  <h3>{recipe.title}</h3>
                  <img src={recipe.image} alt={recipe.title} />
                  <p>Ready in: {recipe.readyInMinutes} minutes</p>
                </li>
              ))}
            </ul>
          </div>
        )} */}

{isProfileOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Edit Profile</h2>
      <form onSubmit={handleUpdateProfile}>
        <input
          type="text"
          value={editableProfile.name}
          placeholder="Name"
          onChange={(e) =>
            setEditableProfile({ ...editableProfile, name: e.target.value })
          }
        />
        <input
          type="email"
          value={editableProfile.email}
          placeholder="Email"
          onChange={(e) =>
            setEditableProfile({ ...editableProfile, email: e.target.value })
          }
        />
        <div className="button-container">
          <button type="submit">Update Profile</button>
          <button type="button" onClick={() => setIsProfileOpen(false)}>Close</button>
        </div>
      </form>
    </div>
  </div>
)}
      </main>

      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;
