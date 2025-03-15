import { INavData } from "@coreui/angular";

export const navItems: INavData[] = [
  {
    name: "Collection",
    url: "/Home/base/tabs/add",
    iconComponent: { name: "cil-puzzle" },
    // children: [
    //   {
    //     name: 'Collection',
    //     url: '/Home/base/tabs/add',
    //     icon: 'nav-icon-bullet'
    //     // children: [
    //     //   {
    //     //     name: 'Add', // Submenu 1
    //     //     url: '/Home/base/tabs/add', // Add a proper route here
    //     //   },
    //     //   // {
    //     //   //   name: 'View', // Submenu 2
    //     //   //   url: '/Home/base/tabs/view', // Add a proper route here
    //     //   // },
    //     // ],
    //   },
    // ],
  },
  {
    name: "List",
    // url: '',
    url: "/Home/base/tabs/view",
    iconComponent: { name: "cil-puzzle" },
  },
  {
    name: "Report",
    // url: '',
    url: "/Home/base/tabs/report",
    iconComponent: { name: "cil-puzzle" },
  },
  {
    name: "Masters", // New main menu item
    iconComponent: { name: "cil-settings" }, // Change icon if needed
    children: [
      {
        name: "Hospital", // Submenu under "Master"
        url: "/Home/base/tabs/hospital", // Define the route for User
        iconComponent: { name: "cil-building" }, // Icon for submenu item
      },
      {
        name: "Department", // Submenu under "Master"
        url: "/Home/base/tabs/department", // Define the route for User
        iconComponent: { name: "cil-layers" }, // Icon for submenu item
      },
      {
        name: "Investigation", // Submenu under "Master"
        url: "/Home/base/tabs/investigation", // Define the route for User
        iconComponent: { name: "cil-layers" }, // Icon for submenu item
      },
      {
        name: "Antibiotic", // Submenu under "Master"
        url: "/Home/base/tabs/antibiotic", // Define the route for User
        iconComponent: { name: "cil-tablet" }, // Icon for submenu item
      },
    ],
  },
];
