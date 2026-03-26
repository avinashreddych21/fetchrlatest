import React, { useState, useEffect } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  Truck, 
  LogOut, 
  PlusCircle, 
  Navigation,
  UserCheck,
  ChevronLeft,
  Camera,
  Info,
  Search,
  Bell,
  CheckCircle2,
  CreditCard,
  Banknote,
  ArrowLeft,
  Loader2,
  Mail,
  Edit3,
  Save
} from 'lucide-react';

// --- CONSTANTS ---
const BLOCKS = ["JC Bose Block", "X-Lab", "Homi J Bhabha Block", "V Block", "SR Block", "CV Raman Block"];
const GIRLS_HOSTELS = ["Krishna", "Godavari", "Kaveri", "Narmada", "Ganga A (17–26)"];
const BOYS_HOSTELS = ["Ganga A", "Ganga B", "Vedavathi"];
const ALL_LOCATIONS = [...BLOCKS, ...GIRLS_HOSTELS, ...BOYS_HOSTELS];

const ORDER_STATUS_STEPS = ["Order Placed", "Picked", "On the Way", "Delivered"];

// BRAND COLORS
const COLORS = {
  primary: "#0B1F3A",
  secondary: "#132F57",
  accent: "#F97316",
  softNavy: "rgba(11, 31, 58, 0.1)"
};

const HEADER_GRADIENT = "linear-gradient(135deg, #0B1F3A, #132F57)";

// --- UTILS ---
const storage = {
  get: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
  currentUser: () => JSON.parse(localStorage.getItem('fetchr_active_user') || 'null'),
  setCurrentUser: (user) => localStorage.setItem('fetchr_active_user', JSON.stringify(user))
};

// --- COMPONENTS ---

const Card = ({ children, className = "" }) => (
  <div 
    className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${className}`}
    style={{ borderColor: COLORS.softNavy }}
  >
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", disabled = false, type = "button" }) => {
  const variants = {
    primary: `text-white shadow-lg shadow-navy-900/10`,
    secondary: `bg-orange-50 text-[#F97316] hover:bg-orange-100`,
    outline: `border-2 border-[#0B1F3A] text-[#0B1F3A] hover:bg-gray-50`,
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "text-[#0B1F3A] hover:bg-gray-50"
  };
  
  const baseStyle = variant === 'primary' ? { backgroundColor: COLORS.primary } : {};

  return (
    <button 
      type={type}
      disabled={disabled}
      onClick={onClick} 
      style={baseStyle}
      className={`px-4 py-3 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 hover:bg-[#F97316] hover:text-white ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, type = "text", value, onChange, placeholder, options, isTextArea = false }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">{label}</label>}
    <div className="relative">
      {options ? (
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl border focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none appearance-none bg-white text-gray-800"
          style={{ borderColor: COLORS.softNavy }}
        >
          <option value="">Select {label}</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : isTextArea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-3.5 rounded-xl border focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none resize-none text-gray-800"
          style={{ borderColor: COLORS.softNavy }}
        />
      ) : (
        <input 
          type={type} 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder={placeholder}
          className="w-full px-4 py-3.5 rounded-xl border focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none text-gray-800"
          style={{ borderColor: COLORS.softNavy }}
        />
      )}
    </div>
  </div>
);

export default function App() {
  const [view, setView] = useState('auth'); 
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [message, setMessage] = useState(null);
  
  // Auth Form States
  const [authInput, setAuthInput] = useState('');
  const [authPass, setAuthPass] = useState('');
  
  // Signup / OTP States
  const [signupStep, setSignupStep] = useState('form'); 
  const [regData, setRegData] = useState({ name: '', regNo: '', email: '', phone: '', gender: 'Male', password: '' });
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpInput, setOtpInput] = useState('');

  // Order / Payment States
  const [orderForm, setOrderForm] = useState({
    pickup: '', pickupDesc: '', delivery: '', deliveryDesc: '', itemName: '', itemDesc: ''
  });
  const [paymentMethod, setPaymentMethod] = useState(''); 
  const [isPaying, setIsPaying] = useState(false);

  // Profile Edit State
  const [profileData, setProfileData] = useState({ name: '', regNo: '', phone: '', email: '' });

  // Tracking State
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [trackStep, setTrackStep] = useState(0);

  useEffect(() => {
    const active = storage.currentUser();
    if (active) {
      setUser(active);
      setProfileData({ name: active.name, regNo: active.regNo, phone: active.phone, email: active.email });
      setView('dashboard');
    }
    setOrders(storage.get('fetchr_orders'));
    
    const currentPartners = storage.get('fetchr_partners');
    if (currentPartners.length === 0) {
      const seedPartners = [
        { name: 'Rahul (Male)', regNo: 'AP11111111111', gender: 'Male', rating: 4.8, isPartner: true },
        { name: 'Ananya (Female)', regNo: 'AP22222222222', gender: 'Female', rating: 4.9, isPartner: true }
      ];
      storage.set('fetchr_partners', seedPartners);
      setPartners(seedPartners);
    } else {
      setPartners(currentPartners);
    }
  }, []);

  // Tracking Timer
  useEffect(() => {
    let timer;
    if (view === 'tracking' && trackStep < 3) {
      timer = setTimeout(() => {
        setTrackStep(prev => prev + 1);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [view, trackStep]);

  const showAlert = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLogin = () => {
    const users = storage.get('fetchr_users');
    const found = users.find(u => (u.regNo === authInput || u.email === authInput || u.phone === authInput) && u.password === authPass);
    if (found) {
      storage.setCurrentUser(found);
      setUser(found);
      setProfileData({ name: found.name, regNo: found.regNo, phone: found.phone, email: found.email });
      setView('dashboard');
    } else {
      showAlert("Invalid credentials. Please check and try again.");
    }
  };

  const startSignup = () => {
    if (!regData.name || !regData.regNo || !regData.password || !regData.phone) return showAlert("Fill all fields");
    
    const regRegex = /^AP\d{11}$/;
    if (!regRegex.test(regData.regNo)) {
      return showAlert("Reg No must be 'AP' followed by exactly 11 digits");
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(regData.phone)) {
      return showAlert("Phone must be exactly 10 digits (numbers only)");
    }

    const users = storage.get('fetchr_users');
    if (users.find(u => u.regNo === regData.regNo)) return showAlert("Reg No already exists");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setSignupStep('otp');
    alert(`[SIMULATION] Your Fetchr OTP is: ${otp}`);
  };

  const verifyOtpAndSignup = () => {
    if (otpInput === generatedOtp) {
      const users = storage.get('fetchr_users');
      users.push(regData);
      storage.set('fetchr_users', users);
      storage.setCurrentUser(regData);
      setUser(regData);
      setProfileData({ name: regData.name, regNo: regData.regNo, phone: regData.phone, email: regData.email });
      setView('dashboard');
      showAlert("Account verified and created!");
    } else {
      showAlert("Incorrect OTP. Please try again.");
    }
  };

  const handleUpdateProfile = () => {
    const users = storage.get('fetchr_users');
    const updatedUsers = users.map(u => u.regNo === user.regNo ? { ...u, ...profileData } : u);
    
    storage.set('fetchr_users', updatedUsers);
    const updatedUser = { ...user, ...profileData };
    storage.setCurrentUser(updatedUser);
    setUser(updatedUser);
    showAlert("Profile updated successfully!");
    setView('dashboard');
  };

  const handleCreateOrder = () => {
    if (!orderForm.pickup || !orderForm.delivery || !orderForm.itemName) return showAlert("Fill essential details");
    setView('payment');
  };

  const confirmOrder = async () => {
    if (!paymentMethod) return showAlert("Select a payment method");

    if (paymentMethod === 'paynow') {
      setIsPaying(true);
      await new Promise(r => setTimeout(r, 2000));
      setIsPaying(false);
    }

    const isGirlsHostel = GIRLS_HOSTELS.includes(orderForm.delivery);
    const requiredGender = isGirlsHostel ? "Female" : "Male";
    const availablePartners = partners.filter(p => p.gender === requiredGender);
    
    if (availablePartners.length === 0) {
      return showAlert(`No ${requiredGender} partners available for this location.`);
    }

    const randomPartner = availablePartners[Math.floor(Math.random() * availablePartners.length)];
    const newOrder = {
      id: Date.now(),
      userId: user.regNo,
      userName: user.name,
      ...orderForm,
      paymentMethod,
      status: ORDER_STATUS_STEPS[0],
      timestamp: new Date().toLocaleString(),
      partner: randomPartner
    };

    const updatedOrders = [...orders, newOrder];
    storage.set('fetchr_orders', updatedOrders);
    setOrders(updatedOrders);
    setTrackingOrder(newOrder);
    setTrackStep(0);
    setView('tracking');
    setOrderForm({ pickup: '', pickupDesc: '', delivery: '', deliveryDesc: '', itemName: '', itemDesc: '' });
    setPaymentMethod('');
  };

  const handleLogout = () => {
    localStorage.removeItem('fetchr_active_user');
    setUser(null);
    setView('auth');
  };

  // --- RENDERS ---

  const renderAuth = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="w-24 h-24 mb-4 overflow-hidden rounded-3xl shadow-xl">
             <img src="/src/assets/logo-icon.png" alt="Logo Icon" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: COLORS.primary }}>Fetchr</h1>
          <p className="text-gray-400 text-sm mt-1">Professional Campus Logistics</p>
        </div>
        
        <div className="space-y-4">
          <Input 
            placeholder="Reg No (AP...) / Email / Phone" 
            value={authInput} 
            onChange={setAuthInput} 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={authPass} 
            onChange={setAuthPass} 
          />
          <Button className="w-full mt-2" onClick={handleLogin}>Log In</Button>
          
          <div className="pt-4 text-center">
            <p className="text-gray-500 text-sm">
              New to Fetchr? 
              <button onClick={() => { setView('signup'); setSignupStep('form'); }} className="font-bold ml-1.5 hover:underline" style={{ color: COLORS.accent }}>Get started</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSignup = () => (
    <div className="min-h-screen bg-white flex flex-col p-8">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <button onClick={() => setView('auth')} className="mb-6 p-2 -ml-2 flex items-center gap-2 font-bold" style={{ color: COLORS.primary }}>
            <ArrowLeft size={20} /> Back
          </button>
          <h2 className="text-3xl font-black text-gray-900">
            {signupStep === 'form' ? "Join Fetchr" : "Verify OTP"}
          </h2>
          <p className="text-gray-500">
            {signupStep === 'form' ? "Create your campus delivery profile" : `Enter the code sent to ${regData.phone}`}
          </p>
        </div>

        {signupStep === 'form' ? (
          <div className="space-y-1">
            <Input label="Full Name" placeholder="e.g. John Doe" value={regData.name} onChange={(v) => setRegData({...regData, name: v})} />
            <Input label="Reg No" placeholder="APXXXXXXXXXXX" value={regData.regNo} onChange={(v) => setRegData({...regData, regNo: v})} />
            <div className="grid grid-cols-2 gap-4">
               <Input label="Gender" options={["Male", "Female"]} value={regData.gender} onChange={(v) => setRegData({...regData, gender: v})} />
               <Input label="Phone" placeholder="10-digit number" value={regData.phone} onChange={(v) => setRegData({...regData, phone: v})} />
            </div>
            <Input label="Email" placeholder="user@university.edu" value={regData.email} onChange={(v) => setRegData({...regData, email: v})} />
            <Input label="Password" type="password" placeholder="Create password" value={regData.password} onChange={(v) => setRegData({...regData, password: v})} />
            <Button className="w-full mt-8" onClick={startSignup}>Sign Up</Button>
          </div>
        ) : (
          <div className="space-y-6">
            <Input 
              label="OTP Code" 
              placeholder="Enter 6-digit code" 
              value={otpInput} 
              onChange={setOtpInput} 
            />
            <Button className="w-full" onClick={verifyOtpAndSignup}>Verify & Complete</Button>
            <button onClick={() => setSignupStep('form')} className="w-full font-bold text-sm" style={{ color: COLORS.primary }}>Change Phone Number</button>
          </div>
        )}
      </div>
    </div>
  );

  const renderDashboard = () => {
    const isPartner = partners.some(p => p.regNo === user.regNo);
    const myOrders = orders.filter(o => o.userId === user.regNo);
    const assignedOrders = orders.filter(o => o.partner.regNo === user.regNo);

    return (
      <div className="min-h-screen bg-gray-50 pb-28 px-4">
        <div className="max-w-6xl mx-auto pt-4">
          <div className="p-8 rounded-[2rem] md:rounded-[3rem] shadow-2xl text-white relative overflow-hidden" style={{ background: HEADER_GRADIENT }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="flex justify-between items-center mb-10 relative z-10">
              <div className="h-10 bg-white rounded-lg p-1 px-4 flex items-center shadow-md">
                 <img src="/src/assets/logo-full.jpeg" alt="Fetchr Logo" className="h-full object-contain" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setView('profile')} className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md hover:bg-white/30 transition-colors">
                  <User size={20} />
                </button>
                <button onClick={handleLogout} className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md hover:bg-white/30 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
            
            <div className="relative z-10 mb-8 flex flex-col md:flex-row md:items-end md:justify-between">
              <div>
                <p className="opacity-80 text-xs font-bold uppercase tracking-widest mb-1">Authenticated Account</p>
                <h2 className="text-3xl md:text-4xl font-black flex items-center gap-3">
                  {user.name} <UserCheck size={24} className="text-orange-400" />
                </h2>
                <p className="text-sm opacity-60 mt-1">{user.regNo}</p>
              </div>
              <div className="mt-6 md:mt-0 flex gap-4">
                <div className="bg-white/15 p-4 rounded-2xl backdrop-blur-md border border-white/20 flex-1 md:flex-none md:w-40 text-center md:text-left">
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-70 mb-1">Status</p>
                  <p className="text-2xl font-black">{isPartner ? 'Partner' : 'Student'}</p>
                </div>
                <div className="bg-white/15 p-4 rounded-2xl backdrop-blur-md border border-white/20 flex-1 md:flex-none md:w-40 text-center md:text-left">
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-70 mb-1">{isPartner ? 'Assigned' : 'Active'}</p>
                  <p className="text-2xl font-black">
                    {isPartner ? assignedOrders.length : myOrders.filter(o => o.status !== 'Delivered').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10">
          {!isPartner ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-gray-900 text-2xl tracking-tight">Your Orders</h3>
                <button onClick={() => setView('create-order')} className="text-white p-3 px-6 rounded-2xl shadow-lg flex items-center font-bold text-sm hover:opacity-90" style={{ backgroundColor: COLORS.primary }}>
                  <PlusCircle size={18} className="mr-2 text-orange-400" /> New Request
                </button>
              </div>

              {myOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 opacity-40 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                  <Package size={80} className="mb-4" style={{ color: COLORS.primary }} />
                  <p className="text-gray-500 font-bold italic text-lg">No orders yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myOrders.slice().reverse().map(order => (
                    <Card key={order.id} className="p-0 overflow-hidden shadow-sm">
                      <div className="p-6 flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="bg-gray-50 p-3 rounded-2xl mr-4"><Truck size={24} style={{ color: COLORS.accent }} /></div>
                          <div>
                            <p className="font-bold text-gray-900 text-lg">{order.itemName}</p>
                            <p className="text-xs text-gray-400">{order.timestamp}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="px-6 pb-6">
                         <div className="flex items-center text-sm mb-4">
                            <MapPin size={14} className="mr-2 text-orange-400" />
                            <span className="text-gray-900 font-bold truncate">To: {order.delivery}</span>
                         </div>
                         <Button variant="outline" className="w-full text-xs" onClick={() => { 
                            setTrackingOrder(order); 
                            setTrackStep(3); 
                            setView('tracking'); 
                         }}>Track Details</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              <div className="mt-12 text-center p-8 bg-gray-50 rounded-3xl border max-w-2xl mx-auto shadow-sm" style={{ borderColor: COLORS.softNavy }}>
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-500 shadow-sm">
                  <Mail size={24} />
                </div>
                <h4 className="text-xl font-black mb-2" style={{ color: COLORS.primary }}>Want to be part of Fetchr?</h4>
                <p className="text-sm font-bold" style={{ color: COLORS.accent }}>Contact fetchrapp@gmail.com</p>
              </div>
            </>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {assignedOrders.map(order => (
                 <Card key={order.id} className="p-6">
                    <h4 className="font-black text-lg">{order.itemName}</h4>
                    <p className="text-sm text-gray-500 mb-4">From: {order.pickup} → To: {order.delivery}</p>
                    <Button className="w-full">Update Task Status</Button>
                 </Card>
               ))}
             </div>
          )}
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="min-h-screen bg-white flex flex-col pb-8">
      <div className="max-w-3xl mx-auto w-full">
        <div className="p-6 flex items-center bg-white sticky top-0 z-50 border-b border-gray-100">
          <button onClick={() => setView('dashboard')} className="p-2 -ml-2 mr-4 flex items-center gap-2 font-bold" style={{ color: COLORS.primary }}>
            <ArrowLeft size={20} /> Back
          </button>
          <h2 className="text-2xl font-black text-gray-900">My Profile</h2>
        </div>

        <div className="p-8 space-y-8 flex-1">
          <div className="flex flex-col items-center mb-8">
             <div className="w-24 h-24 rounded-full flex items-center justify-center text-white mb-4 relative" style={{ background: HEADER_GRADIENT }}>
                <User size={40} />
                <div className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full border-4 border-white">
                  <Edit3 size={16} />
                </div>
             </div>
             <h3 className="text-2xl font-black text-gray-900">{user.name}</h3>
             <p className="text-gray-400 font-bold tracking-widest">{user.regNo}</p>
          </div>

          <Card className="p-6 space-y-6 shadow-sm">
            <Input label="Full Name" value={profileData.name} onChange={(v) => setProfileData({...profileData, name: v})} />
            <Input label="Registration Number" value={profileData.regNo} onChange={(v) => setProfileData({...profileData, regNo: v})} />
            <Input label="Phone Number" value={profileData.phone} onChange={(v) => setProfileData({...profileData, phone: v})} />
            <Input label="Email Address" value={profileData.email} onChange={(v) => setProfileData({...profileData, email: v})} />
            
            <Button className="w-full mt-4 flex items-center justify-center gap-2 py-4" onClick={handleUpdateProfile}>
              <Save size={20} /> Save Changes
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderCreateOrder = () => (
    <div className="min-h-screen bg-white flex flex-col pb-8">
      <div className="max-w-3xl mx-auto w-full">
        <div className="p-6 flex items-center bg-white sticky top-0 z-50 border-b border-gray-100">
          <button onClick={() => setView('dashboard')} className="p-2 -ml-2 mr-4 flex items-center gap-2 font-bold" style={{ color: COLORS.primary }}>
            <ArrowLeft size={20} /> Back
          </button>
          <h2 className="text-2xl font-black text-gray-900">New Request</h2>
        </div>

        <div className="p-8 space-y-8 flex-1">
          <Input label="Pickup Block/Hostel" options={ALL_LOCATIONS} value={orderForm.pickup} onChange={(v) => setOrderForm({...orderForm, pickup: v})} />
          <Input label="Pickup Specific Spot" placeholder="e.g. Room 201" value={orderForm.pickupDesc} onChange={(v) => setOrderForm({...orderForm, pickupDesc: v})} />
          <Input label="Delivery Block/Hostel" options={ALL_LOCATIONS} value={orderForm.delivery} onChange={(v) => setOrderForm({...orderForm, delivery: v})} />
          <Input label="Delivery Specific Spot" placeholder="e.g. Reception" value={orderForm.deliveryDesc} onChange={(v) => setOrderForm({...orderForm, deliveryDesc: v})} />
          <Input label="Item Name" placeholder="What are we moving?" value={orderForm.itemName} onChange={(v) => setOrderForm({...orderForm, itemName: v})} />
          <Input label="Instructions" placeholder="Optional notes" isTextArea={true} value={orderForm.itemDesc} onChange={(v) => setOrderForm({...orderForm, itemDesc: v})} />
          
          <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer active:scale-95 transition-all">
             <Camera size={32} className="mb-2" style={{ color: COLORS.accent }} />
             <span className="text-xs font-bold uppercase tracking-widest">Add Item Photo (Optional)</span>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-100 sticky bottom-0">
          <Button className="w-full py-5 text-xl" onClick={handleCreateOrder}>
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
       <div className="w-full max-w-xl">
          <button onClick={() => setView('create-order')} className="mb-8 p-2 flex items-center gap-2 font-bold" style={{ color: COLORS.primary }}>
            <ArrowLeft size={20} /> Back
          </button>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Select Payment</h2>
          <p className="text-gray-500 mb-8">Choose how you'd like to pay for this delivery.</p>

          <div className="space-y-4 mb-10">
             <div 
               onClick={() => setPaymentMethod('cod')}
               className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50/50' : 'bg-white'}`}
               style={{ borderColor: paymentMethod === 'cod' ? COLORS.accent : COLORS.softNavy }}
             >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center" style={{ color: COLORS.primary }}><Banknote /></div>
                   <div>
                      <p className="font-bold text-lg">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay the partner when item is delivered</p>
                   </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-orange-500' : 'border-gray-300'}`}>
                   {paymentMethod === 'cod' && <div className="w-3 h-3 bg-orange-600 rounded-full" />}
                </div>
             </div>

             <div 
               onClick={() => setPaymentMethod('paynow')}
               className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${paymentMethod === 'paynow' ? 'border-orange-500 bg-orange-50/50' : 'bg-white'}`}
               style={{ borderColor: paymentMethod === 'paynow' ? COLORS.accent : COLORS.softNavy }}
             >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center" style={{ color: COLORS.primary }}><CreditCard /></div>
                   <div>
                      <p className="font-bold text-lg">Pay Now</p>
                      <p className="text-xs text-gray-500">Fast & Secure UPI/Card payment</p>
                   </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'paynow' ? 'border-orange-500' : 'border-gray-300'}`}>
                   {paymentMethod === 'paynow' && <div className="w-3 h-3 bg-orange-600 rounded-full" />}
                </div>
             </div>
          </div>

          <Button 
            className="w-full py-5 text-xl" 
            disabled={isPaying}
            onClick={confirmOrder}
          >
            {isPaying ? <><Loader2 className="animate-spin" /> Simulating Payment...</> : "Place Order"}
          </Button>
       </div>
    </div>
  );

  const renderTracking = () => (
    <div className="min-h-screen bg-white flex flex-col p-8 items-center">
       <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-10">
             <button onClick={() => setView('dashboard')} className="p-2 flex items-center gap-2 font-bold" style={{ color: COLORS.primary }}>
               <ArrowLeft size={20} /> Back
             </button>
             <div className="text-right">
                <p className="text-[10px] font-black uppercase text-gray-400">Order ID</p>
                <p className="font-bold text-sm">#{trackingOrder?.id}</p>
             </div>
          </div>

          <div className="flex flex-col items-center mb-12">
             <div className="w-20 h-20 text-white rounded-3xl flex items-center justify-center mb-4 shadow-xl" style={{ background: HEADER_GRADIENT }}>
                <Truck size={40} />
             </div>
             <h2 className="text-2xl font-black text-gray-900">Tracking Delivery</h2>
             <p className="text-gray-500">{trackingOrder?.itemName}</p>
          </div>

          {/* Timeline */}
          <div className="relative pl-8 space-y-12">
             <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100"></div>
             {ORDER_STATUS_STEPS.map((status, index) => {
                const isActive = index <= trackStep;
                const isCurrent = index === trackStep;
                const isFinalStep = index === 3;
                const showGreen = isFinalStep && isActive;

                return (
                  <div key={status} className="relative flex items-center gap-6">
                     <div className={`absolute -left-[27px] w-5 h-5 rounded-full border-4 border-white shadow-sm z-10 transition-colors ${showGreen ? 'bg-green-600' : (isActive ? 'bg-[#0B1F3A]' : 'bg-gray-200')}`}></div>
                     <div className={`transition-all ${isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}`}>
                        <p className={`font-black uppercase text-xs tracking-widest ${showGreen ? 'text-green-600' : (isCurrent ? 'text-orange-500' : 'text-gray-500')}`}>
                           {isFinalStep && isActive ? `Partner ${trackingOrder?.partner?.regNo} Delivered` : status}
                        </p>
                        <p className="text-sm font-medium text-gray-400">
                           {index === 0 ? "Order received" : index === 1 ? "Partner picked up" : index === 2 ? "On route" : "Delivered successfully"}
                        </p>
                     </div>
                     {isCurrent && trackStep < 3 && <Loader2 className="animate-spin text-orange-500" size={16} />}
                  </div>
                )
             })}
          </div>

          {trackStep === 3 && (
            <div className="mt-12 animate-in fade-in zoom-in duration-500">
               <Card className="bg-green-50 border-green-100 text-center py-6">
                  <CheckCircle2 className="text-green-600 mx-auto mb-2" size={32} />
                  <p className="text-green-900 font-black">Your item has been delivered!</p>
                  <Button className="mt-4 bg-green-600 shadow-green-200" onClick={() => setView('dashboard')}>Return to Home</Button>
               </Card>
            </div>
          )}
       </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto min-h-screen font-sans bg-gray-50 relative flex flex-col">
      {message && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[300] bg-gray-900 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold text-sm animate-in slide-in-from-top">
          {message}
        </div>
      )}

      <div className="flex-1">
        {view === 'auth' && renderAuth()}
        {view === 'signup' && renderSignup()}
        {view === 'dashboard' && renderDashboard()}
        {view === 'create-order' && renderCreateOrder()}
        {view === 'payment' && renderPayment()}
        {view === 'tracking' && renderTracking()}
        {view === 'profile' && renderProfile()}
      </div>
      
      {user && (view === 'dashboard' || view === 'profile') && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 px-10 py-6 flex justify-between items-center z-50 rounded-t-[3rem] shadow-2xl md:hidden">
            <button 
              className={`flex flex-col items-center gap-1 ${view === 'dashboard' ? 'text-orange-500' : 'text-gray-300'}`}
              onClick={() => setView('dashboard')}
            >
              <Package size={26} />
              <span className="text-[10px] font-black uppercase">Activity</span>
            </button>
            <button 
              className="p-5 rounded-full -mt-20 border-[10px] border-gray-50 shadow-2xl text-white" 
              style={{ backgroundColor: COLORS.primary }}
              onClick={() => setView('create-order')}
            >
              <PlusCircle size={32} className="text-orange-400" />
            </button>
            <button 
              className={`flex flex-col items-center gap-1 ${view === 'profile' ? 'text-orange-500' : 'text-gray-300'}`}
              onClick={() => setView('profile')}
            >
              <User size={26} />
              <span className="text-[10px] font-black uppercase">Profile</span>
            </button>
        </div>
      )}
    </div>
  );
}