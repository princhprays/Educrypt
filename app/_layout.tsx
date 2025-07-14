import { Slot, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fontFamilies } from '../theme';

const navItems = [
  { label: 'Home', route: '/', icon: '🏠' },
  { label: 'Issue Credential', route: '/CredentialForm', icon: '📝' },
  { label: 'Snapshot Export', route: '/SnapshotExport', icon: '📦' },
  { label: 'View Issued Credentials', route: '/CredentialList', icon: '📄' },
  { label: 'View Public Key', route: '/PublicKey', icon: '🔑' },
];

const SIDEBAR_WIDTH = 250; // Increased from 220 for more space
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarAnim] = useState(new Animated.Value(-SIDEBAR_WIDTH));

  const openSidebar = () => {
    setSidebarOpen(true);
    Animated.timing(sidebarAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: -SIDEBAR_WIDTH,
      duration: 200,
      useNativeDriver: false,
    }).start(() => setSidebarOpen(false));
  };

  const handleNav = (route: string) => {
    router.replace(route as any);
    closeSidebar();
  };

  const isHome = pathname === '/';

  return (
    <View style={styles.root}>
      {/* Burger icon */}
      {!isHome && (
        <TouchableOpacity style={styles.burger} onPress={openSidebar}>
          <Text style={styles.burgerIcon}>☰</Text>
        </TouchableOpacity>
      )}
      {/* Sidebar Drawer */}
      {sidebarOpen && (
        <Pressable style={styles.overlay} onPress={closeSidebar} />
      )}
      <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}> 
        {/* Branding section */}
        <View style={styles.branding}>
          <Text style={styles.logo}>🔒 EduCrypt</Text>
        </View>
        <View style={styles.divider} />
        {/* Nav items */}
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={[
              styles.navItem,
              pathname === item.route && styles.activeNavItem,
            ]}
            onPress={() => handleNav(item.route)}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[
              styles.navText,
              pathname === item.route && styles.activeNavText,
            ]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
      {/* Main content */}
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  burger: {
    position: 'absolute',
    top: 40, // Lower the burger icon only
    left: 16,
    zIndex: 20,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 8,
    shadowColor: colors.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  burgerIcon: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: 'bold',
  },
  sidebar: {
    position: 'absolute',
    top: 0, // Restore sidebar to top
    left: 0,
    width: SIDEBAR_WIDTH,
    height: '100%', // Restore sidebar height
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderColor: colors.border,
    paddingTop: 0, // Remove extra padding, handled by branding
    flexDirection: 'column',
    alignItems: 'flex-start',
    shadowColor: colors.border,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 30,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: '100%',
    backgroundColor: colors.overlay,
    zIndex: 25,
  },
  branding: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 28,
    marginBottom: 8,
    marginTop: 24, // Add margin at the top
  },
  logo: {
    fontFamily: fontFamilies.regular,
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    alignSelf: 'center',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 16,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 8,
    width: '100%',
    position: 'relative',
  },
  navIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  navText: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    color: colors.textSecondary,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  activeNavItem: {
    backgroundColor: colors.primary,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5', // darker accent for active
  },
  activeNavText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 0,
  },
});
