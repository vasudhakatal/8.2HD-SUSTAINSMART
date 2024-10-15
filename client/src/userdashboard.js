import React, { useState, useEffect, useCallback } from "react";
import {
  Leaf,
  Apple,
  Recycle,
  TreeDeciduous,
  Plus,
  Trash2,
  Sprout,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./userdashboard.css";

const SECTIONS = {
  RECIPES: "recipes",
  SHARING: "sharing",
  TIPS: "tips",
  INVENTORY: "inventory",
  IMPACT: "impact",
};

const SPOONACULAR_API_KEY = "e726b0f02a3946919bff42c09c48dd34";
const NUTRITIONIX_APP_ID = "6ab6512f";
const NUTRITIONIX_APP_KEY = "28e348ada7b661986ddadbe31c7aa562";

const PostModal = ({ isVisible, onClose, onSubmit }) => {
  const [postContent, setPostContent] = useState("");

  if (!isVisible) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(postContent);
    setPostContent("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>
          &times;
        </button>
        <h2>Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
            required
          />
          <button type="submit" className="submit-post-btn">
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default function UserDashboard() {
  const [activeSection, setActiveSection] = useState(SECTIONS.RECIPES);
  const [user, setUser] = useState({ name: "testuser" });
  const [recipes, setRecipes] = useState([]);
  const [inventory, setInventory] = useState([]);
  // const [posts, setPosts] = useState([]);
  const [tips, setTips] = useState([]);
  const [name, setName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [impactData] = useState({
    itemsSaved: 3,
    wasteReduced: 15,
  });
  const [posts, setPosts] = useState([
    {
      _id: "670a60ffdec99c18d12a4cda",
      content:
        "Excited to share my first community post! Looking forward to connecting...",
      author: "Anonymous",
      createdAt: "2024-10-12T11:43:59.543+00:00",
    },
    {
      _id: "670c3d0077e639183cc42842",
      content: `Delicious Autumn Pumpkin Soup\nAs the leaves change and the air gets a bit cooler, there’s nothing more comforting than a warm bowl of pumpkin soup...`,
      author: "mario",
      createdAt: "2024-10-13T21:34:56.902+00:00",
    },
  ]);
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInventory = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/food");
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Failed to fetch inventory");
    }
  }, []);

  const checkExpiringFood = useCallback(() => {
    const expiringItems = inventory.filter((item) => {
      const expiryDate = new Date(item.expiryDate);
      const today = new Date();
      const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays > 0;
    });

    if (expiringItems.length > 0 && "Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Food Expiring Soon", {
            body: `You have ${expiringItems.length} item(s) expiring in the next 3 days.`,
            icon: "/food-icon.png",
          });
        }
      });
    }
  }, [inventory]);

  const fetchTips = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://trackapi.nutritionix.com/v2/search/instant?query=apple`,
        {
          headers: {
            "x-app-id": NUTRITIONIX_APP_ID,
            "x-app-key": NUTRITIONIX_APP_KEY,
          },
        }
      );

      const tips = response.data.common.map((item) => {
        return `The food "${item.food_name}" has approximately ${item.nf_calories} calories per serving of ${item.serving_qty} ${item.serving_unit}.`;
      });

      setTips(tips);
    } catch (error) {
      console.error("Error fetching tips:", error);
      toast.error("Failed to fetch food tips");
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser({
        name: response.data.username,
        avatar: response.data.avatar || "/placeholder.svg?height=40&width=40",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to fetch user profile");
      toast.error("Failed to fetch user profile");
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await Promise.all([fetchInventory(), fetchTips(), fetchProfile()]);
      setLoading(false);
    };

    fetchInitialData();
  }, [fetchInventory, fetchTips, fetchProfile]);

  useEffect(() => {
    checkExpiringFood();
  }, [checkExpiringFood, inventory]);

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

      setInventory(inventory.filter((item) => item._id !== id));
      toast.info("Food item removed");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting food item.");
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
      const response = await axios.post("http://localhost:5000/api/food/add", newFood, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });

      setInventory((prevInventory) => [...prevInventory, response.data]);
      toast.success("Food added successfully!");
      setName("");
      setExpiryDate("");
      setQuantity("");
    } catch (err) {
      console.error(err);
      toast.error("Error adding food item.");
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${SPOONACULAR_API_KEY}`
      );
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast.error("Failed to fetch recipes");
    }
  };


  const handlePostSubmit = (newPostContent) => {
    const newPost = {
      _id: Math.random().toString(36).substr(2, 9), // Unique ID for demo purposes
      content: newPostContent,
      author: "testuser", // Replace with actual user's name
      createdAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]); // Add the new post to the top
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-dashboard">
      <ToastContainer />
      <aside className="user-dashboard__sidebar">
        <div className="user-dashboard__user-info">
          <span className="user-dashboard__username">Hi, {user.name}!</span>
        </div>
        <nav className="user-dashboard__nav">
          {Object.entries(SECTIONS).map(([key, value]) => (
            <button
              key={key}
              className={`user-dashboard__nav-button ${
                activeSection === value
                  ? "user-dashboard__nav-button--active"
                  : ""
              }`}
              onClick={() => setActiveSection(value)}
            >
              {value === SECTIONS.RECIPES && (
                <Sprout className="user-dashboard__icon" />
              )}
              {value === SECTIONS.SHARING && (
                <Leaf className="user-dashboard__icon" />
              )}
              {value === SECTIONS.TIPS && (
                <TreeDeciduous className="user-dashboard__icon" />
              )}
              {value === SECTIONS.INVENTORY && (
                <Apple className="user-dashboard__icon" />
              )}
              {value === SECTIONS.IMPACT && (
                <Recycle className="user-dashboard__icon" />
              )}
              {key.charAt(0) + key.slice(1).toLowerCase()}
            </button>
          ))}
        </nav>
      </aside>

      <main className="user-dashboard__main">
        <header className="user-dashboard__header">
          <h1 className="user-dashboard__title">Eco Dashboard</h1>
        </header>

        {activeSection === SECTIONS.RECIPES && (
          <div className="user-dashboard__section user-dashboard__section--recipes">
            <h2 className="user-dashboard__section-title">
              Eco-Friendly Recipes
            </h2>
            <p className="user-dashboard__section-description">
              Discover sustainable recipes using your ingredients.
            </p>
            <div className="user-dashboard__recipe-search">
              <input
                type="text"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Enter ingredients (comma-separated)"
                className="user-dashboard__recipe-input"
              />
              <button
                onClick={fetchRecipes}
                className="user-dashboard__recipe-button"
              >
                Find Recipes
              </button>
            </div>
            <div className="user-dashboard__recipes-list">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="user-dashboard__recipe-card">
                  <h3 className="user-dashboard__recipe-title">
                    {recipe.title}
                  </h3>
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="user-dashboard__recipe-image"
                  />
                  <p className="user-dashboard__recipe-info">
                    Used ingredients: {recipe.usedIngredientCount}
                  </p>
                  <p className="user-dashboard__recipe-info">
                    Missing ingredients: {recipe.missedIngredientCount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === SECTIONS.SHARING && (
          <div className="user-dashboard__section user-dashboard__section--sharing">
            <h2 className="user-dashboard__section-title">
              Community Food Sharing
            </h2>
            <button
              className="open-modal-btn"
              onClick={() => setIsModalVisible(true)}
            >
              Create New Post
            </button>
            <div className="user-dashboard__posts-list">
            {posts.map((post) => (
                <div key={post._id} className="user-dashboard__post-card">
                  <p className="user-dashboard__post-content">{post.content}</p>
                  <span className="user-dashboard__post-author">
                    - {post.author} on{" "}
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <PostModal
              isVisible={isModalVisible}
              onClose={() => setIsModalVisible(false)}
              onSubmit={handlePostSubmit}
            />
          </div>
        )}

        {activeSection === SECTIONS.TIPS && (
          <div className="user-dashboard__section user-dashboard__section--tips">
            <h2 className="user-dashboard__section-title">Eco-Friendly Tips</h2>
            <ul className="user-dashboard__tips-list">
              {tips.map((tip, index) => (
                <li key={index} className="user-dashboard__tip-item">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === SECTIONS.INVENTORY && (
          <div className="user-dashboard__section user-dashboard__section--inventory">
            <h2 className="user-dashboard__section-title">Food Inventory</h2>
            <div className="user-dashboard__inventory-list">
            {inventory.length > 0 ? (
              inventory.map((item) => (
                <div key={item._id} className="user-dashboard__inventory-item">
                  <h3 className="user-dashboard__inventory-item-name">
                    {item.name}
                  </h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>
                    Expiry Date:{" "}
                    {new Date(item.expiryDate).toLocaleDateString()}
                  </p>
                  <button onClick={() => handleDeleteFood(item._id)}>
                    <Trash2 className="admin-icon" />
                  </button>
                </div>
              ))
            ) : (
              <p>No items in your inventory</p>
            )}
            </div>
            <h3>Add New Food Item</h3>
            <form onSubmit={handleAddFood} className="user-dashboard__add-food-form">
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
          </div>
        )}

        {activeSection === SECTIONS.IMPACT && (
          <div className="user-dashboard__section user-dashboard__section--impact">
            <h2 className="user-dashboard__section-title">Impact Metrics</h2>
            <p>Items Saved: {impactData.itemsSaved}</p>
            <p>Waste Reduced: {impactData.wasteReduced} kg</p>
          </div>
        )}
      </main>
    </div>
  );
}