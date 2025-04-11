import {
    Home,
    User,
    ListCheck,
    Pill,
    Bell,
    FolderKanban,
    Image,
  } from "lucide-react";

const tabs =[
    { label: 'Dashboard', path: '/dashboard',icon:<Home /> },
    { label: 'Doctors Managment', path: '/dashboard/doctormanagment',icon:<FolderKanban />},
    { label: 'Patients', path: '/dashboard/patients', icon:<Pill />},
    { label: 'Specialities', path: '/dashboard/specialities' ,icon:<ListCheck />},
    { label: 'Notifications', path: '/dashboard/notifications', icon:<Bell />},
    { label: 'Banners', path: '/dashboard/banner', icon:<Image />},
    { label: 'Admins', path: '/dashboard/admins',icon:<User /> },
    
]

export default tabs;