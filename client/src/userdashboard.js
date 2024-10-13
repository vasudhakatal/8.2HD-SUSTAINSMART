import React, { useState, useEffect } from "react";
import {
  Leaf,
  Apple,
  Recycle,
  TreeDeciduous,
  Sprout,
} from "lucide-react";
import './userdashboard.css'; // Ensure you have the styles in this CSS file

const SECTIONS = {
  RECIPES: "recipes",
  SHARING: "sharing",
  TIPS: "tips",
  INVENTORY: "inventory",
  IMPACT: "impact",
};

export default function UserDashboard() {
  const [activeSection, setActiveSection] = useState(SECTIONS.RECIPES);
  const [user, setUser] = useState(""); // User name state
  const [recipes, setRecipes] = useState([]);
  const [foodSharingData, setFoodSharingData] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [impactData, setImpactData] = useState({ itemsSaved: 0, wasteReduced: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(""); // Store authentication token

  // Fetch user profile based on login
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`, // Include the token in the header
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      const data = await response.json();
      setUser(data.name); // Set user name from response
    } catch (error) {
      setError("Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  // Call fetchUserProfile after the component mounts or when the authToken changes
  useEffect(() => {
    if (authToken) {
      fetchUserProfile();
    }
  }, [authToken]);

  // Call this function after login
  const handleLogin = async (username, password) => {
    setLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      setAuthToken(data.token); // Save the token for further requests
      fetchUserProfile(); // Fetch user profile after login
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (section) => {
    setActiveSection(section);
    if (section === SECTIONS.RECIPES) {
      fetchRecipes();
    } else if (section === SECTIONS.SHARING) {
      fetchFoodSharingData();
    } else if (section === SECTIONS.INVENTORY) {
      fetchInventory();
    } else if (section === SECTIONS.IMPACT) {
      fetchImpactData();
    }
  };

  // Example fetch functions
  const fetchRecipes = async () => {
    // Fetch recipes data
    try {
      const response = await fetch("/api/recipes");
      if (!response.ok) throw new Error("Failed to fetch recipes");
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchFoodSharingData = async () => {
    // Fetch food sharing data
    try {
      const response = await fetch("/api/sharing");
      if (!response.ok) throw new Error("Failed to fetch food sharing data");
      const data = await response.json();
      setFoodSharingData(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchInventory = async () => {
    // Fetch inventory data
    try {
      const response = await fetch("/api/food");
      if (!response.ok) throw new Error("Failed to fetch inventory");
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchImpactData = async () => {
    // Fetch impact data
    try {
      const response = await fetch("/api/impact");
      if (!response.ok) throw new Error("Failed to fetch impact data");
      const data = await response.json();
      setImpactData(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="userdashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="userdashboard-title">Eco Dashboard</h2>
        </div>
        <nav className="sidebar-nav">
          {Object.entries(SECTIONS).map(([key, value]) => (
            <button
              key={key}
              className={`sidebar-link ${activeSection === value ? 'active' : ''}`}
              onClick={() => navigateTo(value)}
            >
              {value === SECTIONS.RECIPES && <Sprout className="icon" />}
              {value === SECTIONS.SHARING && <Leaf className="icon" />}
              {value === SECTIONS.TIPS && <TreeDeciduous className="icon" />}
              {value === SECTIONS.INVENTORY && <Apple className="icon" />}
              {value === SECTIONS.IMPACT && <Recycle className="icon" />}
              <span>{key.charAt(0) + key.slice(1).toLowerCase()}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="main-content">
        <header className="main-header">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <h1 className="greeting">Hi {user || "there"}</h1> // Display user name
          )}
        </header>

        <section className="content">
          {error && <p className="error">{error}</p>}
          
          {activeSection === SECTIONS.RECIPES && (
            <div className="card">
              <h2 className="card-title">
                <Sprout className="icon" /> Eco-Friendly Recipes
              </h2>
              <p className="card-description">
                Discover sustainable recipes using your ingredients.
              </p>
              <input
                type="text"
                className="input"
                placeholder="Enter ingredients you have..."
              />
              <button className="btn">Find Recipes</button>
            </div>
          )}

          {activeSection === SECTIONS.SHARING && (
            <div className="card">
              <h2 className="card-title">
                <Leaf className="icon" /> Community Food Sharing
              </h2>
              <p className="card-description">
                Share excess food with your local community.
              </p>
              <form className="sharing-form">
                <input
                  type="text"
                  placeholder="Food Item (e.g., Organic veggies)"
                  className="input"
                />
                <input type="text" placeholder="Quantity (e.g., 2 lbs)" className="input" />
                <input type="datetime-local" className="input" />
                <button className="btn">Share Food</button>
              </form>
            </div>
          )}

          {activeSection === SECTIONS.TIPS && (
            <div className="card">
              <h2 className="card-title">
                <TreeDeciduous className="icon" /> Sustainability Tips
              </h2>
              <ul className="tips-list">
                <li>Plan your meals and shop with a list</li>
                <li>Store fruits and vegetables properly to extend freshness</li>
                <li>Use reusable containers for leftovers</li>
                <li>Start a small herb garden at home</li>
                <li>Compost inedible food scraps</li>
              </ul>
            </div>
          )}

          {activeSection === SECTIONS.INVENTORY && (
            <div className="card">
              <h2 className="card-title">
                <Apple className="icon" /> Smart Food Inventory
              </h2>
              <p className="card-description">
                Track your food to minimize waste and maximize usage.
              </p>
              <input type="text" placeholder="New Item" className="input" />
              <button className="btn">Add Item</button>
            </div>
          )}

          {activeSection === SECTIONS.IMPACT && (
            <div className="card">
              <h2 className="card-title">
                <Recycle className="icon" /> Environmental Impact
              </h2>
              <p className="card-description">
                Track your food waste reduction impact.
              </p>
              <div className="impact-stats">
                <p><strong>Items Saved:</strong> {impactData.itemsSaved}</p>
                <p><strong>Waste Reduced:</strong> {impactData.wasteReduced} kg</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
