import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'

import { LuLayoutDashboard } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { RiFeedbackLine } from "react-icons/ri";
import { MdPayment } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { IoMdCube } from "react-icons/io";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdPeople } from "react-icons/md";
import { MdCategory } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaCity } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";
import { FaBell } from "react-icons/fa";
import { FaComments } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const { notifications } = useNotifications();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LuLayoutDashboard },
    { path: '/user-management', label: 'User Management', icon: MdPeople, adminOnly: true },
    { path: '/category-management', label: 'Category Management', icon: MdCategory, adminOnly: true },
    { path: '/city-management', label: 'City Management', icon: FaCity, adminOnly: true },
    { path: '/price-management', label: 'Price Management', icon: MdPayment, adminOnly: true },
    { path: '/vehicle-management', label: 'Vehicle Management', icon: FaCar, notificationKey: 'pendingVehicles' },
    { path: '/delivery-service-management', label: 'Delivery Services', icon: FaTruck, adminOnly: true },
    { path: '/rider-management', label: 'Rider Management', icon: CgProfile, notificationKey: 'pendingRiders' },
    { path: '/customer-management', label: 'Customer Management', icon: FaUser, notificationKey: 'pendingCustomers' },
    { path: '/order-placement', label: 'Order Placement', icon: FaShoppingCart },
    { path: '/OrderManagement', label: 'Order Management', icon: IoMdCube, notificationKey: 'pendingOrders' },
    { 
      path: '/payment-management', 
      label: 'Payment Management', 
      icon: MdPayment,
      submenu: [
        { path: '/payment-management', label: 'Payment Overview' },
        { path: '/bank-account-management', label: 'Bank Account', icon: BsBank2 }
      ]
    },
    { path: '/CustomerSupport', label: 'Customer Support', icon: FaRegUser, notificationKey: 'unreadMessages' },
    { path: '/admin-chat-management', label: 'Chat Management', icon: FaComments },
    { path: '/FeedbackSystem', label: 'Feedback System', icon: RiFeedbackLine },
    { path: '/ReportAnalytics', label: 'Report Analytics', icon: HiOutlineDocumentReport },
    { path: '/about-us', label: 'About Us', icon: FaInfoCircle },
  ];

  const isActive = (path) => location.pathname === path;
  
  const isSubmenuActive = (menuItem) => {
    if (menuItem.submenu) {
      return menuItem.submenu.some(item => isActive(item.path));
    }
    return isActive(menuItem.path);
  };
  
  const [openSubmenu, setOpenSubmenu] = React.useState(null);

  return (
    <div style={{
      width: 300,
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>ParcelPro</h2>
          {notifications.total > 0 && (
            <div style={{ position: 'relative' }}>
              <FaBell style={{ fontSize: '20px', opacity: 0.9 }} />
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#EF4444',
                color: 'white',
                borderRadius: '10px',
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: 'bold',
                minWidth: '18px',
                textAlign: 'center',
                border: '2px solid #764ba2'
              }}>
                {notifications.total > 99 ? '99+' : notifications.total}
              </span>
            </div>
          )}
        </div>
        <p style={{ margin: 0, opacity: 0.8 }}>Admin Dashboard</p>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>{user?.name}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>{user?.role}</div>
          </div>
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {menuItems.map((item) => {
          if (item.adminOnly && user?.role !== 'admin') return null;
          
          const IconComponent = item.icon;
          return (
            <li key={item.path} style={{ marginBottom: '5px' }}>
              <div>
                {item.submenu ? (
                  <div 
                    onClick={() => setOpenSubmenu(openSubmenu === item.path ? null : item.path)}
                    style={{
                      textDecoration: 'none',
                      color: 'white',
                      display: 'block',
                      cursor: 'pointer'
                    }}
                  >
                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '15px 20px',
                        backgroundColor: isSubmenuActive(item) ? 'rgba(255,255,255,0.2)' : 'transparent',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubmenuActive(item)) {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubmenuActive(item)) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <div style={{ width: '24px', marginRight: '15px', fontSize: '18px' }}>
                          <IconComponent />
                        </div>
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: isSubmenuActive(item) ? '600' : '400' 
                        }}>
                          {item.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.notificationKey && notifications[item.notificationKey] > 0 && (
                          <span style={{
                            backgroundColor: '#EF4444',
                            color: 'white',
                            borderRadius: '10px',
                            padding: '2px 8px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            minWidth: '20px',
                            textAlign: 'center'
                          }}>
                            {notifications[item.notificationKey] > 99 ? '99+' : notifications[item.notificationKey]}
                          </span>
                        )}
                        <span style={{ 
                          transform: openSubmenu === item.path ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease',
                          fontSize: '12px'
                        }}>
                          ▼
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    style={{
                      textDecoration: 'none',
                      color: 'white',
                      display: 'block',
                      cursor: 'pointer'
                    }}
                  >
                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '15px 20px',
                        backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive(item.path)) {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive(item.path)) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <div style={{ width: '24px', marginRight: '15px', fontSize: '18px' }}>
                          <IconComponent />
                        </div>
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: isActive(item.path) ? '600' : '400' 
                        }}>
                          {item.label}
                        </span>
                      </div>
                      {item.notificationKey && notifications[item.notificationKey] > 0 && (
                        <span style={{
                          backgroundColor: '#EF4444',
                          color: 'white',
                          borderRadius: '10px',
                          padding: '2px 8px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          minWidth: '20px',
                          textAlign: 'center',
                          marginLeft: '8px'
                        }}>
                          {notifications[item.notificationKey] > 99 ? '99+' : notifications[item.notificationKey]}
                        </span>
                      )}
                    </div>
                  </Link>
                )}
                
                {item.submenu && openSubmenu === item.path && (
                  <div style={{ 
                    marginLeft: '20px', 
                    marginTop: '5px',
                    borderLeft: '1px solid rgba(255,255,255,0.1)',
                    paddingLeft: '15px'
                  }}>
                    {item.submenu.map((subItem, subIndex) => {
                      const SubIcon = subItem.icon || (() => <span style={{ width: '24px', marginRight: '15px' }}>•</span>);
                      return (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          style={{
                            textDecoration: 'none',
                            color: 'white',
                            display: 'block',
                            marginBottom: '5px'
                          }}
                        >
                          <div 
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '10px 15px',
                              backgroundColor: isActive(subItem.path) ? 'rgba(255,255,255,0.15)' : 'transparent',
                              borderRadius: '6px',
                              transition: 'all 0.3s ease',
                              fontSize: '13px',
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive(subItem.path)) {
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive(subItem.path)) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }
                            }}
                          >
                            <SubIcon style={{ marginRight: '10px', fontSize: '14px' }} />
                            {subItem.label}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}