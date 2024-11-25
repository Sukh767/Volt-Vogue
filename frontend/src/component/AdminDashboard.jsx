import React, { useState, useEffect } from "react";
// import { FiHome, FiSettings, FiUser, FiCalendar, FiList, FiLogOut } from "react-icons/fi";
// import { FaCheckCircle } from "react-icons/fa";
// import { BsThreeDots } from "react-icons/bs";

const AdminDashboard = () => {
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete project documentation", completed: false },
    { id: 2, title: "Review team performance", completed: true },
    { id: 3, title: "Schedule client meeting", completed: false },
    { id: 4, title: "Update system requirements", completed: false },
  ]);

  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      progress: 75,
      status: "In Progress",
      image: "images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3"
    },
    {
      id: 2,
      name: "Mobile App Development",
      progress: 45,
      status: "On Hold",
      image: "images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3"
    },
    {
      id: 3,
      name: "Marketing Campaign",
      progress: 90,
      status: "Almost Done",
      image: "images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3"
    },
  ];

  const stats = [
    { title: "Total Projects", value: "12" },
    { title: "Completed Tasks", value: "48" },
    { title: "Pending Reviews", value: "6" },
    { title: "Team Members", value: "15" },
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const SimpleCalendar = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const weeks = [];
    let days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<td key={`empty-${i}`} className="p-2"></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <td key={day} className="p-2 text-center hover:bg-gray-100 cursor-pointer">
          {day}
        </td>
      );

      if ((firstDayOfMonth + day) % 7 === 0) {
        weeks.push(<tr key={day}>{days}</tr>);
        days = [];
      }
    }

    if (days.length > 0) {
      weeks.push(<tr key="last">{days}</tr>);
    }

    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            &lt;
          </button>
          <span className="font-semibold">
            {currentDate.toLocaleDateString("default", { month: "long", year: "numeric" })}
          </span>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            &gt;
          </button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <th key={day} className="p-2 font-medium text-gray-600">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{weeks}</tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-20 shadow-md">
          <img
            src="images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3"
            alt="Logo"
            className="h-10 w-10 rounded-full"
          />
          <h1 className="ml-3 text-xl font-bold text-gray-800">AdminDashboard</h1>
        </div>
        <nav className="flex-grow">
          {[
            { icon: '', text: "Home" },
            { icon: '', text: "Calendar" },
            { icon: '', text: "Tasks" },
            { icon: '', text: "Profile" },
            { icon: '', text: "Settings" },
          ].map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="ml-3">{item.text}</span>
            </a>
          ))}
        </nav>
        <div className="p-4">
          <button className="flex items-center w-full px-4 py-2 text-gray-600 hover:text-red-600">
            {/* <FiLogOut className="mr-3" /> */}
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Greeting */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{greeting}, John!</h2>
            <p className="text-gray-600">Here's what's happening with your projects today.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Project Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={`https://${project.image}`}
                    alt={project.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-lg font-semibold">{project.name}</h4>
                      {/* <BsThreeDots className="text-gray-500 cursor-pointer" /> */}
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">{project.status}</span>
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 rounded-full h-2"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks and Calendar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tasks */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Today's Tasks</h3>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`flex-shrink-0 ${task.completed ? "text-green-500" : "text-gray-400"}`}
                      aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {/* <FaCheckCircle className="text-xl" /> */}
                    </button>
                    <span
                      className={`ml-3 ${task.completed ? "line-through text-gray-400" : "text-gray-700"}`}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Calendar</h3>
              <SimpleCalendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;