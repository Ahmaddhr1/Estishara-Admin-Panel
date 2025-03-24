import {
    Home,
    LogOut,
    TimerIcon,
    User,
    ListCheck,
    Menu,
    X,
  } from "lucide-react";

const tabs =[
    { label: 'Dashboard', path: '/dashboard',icon:<Home /> },
    { label: 'Pending Doctors', path: '/dashboard/pendingdoctors',icon:<TimerIcon />},
    { label: 'Specialities', path: '/dashboard/specialities' ,icon:<ListCheck />},
    { label: 'Admins', path: '/dashboard/admins',icon:<User /> },
    { label: 'Logout', path: '/logout', icon:<LogOut /> },
]

export default tabs;