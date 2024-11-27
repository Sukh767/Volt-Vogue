import React, { useState, useEffect } from "react";
import { BarChartIcon as ChartNoAxesCombined, LayoutList, ListOrderedIcon, LogOut, PackagePlus, PenIcon as UserPen } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import Analytics from "./Admin/Analytics";
import ProductList from "./Admin/ProductList";
import AddProduct from "./Admin/AddProduct";
import OrderList from "./Admin/OrderList";
import Profile from "./Admin/Profile";
import { useProductStore } from "../stores/useProductStore";

const AdminDashboard = () => {
  const [greeting, setGreeting] = useState("");
  const [activeSection, setActiveSection] = useState("Analytics");

  const {fetchAllProduct, loading} = useProductStore()
  useEffect(()=>{
  fetchAllProduct()
  },[fetchAllProduct])

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const renderContent = () => {
    switch (activeSection) {
      case "Analytics":
        return <Analytics />;
      case "Product list":
        return <ProductList />;
      case "Add Product":
        return <AddProduct />;
      case "Orders":
        return <OrderList />;
      case "Profile":
        return <Profile />;
      default:
        return <Analytics />;
    }
  };

  const sidebarVariants = {
    hidden: { x: -300 },
    visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const navItems = [
    { icon: <ChartNoAxesCombined />, text: "Analytics" },
    { icon: <LayoutList />, text: "Product list" },
    { icon: <PackagePlus />, text: "Add Product" },
    { icon: <ListOrderedIcon />, text: "Orders" },
    { icon: <UserPen />, text: "Profile" },
  ];

  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]">
      {/* Sidebar */}
      <motion.div
        className="hidden md:flex flex-col w-64 bg-gray-800 shadow-lg"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-center h-20 shadow-md">
          <motion.img
            src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3"
            alt="Logo"
            className="h-10 w-10 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
          <motion.h1
            className="ml-3 text-xl font-bold text-emerald-400 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Admin Dashboard
          </motion.h1>
        </div>
        <nav className="flex-grow">
          {navItems.map((item, index) => (
            <motion.a
              key={index}
              href="#"
              onClick={() => setActiveSection(item.text)}
              className={`flex items-center px-6 py-3 text-white hover:bg-gray-700 ${
                activeSection === item.text ? 'bg-gray-700' : ''
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.button className="text-xl" whileHover={{ rotate: 360, transition: { duration: 0.5 } }}>
                {item.icon}
              </motion.button>
              <span className="ml-3">{item.text}</span>
            </motion.a>
          ))}
        </nav>
        <div className="p-4">
          <motion.button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-300 hover:text-red-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut />
            <span className="ml-2">Logout</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="flex-1 overflow-y-auto p-6"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Greeting */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-3xl font-bold text-white text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {greeting} Tony
          </motion.h1>
        </motion.div>
        {/* Render the active section's content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;