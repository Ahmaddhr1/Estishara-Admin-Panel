import {
    Home,
    LogOut,
    TimerIcon,
    User,
    ListCheck,
    Menu,
    X,
    Pill,
    Bell,
  } from "lucide-react";

const tabs =[
    { label: 'Dashboard', path: '/dashboard',icon:<Home /> },
    { label: 'Pending Doctors', path: '/dashboard/pendingdoctors',icon:<TimerIcon />},
    { label: 'Patients', path: '/dashboard/patients', icon:<Pill />},
    { label: 'Specialities', path: '/dashboard/specialities' ,icon:<ListCheck />},
    { label: 'Notifications', path: '/dashboard/notifications', icon:<Bell />},
    { label: 'Admins', path: '/dashboard/admins',icon:<User /> },
    
]

export default tabs;