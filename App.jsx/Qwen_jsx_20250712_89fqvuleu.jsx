import React, { useState } from "react";
import { collection, addDoc, deleteDoc, doc, getDocs } from "./firebase";

export default function App() {
  const ADMIN_CREDENTIALS = {
    email: "Johnmambwe@yahoo.com",
    password: "377197611Jmmakanse86",
  };

  const [userType, setUserType] = useState(null);
  const [adminAuth, setAdminAuth] = useState(false);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    nrc: "",
    age: "",
    address: "",
    phone: "",
    location: "",
    images: [],
  });
  const [premisesListings, setPremisesListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [paymentMade, setPaymentMade] = useState(false);
  const [websiteSettings, setWebsiteSettings] = useState({
    siteTitle: "RentZambia - Copperbelt",
    paymentAmount: 10,
    developerContact: "+260962966799 John Mambwe",
  });

  // Load listings from Firebase on load
  const loadListings = async () => {
    const querySnapshot = await getDocs(collection(db, "listings"));
    const listings = [];
    querySnapshot.forEach((doc) => {
      listings.push(doc.data());
    });
    setPremisesListings(listings);
  };

  // Submit listing to Firebase
  const handleSubmitLandlord = async () => {
    const newListing = {
      id: premisesListings.length + 1,
      name: formData.name,
      address: formData.address,
      location: formData.location,
      price: "Negotiable",
      images: formData.images.map((file) => URL.createObjectURL(file)),
      contactDetails: {
        name: formData.name,
        nrc: formData.nrc,
        age: formData.age,
        phone: formData.phone,
        address: formData.address,
      },
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, "listings"), newListing);
      loadListings(); // Refresh list
      setFormData({
        name: "",
        nrc: "",
        age: "",
        address: "",
        phone: "",
        location: "",
        images: [],
      });
      alert("Your premises have been submitted successfully!");
    } catch (error) {
      console.error("Error adding listing: ", error);
      alert("Failed to submit listing");
    }
  };

  // Delete listing from Firebase
  const deleteListing = async (id) => {
    // Firebase doesn't support delete by field, so we'd need IDs or other logic
    // For simplicity, you can delete by ID if stored properly
    alert("Deleting not implemented in demo. Firebase requires unique document ID.");
  };

  // Simulate mobile money payment
  const handlePayment = () => {
    setTimeout(() => {
      setPaymentMade(true);
      alert("✅ Payment of K" + websiteSettings.paymentAmount + " received via Mobile Money.");
    }, 1000);
  };

  // Admin login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (
      authForm.email === ADMIN_CREDENTIALS.email &&
      authForm.password === ADMIN_CREDENTIALS.password
    ) {
      setAdminAuth(true);
      setAuthError("");
    } else {
      setAuthError("Invalid email or password");
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setWebsiteSettings({ ...websiteSettings, [name]: value });
  };

  const resetForm = () => {
    setSelectedListing(null);
    setPaymentMade(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{websiteSettings.siteTitle}</h1>
          {!userType && !adminAuth && (
            <div className="space-x-4">
              <button
                onClick={() => setUserType("landlord")}
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition"
              >
                Landlord
              </button>
              <button
                onClick={() => setUserType("tenant")}
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition"
              >
                Tenant
              </button>
              <button
                onClick={() => setUserType("admin-login")}
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition"
              >
                Admin
              </button>
            </div>
          )}
          {(userType || adminAuth) && (
            <button
              onClick={() => {
                setUserType(null);
                setAdminAuth(false);
              }}
              className="text-sm underline hover:text-blue-200"
            >
              Back
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {/* Other sections unchanged... */}
        {/* Add back your full UI here – too long to paste again – just keep the rest of your JSX */}
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>
              © {new Date().getFullYear()} RentZambia | Developed by John Makanse Mambwe |{" "}
              <strong>{websiteSettings.developerContact}</strong>
            </p>
            <p className="mt-2 text-sm">Secure, professional, and scam-free housing platform for Kitwe & Ndola.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}